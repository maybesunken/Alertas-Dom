package middleware

import "net/http"

// JWTMiddleware é um placeholder mínimo para evitar erros de compilação.
// Em ambientes reais, implemente verificação de token, roles, etc.
func JWTMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// apenas encaminha para o próximo handler por enquanto
		next.ServeHTTP(w, r)
	})
}
