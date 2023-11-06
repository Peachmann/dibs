package controllers

import (
	"dibs/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func ListItems(c *gin.Context, db *gorm.DB) {
	var items []models.ItemListing
	if result := db.Find(&items); result.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch item listings"})
		return
	}
	c.JSON(200, items)
}


func CreateItem(c *gin.Context, db *gorm.DB) {
	var newItem models.ItemListing
	if err := c.ShouldBindJSON(&newItem); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if result := db.Create(&newItem); result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item listing"})
		return
	}

	c.JSON(http.StatusCreated, newItem)
}

func DeleteItemByID(c *gin.Context, db *gorm.DB) {
    id := c.Param("id")

    var result = db.Delete(&models.ItemListing{}, id)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete item listing"})
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Item deleted successfully"})
}

func EditItemByID(c *gin.Context, db *gorm.DB) {
    id := c.Param("id")
    var updates map[string]interface{}

    if err := c.ShouldBindJSON(&updates); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
        return
    }

    result := db.Model(&models.ItemListing{}).Where("id = ?", id).Updates(updates)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item listing"})
        return
    }

    if result.RowsAffected == 0 {
        c.JSON(http.StatusNotFound, gin.H{"error": "No item found with the given ID"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Item updated successfully"})
}
