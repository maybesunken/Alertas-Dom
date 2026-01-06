package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// TurnstileRequest - Payload para validação Cloudflare Turnstile
type TurnstileRequest struct {
	Secret   string `json:"secret"`
	Response string `json:"response"`
	RemoteIP string `json:"remoteip,omitempty"`
}

// TurnstileResponse - Resposta da API Cloudflare Turnstile
type TurnstileResponse struct {
	Success     bool     `json:"success"`
	ChallengeTS string   `json:"challenge_ts,omitempty"`
	Hostname    string   `json:"hostname,omitempty"`
	ErrorCodes  []string `json:"error-codes,omitempty"`
	Action      string   `json:"action,omitempty"`
	CData       string   `json:"cdata,omitempty"`
}

// VerifyTurnstile valida o token Turnstile com a API do Cloudflare
func VerifyTurnstile(token, remoteIP string) (bool, error) {
	secret := os.Getenv("TURNSTILE_SECRET_KEY")
	if secret == "" {
		return false, fmt.Errorf("TURNSTILE_SECRET_KEY not configured")
	}

	// Preparar payload
	payload := TurnstileRequest{
		Secret:   secret,
		Response: token,
		RemoteIP: remoteIP,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return false, fmt.Errorf("failed to marshal payload: %w", err)
	}

	// Chamar API Cloudflare
	req, err := http.NewRequest(
		"POST",
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		bytes.NewBuffer(payloadBytes),
	)
	if err != nil {
		return false, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return false, fmt.Errorf("turnstile API request failed: %w", err)
	}
	defer resp.Body.Close()

	// Ler resposta
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return false, fmt.Errorf("failed to read response: %w", err)
	}

	var result TurnstileResponse
	if err := json.Unmarshal(body, &result); err != nil {
		return false, fmt.Errorf("failed to parse response: %w", err)
	}

	// Log para debug
	if !result.Success {
		return false, fmt.Errorf("turnstile validation failed: %v", result.ErrorCodes)
	}

	return result.Success, nil
}
