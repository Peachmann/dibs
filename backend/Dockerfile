FROM golang:1.21.2

# Set destination for COPY
WORKDIR /app

RUN go install github.com/cosmtrek/air@latest

# Download Go modules
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the app which will pull in the dependencies
# RUN CGO_ENABLED=0 GOOS=linux go build -o /backend ./cmd/app

# EXPOSE 8080

# Run app
# CMD ["/backend"]
CMD ["air", "-c", "./configs/.air.toml"]