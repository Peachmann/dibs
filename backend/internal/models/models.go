package models

import (
	"time"

	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	DisplayName string `gorm:"unique"`
	TelegramID  string `gorm:"unique"`
}

type ItemListing struct {
	gorm.Model
	SellerID    uint       `json:"seller_id" binding:"required"`
	Title       string     `json:"title" binding:"required"`
	Description string     `json:"description"`
	Price       float64    `json:"price" binding:"required"`
	Picture     string     `json:"picture"`
	SoldAt      *time.Time `json:"sold_at"`
	PickupPoint string     `json:"pickup_point"`
}

type Dibs struct {
    gorm.Model
    ItemID   uint
    BuyerID  uint
    DibsedAt time.Time `gorm:"autoCreateTime"`
    Active   bool       `gorm:"default:true"`
    Item     ItemListing `gorm:"foreignKey:ItemID"`
    Buyer    User       `gorm:"foreignKey:BuyerID"`
}
