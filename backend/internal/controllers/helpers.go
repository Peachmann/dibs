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
)

// authorizeUser checks the user's authorization
func authorizeUser(c *gin.Context) bool {
	userDataQueryString := structToQueryString(models.User{
		ID:        uint(getUserID(c)),
		FirstName: c.GetHeader("First-Name"),
		LastName:  c.GetHeader("Last-Name"),
		Username:  c.GetHeader("Username"),
		PhotoURL:  c.GetHeader("Photo-Url"),
		AuthDate:  c.GetHeader("Auth-Date"),
		Hash:      c.GetHeader("Auth-Hash"),
	})

	telegramToken := os.Getenv("TELEGRAM_TOKEN")
	if telegramToken == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Telegram token not found"})
		return false
	}

	if !checkTelegramAuthorization(userDataQueryString, telegramToken) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return false
	}

	return true
}

// getUserID extracts and returns the user ID from the context
func getUserID(c *gin.Context) int {
	userIdStr := c.GetHeader("User-Id")
	userId, _ := strconv.Atoi(userIdStr)
	return userId
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