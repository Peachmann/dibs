package controllers

import (
	"dibs/internal/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func CreateDibs(c *gin.Context, db *gorm.DB) {
    if !authorizeUser(c) {
        return
    }

    // Get ItemID from query parameters
    itemIDStr := c.Param("id")
    itemID, err := strconv.Atoi(itemIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
        return
    }

    // Fetch the item from the database
    var item models.ItemListing
    if result := db.First(&item, itemID); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    // Check if the item is already dibsed
    if item.IsDibsed {
        c.JSON(http.StatusConflict, gin.H{"error": "Item is already dibsed"})
        return
    }

    // Mark the item as dibsed
    item.IsDibsed = true
    if result := db.Save(&item); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item status"})
        return
    }

    // Create and save the dibs
    dibs := models.Dibs{
        ItemID:        uint(itemID),
        BuyerUsername: c.GetHeader("Username"),
    }

    if result := db.Create(&dibs); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create dibs"})
        return
    }

    c.JSON(http.StatusCreated, gin.H{"message": "Dibs created successfully", "dibs": dibs})
}


func DeleteDibs(c *gin.Context, db *gorm.DB) {
    // Authorization check
    if !authorizeUser(c) {
        return
    }

    // Get ItemID from query parameters
    itemIDStr := c.Param("id")
    itemID, err := strconv.Atoi(itemIDStr)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item ID"})
        return
    }

    // Fetch the item from the database
    var item models.ItemListing
    if result := db.First(&item, itemID); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    // Fetch the dibs from the database
    var dibs models.Dibs
    if result := db.Where("item_listing_id = ?", itemID).First(&dibs); result.Error != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "No dibs found for the given item"})
        return
    }

    // Get the username of the authenticated user
    username := c.GetHeader("Username")

    // Check if the user is the item listing owner or the dibs maker
    if username != item.SellerUsername && username != dibs.BuyerUsername {
        c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized action"})
        return
    }

    // Mark the item as undibsed
    item.IsDibsed = false
    if result := db.Save(&item); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item status"})
        return
    }

    // Delete the dibs from the database
    if result := db.Delete(&dibs); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete dibs"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Dibs deleted successfully"})
}


