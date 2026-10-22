# Stage 1: Build binary Go
FROM golang:1.27-alpine AS builder

WORKDIR /app

# Cache dependency Go
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Compile binary statis (CGO_ENABLED=0 agar standalone & sangat ringan)
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server ./cmd/api/main.go

# Stage 2: Minimal Production Image
FROM alpine:3.20

WORKDIR /app

# Salin SSL root certificates dari builder image (tanpa perlu koneksi ke apk mirror)
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

# Copy binary dari builder
COPY --from=builder /app/server /app/server

ENV TZ=Asia/Jakarta

# Expose port 8080
EXPOSE 8080

# Run server
CMD ["/app/server"]
