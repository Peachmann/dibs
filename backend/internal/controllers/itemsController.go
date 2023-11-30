package controllers

import (
	"dibs/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)


func CreateItem(c *gin.Context, db *gorm.DB) {
    if err := c.Request.ParseMultipartForm(10 << 20); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Error parsing multipart form"})
        return
    }

    user, err := ParseUser(c.Request.Form["user"][0])
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user data"})
        return
    }

    itemListing, err := ParseItemListing(c.Request.Form["item_listing"][0])
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item listing data"})
        return
    }

    if err := c.ShouldBind(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user data"})
        return
    }

    if err := c.ShouldBind(&itemListing); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid item listing data"})
        return
    }

    if !authorizeUser(c, user) {
        return
    }

    itemListing.SellerUsername = user.Username

    if err := ensureDir("uploads"); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create directory"})
        return
    }

    if result := db.Create(&itemListing); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item listing"})
        return
    }

    picturePaths, err := ProcessImageUploads(c, itemListing.ID)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process image uploads"})
        return
    }

    if err := SetPictures(&itemListing, picturePaths); err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set pictures"})
        return
    }
    
    if result := db.Save(&itemListing); result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item listing with images"})
        return
    }
    

    c.JSON(http.StatusCreated, itemListing)
}

func ListItems(c *gin.Context, db *gorm.DB) {
	var items []models.ItemListing
	if result := db.Find(&items); result.Error != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch item listings"})
		return
	}

	// Deserialize the pictures for each item listing
	for i := range items {
		pictures, err := GetPictures(&items[i])
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get pictures"})
			return
		}
		items[i].Pictures = pictures
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
