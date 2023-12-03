package controllers

import (
	"dibs/internal/models"
	"time"

	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"reflect"
	"sort"
	"strings"

	"github.com/gin-gonic/gin"
)

type ListingRequestBody struct {
    User        models.User        `json:"user"`
    ItemListing models.ItemListing `json:"item_listing"`
}

type DibsRequestBody struct {
    User        models.User        `json:"user"`
    Dibs		models.Dibs		   `json:"dibs"`
}

func ParseUser(data string) (models.User, error) {
    var user models.User
    err := json.Unmarshal([]byte(data), &user)
    return user, err
}

func ParseItemListing(data string) (models.ItemListing, error) {
    var itemListing models.ItemListing
    err := json.Unmarshal([]byte(data), &itemListing)
    return itemListing, err
}

func ProcessImageUploads(c *gin.Context, itemListingID uint) ([]string, error) {
    var picturePaths []string
    for i := 0; i < 5; i++ {
        file, fileHeader, err := c.Request.FormFile(fmt.Sprintf("picture%d", i+1))
        if err != nil {
            continue
        }

        buffer := make([]byte, 512)
        _, err = file.Read(buffer)
        if err != nil {
            return nil, err
        }

        file.Seek(0, 0)

        contentType := http.DetectContentType(buffer)
        if contentType != "image/jpeg" && contentType != "image/png" {
            continue
        }

        sec := time.Now().Unix()
        filePath := fmt.Sprintf("/images/%d_%d_%d.jpg", itemListingID, i, sec)
        if err := c.SaveUploadedFile(fileHeader, filePath); err != nil {
            return nil, err
        }

        picturePaths = append(picturePaths, filePath)
        fmt.Println("Picture paths:")
        fmt.Println(picturePaths)
    }
    return picturePaths, nil
}

func ensureDir(dirName string) error {
    err := os.MkdirAll(dirName, os.ModePerm)
    if err != nil {
        return err
    }
    return nil
}

// Custom setter for Pictures - marshals the slice into a JSON string
func SetPictures(il *models.ItemListing, pictures []string) error {
    data, err := json.Marshal(pictures)
    if err != nil {
        return err
    }
    il.PicturesData = string(data)
    return nil
}

// Custom getter for Pictures - unmarshals the JSON string back into a slice
func GetPictures(il *models.ItemListing) ([]string, error) {
    var pictures []string
    if err := json.Unmarshal([]byte(il.PicturesData), &pictures); err != nil {
        return nil, err
    }
    return pictures, nil
}

func authorizeUser(c *gin.Context, user models.User) bool {
    userDataQueryString := structToQueryString(user)

    telegramToken := os.Getenv("TELEGRAM_TOKEN")
    if telegramToken == "" {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Telegram token not found"})
        return false
    }

    // Check authorization using the query string
    if !checkTelegramAuthorization(userDataQueryString, telegramToken) {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
        return false
    }

    return true
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