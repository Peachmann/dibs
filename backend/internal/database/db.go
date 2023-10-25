package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var db *pgxpool.Pool

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

func InitConnectionPool() {

	loadEnv()

	poolConfig, err := pgxpool.ParseConfig(createDatabaseUrl())
	if err != nil {
		log.Fatalln("Unable to parse DATABASE_URL:", err)
	}

	db, err = pgxpool.NewWithConfig(context.Background(), poolConfig)
	if err != nil {
		log.Fatalln("Unable to create connection pool:", err)
	}

	log.Println("Connected to database")
}

func GetConnection() *pgxpool.Pool {
	return db
}
