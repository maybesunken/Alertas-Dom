package handlers

import (
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"strings"
	"time"
)

// LoginRequest - O que chega do Frontend
type LoginRequest struct {
	Login          string `json:"login"`
	Pass           string `json:"pass"`
	RecaptchaToken string `json:"token_recaptcha"`
}

// DOMLoginResponse - O que a API DOM retorna
type DOMLoginResponse struct {
	Status string `json:"status"`
	Token  string `json:"token,omitempty"`
	Msg    string `json:"msg,omitempty"`
}

// LoginResponse - O que retornamos ao Frontend
type LoginResponse struct {
	Token string                 `json:"token"`
	User  map[string]interface{} `json:"user"`
}

// ErrorResponse - Resposta de erro padronizada
type ErrorResponse struct {
	Error string `json:"error"`
}

// LoginHandler - Autentica usuário via DOM API e retorna JWT
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	// 1. Parse request body
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("[login] invalid json: %v", err)
		respondError(w, http.StatusBadRequest, "invalid request body")
		return
	}

	// 2. Validar campos obrigatórios
	if req.Login == "" || req.Pass == "" {
		log.Printf("[login] missing credentials")
		respondError(w, http.StatusBadRequest, "login and password required")
		return
	}

	if req.RecaptchaToken == "" {
		log.Printf("[login] recaptcha token missing for user=%s", req.Login)
		respondError(w, http.StatusBadRequest, "recaptcha token required")
		return
	}

	// Extrair IP real do cliente
	remoteIP := getClientIP(r)
	log.Printf("[login] 👤 Client IP: %s, User: %s", remoteIP, req.Login)

	// DOM API vai validar o reCAPTCHA - nós apenas repassamos o token
	// 3. Chamar API DOM (ela valida reCAPTCHA + credenciais)
	domToken, err := callDOMLoginAPI(req, remoteIP)
	if err != nil {
		log.Printf("[login] DOM API error: %v", err)
		respondError(w, http.StatusUnauthorized, "authentication failed")
		return
	}

	// 4. Retornar sucesso com token
	log.Printf("[login] success for user=%s", req.Login)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(LoginResponse{
		Token: domToken,
		User: map[string]interface{}{
			"email": req.Login,
			"name":  req.Login,
		},
	})
}

// GetMD5Hash - Converte texto para MD5 hash
func GetMD5Hash(text string) string {
	hash := md5.Sum([]byte(text))
	return hex.EncodeToString(hash[:])
}

// getClientIP - Extrai o IP real do cliente considerando proxies/Cloudflare
func getClientIP(r *http.Request) string {
	// Cloudflare
	if ip := r.Header.Get("CF-Connecting-IP"); ip != "" {
		log.Printf("[getClientIP] Using CF-Connecting-IP: %s", ip)
		return ip
	}

	// Proxies / Load balancers
	if ip := r.Header.Get("X-Forwarded-For"); ip != "" {
		realIP := strings.Split(ip, ",")[0]
		log.Printf("[getClientIP] Using X-Forwarded-For: %s", realIP)
		return strings.TrimSpace(realIP)
	}

	// Fallback: r.RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		log.Printf("[getClientIP] Using RemoteAddr (no port): %s", r.RemoteAddr)
		return r.RemoteAddr
	}
	log.Printf("[getClientIP] Using RemoteAddr: %s", ip)
	return ip
}

// callDOMLoginAPI - Chama a API DOM para autenticação
func callDOMLoginAPI(req LoginRequest, remoteIP string) (string, error) {
	// Configurar URL da API DOM
	domURL := os.Getenv("DOM_API_BASE_URL")
	if domURL == "" {
		domURL = "https://dev.api.grupookta.com.br"
	}

	loginPath := os.Getenv("DOM_API_LOGIN_PATH")
	if loginPath == "" {
		loginPath = "/platform/login"
	}

	url := strings.TrimRight(domURL, "/") + loginPath

	// Converter senha para MD5 (requerido pela API DOM)
	passwordMD5 := GetMD5Hash(req.Pass)
	log.Printf("[login] 🔐 Original password length: %d chars", len(req.Pass))
	log.Printf("[login] 🔐 MD5 hash: %s", passwordMD5)

	// Preparar payload para DOM API
	// DOM API espera o token do Google reCAPTCHA v3 e o IP do cliente
	payload := map[string]string{
		"login":           req.Login,
		"pass":            passwordMD5,
		"token_recaptcha": req.RecaptchaToken,
		"ip":              remoteIP,
	}

	payloadBytes, _ := json.Marshal(payload)
	log.Printf("[login] 🌐 Calling DOM API: %s", url)
	log.Printf("[login] 📦 Payload fields:")
	log.Printf("   - login: %s", req.Login)
	log.Printf("   - pass (MD5): %s", passwordMD5)
	log.Printf("   - token_recaptcha: %d chars", len(req.RecaptchaToken))
	log.Printf("   - ip: %s", remoteIP)

	// Criar request
	httpReq, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadBytes))
	if err != nil {
		return "", err
	}

	// Headers conforme documentação
	httpReq.Header.Set("Content-Type", "application/json; charset=utf-8")
	httpReq.Header.Set("Accept", "application/json")
	httpReq.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")

	log.Printf("[login] 📤 Request Headers: %+v", httpReq.Header)

	// Executar request
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(httpReq)
	if err != nil {
		log.Printf("[login] ❌ Request failed: %v", err)
		return "", err
	}
	defer resp.Body.Close()

	log.Printf("[login] 📥 Response Headers: %+v", resp.Header)

	// Ler resposta
	body, _ := io.ReadAll(resp.Body)
	log.Printf("[login] 📊 DOM API returned status=%d", resp.StatusCode)
	log.Printf("[login] 📄 Response body: %s", string(body))

	// Parse resposta
	var domResp DOMLoginResponse
	if err := json.Unmarshal(body, &domResp); err != nil {
		log.Printf("[login] failed to parse DOM API response: %v", err)
		return "", err
	}

	// Verificar sucesso
	if resp.StatusCode != 200 || domResp.Status != "OK" {
		log.Printf("[login] DOM API authentication failed: status=%s, msg=%s", domResp.Status, domResp.Msg)
		return "", http.ErrAbortHandler
	}

	if domResp.Token == "" {
		log.Printf("[login] DOM API returned empty token")
		return "", http.ErrAbortHandler
	}

	return domResp.Token, nil
}

// respondError - Helper para enviar resposta de erro padronizada
func respondError(w http.ResponseWriter, status int, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(ErrorResponse{Error: message})
}
