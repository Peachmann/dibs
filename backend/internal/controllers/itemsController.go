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
