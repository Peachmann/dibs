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

	// Start listening and serving requests - dev only
	listener, err := ngrokListener(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	router.RunListener(listener)
}
