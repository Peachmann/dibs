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
    SellerID    uint
    Title       string
    Description string
    Price       float64
    Picture     string
    SoldAt      *time.Time
    PickupPoint string
    Seller      User `gorm:"foreignKey:SellerID"`
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
