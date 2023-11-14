package models

import (
	"gorm.io/gorm"
)

type ItemListing struct {
	gorm.Model
	SellerUsername 	string      `json:"seller_username" binding:"required"`
	Title       	string     	`json:"title" binding:"required"`
	Description 	string     	`json:"description"`
	Price       	float64    	`json:"price" binding:"required"`
	Picture     	string     	`json:"picture"`
	NotSold     	bool	 	`json:"not_sold"`
	PickupPoint 	string     	`json:"pickup_point"`
	IsDibsed 		bool	   	`json:"is_dibsed"`
}

type Dibs struct {
    gorm.Model
    Active        bool        `gorm:"default:true"`
    ItemID        uint        `json:"item_id" gorm:"column:item_listing_id"`
    BuyerUsername string      `json:"buyer_username"`
}


type User struct {
	ID        uint   `json:"id"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	PhotoURL  string `json:"photo_url"`
	AuthDate  string `json:"auth_date"`
	Hash      string `json:"hash"`
}
