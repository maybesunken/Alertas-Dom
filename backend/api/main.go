package main

import (
	"log"
	"net/http"
	"os"

	"dom-alerts/backend/internal/handlers"
	"dom-alerts/backend/internal/middleware"

	"github.com/joho/godotenv"
)

func main() {
	// Carregar variáveis de ambiente
	godotenv.Load()

	port := getEnv("PORT", "8080")

	log.Println("🚀 DOM Alerts API")
	log.Printf("   Porta: %s", port)
	log.Printf("   DOM API: %s", getEnv("DOM_API_BASE_URL", "https://dev.api.grupookta.com.br"))

	// Configurar rotas
	mux := http.NewServeMux()
	mux.HandleFunc("/api/v1/auth/login", corsHandler(handlers.LoginHandler))
	mux.HandleFunc("/health", corsHandler(healthHandler))

	// Aplicar middleware de logging
	handler := middleware.LoggingMiddleware(mux)

	log.Printf("✓ Servidor rodando em http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status":"ok"}`))
}

// corsHandler adiciona headers CORS para desenvolvimento e produção
func corsHandler(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")

		// Lista de origens permitidas
		allowedOrigins := map[string]bool{
			"http://localhost:3000":            true,
			"http://localhost:3001":            true,
			"http://localhost:3002":            true,
			"http://localhost:5173":            true,
			"https://alertas-dom.vercel.app":   true,
			"https://dev.api.grupookta.com.br": true,
		}

		// Verificar se a origem está permitida
		if allowedOrigins[origin] {
			w.Header().Set("Access-Control-Allow-Origin", origin)
		} else if origin == "" {
			// Se não há origem, permitir (para ferramentas como Postman)
			w.Header().Set("Access-Control-Allow-Origin", "*")
		}

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next(w, r)
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
