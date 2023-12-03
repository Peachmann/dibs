package controllers

import (
	"dibs/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateDibs(c *gin.Context, db *gorm.DB) {
    var requestBody DibsRequestBody

    if err := c.BindJSON(&requestBody); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    if !authorizeUser(c, requestBody.User) {
        return
    }

    itemIDStr := c.Param("id")
    itemID, err := strconv.Atoi(itemIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
        return
    }

    var item models.ItemListing
    if result := db.First(&item, itemID); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    if item.IsDibsed {
        c.JSON(http.StatusConflict, gin.H{"error": "Item is already dibsed"})
        return
    }

    item.IsDibsed = true
    if result := db.Save(&item); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item status"})
        return
    }

    dibs := models.Dibs{
        ItemID:        uint(itemID),
        BuyerUsername: requestBody.User.Username,
    }

    if result := db.Create(&dibs); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create dibs"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Dibs created successfully", "dibs": dibs})
}

func DeleteDibs(c *gin.Context, db *gorm.DB) {
    var requestBody DibsRequestBody

    if err := c.BindJSON(&requestBody); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
        return
    }

    if !authorizeUser(c, requestBody.User) {
        return
    }

    itemIDStr := c.Param("id")
    itemID, err := strconv.Atoi(itemIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
        return
    }

    var item models.ItemListing
    if result := db.First(&item, itemID); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    var dibs models.Dibs
    if result := db.Where("item_listing_id = ?", itemID).First(&dibs); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No dibs found for the given item"})
        return
    }

    if requestBody.User.Username != item.SellerUsername && requestBody.User.Username != dibs.BuyerUsername {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized action"})
        return
    }

    item.IsDibsed = false
    if result := db.Save(&item); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item status"})
        return
    }

    if result := db.Delete(&dibs); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete dibs"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Dibs deleted successfully"})
}

func GetDibs(c *gin.Context, db *gorm.DB) {
    itemIDStr := c.Param("id")
    itemID, err := strconv.Atoi(itemIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
        return
    }

    user := c.Param("user")
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid username"})
        return
    }

    var item models.ItemListing
    if result := db.First(&item, itemID); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    var dibs models.Dibs
    result := db.Where("item_listing_id = ? AND buyer_username = ? AND deleted_at is null", itemID, user).First(&dibs);
    if result.RowsAffected == 0 {
        c.JSON(http.StatusOK, gin.H{"own_dibs": false})
        return
    } else {
        c.JSON(http.StatusOK, gin.H{"own_dibs": true})
        return
    }
}
