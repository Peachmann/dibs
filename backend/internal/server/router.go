package server

import (
	"log"
	"net/http"

	"dibs/internal/database"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func setRouter() *gin.Engine {
	// Creates default gin router with Logger and Recovery middleware already attached
	router := gin.Default()
	router.Use(cors.Default())

	// Create API route group
	api := router.Group("/api")
	{
		// Add /hello GET route to router and define route handler function
		api.GET("/hello", func(ctx *gin.Context) {
			db := database.GetConnection()

			type Row struct {
				user_id      int
				display_name string
			}

			rows, err := db.Query(ctx, "SELECT user_id, display_name FROM users")
			if err != nil {
				log.Fatal(err)
			}
			var rowSlice []Row

			for rows.Next() {
				var r Row
				err := rows.Scan(&r.user_id, &r.display_name)
				if err != nil {
					log.Fatal(err)
				}
				rowSlice = append(rowSlice, r)
			}

			ctx.JSON(200, gin.H{"user_id": rowSlice[0].user_id, "display_name": rowSlice[0].display_name})
		})
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
