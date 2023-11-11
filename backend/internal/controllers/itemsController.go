package controllers

import (
	"crypto/hmac"
	"crypto/sha256"
	"dibs/internal/models"
	"encoding/hex"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"sort"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func checkTelegramAuthorization(data, token string) bool {
	params, _ := url.ParseQuery(data)
	strs := []string{}
	var hash = ""
	for k, v := range params {
		if k == "hash" {
			hash = v[0]
			continue
		}
		strs = append(strs, k+"="+v[0])
	}
	sort.Strings(strs)
	var imploded = ""
	for _, s := range strs {
		if imploded != "" {
			imploded += "\n"
		}
		imploded += s
	}
	fmt.Println(strs)
	sha256hash := sha256.New()
	io.WriteString(sha256hash, token)
	hmachash := hmac.New(sha256.New, sha256hash.Sum(nil))
	io.WriteString(hmachash, imploded)
	ss := hex.EncodeToString(hmachash.Sum(nil))
	fmt.Println(ss)
	return hash == ss
}

type CreateItemRequest struct {
	User models.User        `json:"user"`
	Item models.ItemListing `json:"item"`
}

func structToQueryString(data interface{}) string {
    v := reflect.ValueOf(data)

    var queryParts []string
    for i := 0; i < v.NumField(); i++ {
        field := v.Field(i)
        jsonTag := v.Type().Field(i).Tag.Get("json")
        tagParts := strings.Split(jsonTag, ",")
        tagName := tagParts[0]

        if tagName != "-" && field.IsValid() && field.CanInterface() {
            value := field.Interface()
            strValue := fmt.Sprintf("%v", value)
            queryParts = append(queryParts, url.QueryEscape(tagName)+"="+url.QueryEscape(strValue))
        }
    }

    return strings.Join(queryParts, "&")
}

func CreateItem(c *gin.Context, db *gorm.DB) {
    // Extracting user data from headers
    userIdStr := c.GetHeader("User-Id")
    userId, err := strconv.Atoi(userIdStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    userData := models.User{
        ID:        uint(userId),
        FirstName: c.GetHeader("First-Name"),
        LastName:  c.GetHeader("Last-Name"),
        Username:  c.GetHeader("Username"),
        PhotoURL:  c.GetHeader("Photo-Url"),
        AuthDate:  c.GetHeader("Auth-Date"),
        Hash:      c.GetHeader("Auth-Hash"),
    }

    // Convert User data to query string format for authorization check
    userDataQueryString := structToQueryString(userData)

    // Get the Telegram token from the environment variable
    telegramToken := os.Getenv("TELEGRAM_TOKEN")
    if telegramToken == "" {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Telegram token not found"})
        return
    }

    // Check Telegram Authorization
    if !checkTelegramAuthorization(userDataQueryString, telegramToken) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    // Proceed with creating the item
    var newItem models.ItemListing
    if err := c.ShouldBindJSON(&newItem); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    newItem.SellerUsername = userData.Username // Set the seller username from the authorized user

    if result := db.Create(&newItem); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item listing"})
        return
    }

    c.JSON(http.StatusCreated, newItem)
}


func ListItems(c *gin.Context, db *gorm.DB) {
	var items []models.ItemListing
	if result := db.Find(&items); result.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch item listings"})
		return
	}
	c.JSON(200, items)
}

func DeleteItemByID(c *gin.Context, db *gorm.DB) {
	id := c.Param("id")

	// Extracting user data from headers
	userIdStr := c.GetHeader("User-Id")
	userId, err := strconv.Atoi(userIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	userData := models.User{
		ID:        uint(userId),
		FirstName: c.GetHeader("First-Name"),
		LastName:  c.GetHeader("Last-Name"),
		Username:  c.GetHeader("Username"),
		PhotoURL:  c.GetHeader("Photo-Url"),
		AuthDate:  c.GetHeader("Auth-Date"),
		Hash:      c.GetHeader("Auth-Hash"),
	}

	// Convert User data to query string format for authorization check
	userDataQueryString := structToQueryString(userData)

	// Get the Telegram token from the environment variable
	telegramToken := os.Getenv("TELEGRAM_TOKEN")
	if telegramToken == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Telegram token not found"})
		return
	}

	// Check Telegram Authorization
	if !checkTelegramAuthorization(userDataQueryString, telegramToken) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Fetch the item from the database
	var item models.ItemListing
	if result := db.First(&item, id); result.Error != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
		return
	}

	// Check if the username matches
	if item.SellerUsername != userData.Username {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized to delete this item"})
		return
	}

	// Delete the item
	if result := db.Delete(&item); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item listing"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
}


func EditItemByID(c *gin.Context, db *gorm.DB) {
    id := c.Param("id")

    // Extracting user data from headers
    userIdStr := c.GetHeader("User-Id")
    userId, err := strconv.Atoi(userIdStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
        return
    }

    userData := models.User{
        ID:        uint(userId),
        FirstName: c.GetHeader("First-Name"),
        LastName:  c.GetHeader("Last-Name"),
        Username:  c.GetHeader("Username"),
        PhotoURL:  c.GetHeader("Photo-Url"),
        AuthDate:  c.GetHeader("Auth-Date"),
        Hash:      c.GetHeader("Auth-Hash"),
    }

    // Convert User data to query string format for authorization check
    userDataQueryString := structToQueryString(userData)

    // Get the Telegram token from the environment variable
    telegramToken := os.Getenv("TELEGRAM_TOKEN")
    if telegramToken == "" {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Telegram token not found"})
        return
    }

    // Check Telegram Authorization
    if !checkTelegramAuthorization(userDataQueryString, telegramToken) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return
    }

    // Fetch the item from the database
    var item models.ItemListing
    if result := db.First(&item, id); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    // Check if the username matches
    if item.SellerUsername != userData.Username {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized to edit this item"})
        return
    }

    // Parse the update payload
    var updates map[string]interface{}
    if err := c.ShouldBindJSON(&updates); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid update payload"})
        return
    }

    // Perform the update
    result := db.Model(&item).Updates(updates)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item listing"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Item updated successfully"})
}
