package database

import (
	"dibs/internal/models"
	"log"
	"os"

	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func loadEnv() {
	err := godotenv.Load("configs/database.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func createDatabaseUrl() string {
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")
	database := os.Getenv("POSTGRES_DB")
	container := os.Getenv("POSTGRES_CONTAINER")

	return "postgres://" + user + ":" + password + "@" + container + "/" + database
}



func InitDB() (*gorm.DB, error) {
	loadEnv()

	dsn := ""

	if (os.Getenv("ENV") == "PROD") {
		 dsn = os.Getenv("DATABASE_URL")
	} else {
		dsn = createDatabaseUrl()
	}

	var err error
	db, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("Failed to get database connection:", err)
	}

	err = sqlDB.Ping()
	if err != nil {
		log.Fatal("Failed to ping database:", err)
	}

	err = db.AutoMigrate(&models.User{}, &models.ItemListing{}, &models.Dibs{})
	if err != nil {
		return nil, err
	}

	log.Println("Connected to database and performed AutoMigrate")
	return db, nil
}

func GetDB() *gorm.DB {
	return db
}
