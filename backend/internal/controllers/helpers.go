package controllers

import (
	"dibs/internal/models"

	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
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