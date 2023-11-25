package controllers

import (
	"dibs/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateItem(c *gin.Context, db *gorm.DB) {
    var requestBody ListingRequestBody

    if err := c.BindJSON(&requestBody); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Inva123lid request body"})
        return
    }

    if !authorizeUser(c, requestBody.User) {
        return
    }

    newItem := requestBody.ItemListing
    newItem.SellerUsername = requestBody.User.Username

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

    var requestBody ListingRequestBody

    if err := c.BindJSON(&requestBody); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    if !authorizeUser(c, requestBody.User) {
        return
    }

    var item models.ItemListing
    if result := db.First(&item, id); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    if item.SellerUsername != requestBody.User.Username {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized to delete this item"})
        return
    }

    if result := db.Delete(&item); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item listing"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
}

func EditItemByID(c *gin.Context, db *gorm.DB) {
    id := c.Param("id")

    var requestBody ListingRequestBody

    if err := c.BindJSON(&requestBody); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    if !authorizeUser(c, requestBody.User) {
        return
    }

    var item models.ItemListing
    if result := db.First(&item, id); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    if item.SellerUsername != requestBody.User.Username {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized to edit this item"})
        return
    }

    result := db.Model(&item).Updates(requestBody.ItemListing)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item listing"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Item updated successfully"})
}
