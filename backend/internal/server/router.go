// router.go
package server

import (
	"dibs/internal/controllers"
	"dibs/internal/database"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func helloEndpoint(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"message": "Hello World"})
}

func SetRouter() *gin.Engine {
	router := gin.Default()

	// Setting CORS config
	config := cors.DefaultConfig()
	config.AllowAllOrigins = true
	config.AllowHeaders = []string{"Origin", "Content-Length", "Content-Type", "Authorization", "ngrok-skip-browser-warning"}
	router.Use(cors.New(config))

	api := router.Group("/api")
	{
		api.GET("/hello", helloEndpoint)
		api.GET("/items", func(c *gin.Context) {
			controllers.ListItems(c, database.GetDB())
		})
		api.POST("/items", func(c *gin.Context) {
			controllers.CreateItem(c, database.GetDB())
		})
		api.DELETE("/items/:id", func(c *gin.Context) {
			controllers.DeleteItemByID(c, database.GetDB())
		})
		api.PATCH("/items/:id", func(c *gin.Context) {
			controllers.EditItemByID(c, database.GetDB())
		})
		api.POST("/dibs/:id", func(c *gin.Context) {
			controllers.CreateDibs(c, database.GetDB())
		})
		api.DELETE("/dibs/:id", func(c *gin.Context) {
			controllers.DeleteDibs(c, database.GetDB())
		})
	}

	router.NoRoute(func(ctx *gin.Context) { ctx.JSON(http.StatusNotFound, gin.H{}) })

	return router
}
