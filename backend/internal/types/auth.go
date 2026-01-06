package types

type LoginRequest struct {
	Login          string `json:"login"`
	Pass           string `json:"pass"`
	RecaptchaToken string `json:"token_recaptcha"`
}

type LoginResponse struct {
	Token string `json:"token"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}
