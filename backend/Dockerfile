# Stage 1: Build binary Go
FROM golang:1.27-alpine AS builder

WORKDIR /app

# Install git and ca-certificates if needed
RUN apk add --no-cache git ca-certificates tzdata

# Cache dependency Go
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Compile binary statis (CGO_ENABLED=0 agar standalone & sangat ringan)
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server ./cmd/api/main.go

# Stage 2: Minimal Production Image (Ukuran hanya ~20MB)
FROM alpine:3.20

WORKDIR /app

# Install timezone dan certificates untuk koneksi HTTPS aman
RUN apk add --no-cache ca-certificates tzdata
ENV TZ=Asia/Jakarta

# Copy binary dari builder
COPY --from=builder /app/server /app/server

# Expose port 8080
EXPOSE 8080

# Run server
CMD ["/app/server"]
