package server

import (
	db "dibs/internal/database"
)

func Start() {
	router := setRouter()

	db.InitConnectionPool()

	// Start listening and serving requests
	router.Run(":8080")
}
