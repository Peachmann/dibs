package server

import (
	"context"
	"dibs/internal/database"
	"log"
	"net"
	"os"

	"golang.ngrok.com/ngrok"
	"golang.ngrok.com/ngrok/config"
)

func ngrokListener(ctx context.Context) (net.Listener, error) {
	return ngrok.Listen(ctx,
		config.HTTPEndpoint(
			config.WithDomain(os.Getenv("NGROK_DOMAIN")),
		),
		ngrok.WithAuthtokenFromEnv(),
	)
}

func Start() {
	router := SetRouter()

	database.InitDB()

	if os.Getenv("ENV") == "PROD" {
		router.Run()
	} else {
		listener, err := ngrokListener(context.Background())
		if err != nil {
			log.Fatal(err)
		}
		router.RunListener(listener)
	}
}
