package middleware

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"
)

// maskSensitiveJSON replaces the value of sensitive keys (pass, password) with **** for logging
func maskSensitiveJSON(b []byte) string {
	var m map[string]interface{}
	if err := json.Unmarshal(b, &m); err != nil {
		// not JSON - return truncated
		s := string(b)
		if len(s) > 200 {
			return s[:200]
		}
		return s
	}
	sensitive := []string{"pass", "password"}
	for _, k := range sensitive {
		if _, ok := m[k]; ok {
			m[k] = "****"
		}
	}
	out, _ := json.Marshal(m)
	s := string(out)
	if len(s) > 1000 {
		return s[:1000]
	}
	return s
}

// LoggingMiddleware logs request timestamp, path, headers (Content-Type, Authorization, Cookie) and masked body
func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()

		// Read body
		var bodyBytes []byte
		if r.Body != nil {
			bodyBytes, _ = io.ReadAll(r.Body)
		}
		// Restore body for the next handler
		r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

		// Only log relevant headers
		headers := map[string]string{
			"Content-Type":  r.Header.Get("Content-Type"),
			"Authorization": r.Header.Get("Authorization"),
			"Cookie":        r.Header.Get("Cookie"),
		}

		// Mask body
		masked := maskSensitiveJSON(bodyBytes)

		log.Printf("[%s] REQUEST %s %s headers=%v body=%s", start.Format(time.RFC3339), r.Method, r.URL.Path, headers, masked)

		next.ServeHTTP(w, r)

		log.Printf("[%s] COMPLETED %s %s in=%s", time.Now().Format(time.RFC3339), r.Method, r.URL.Path, time.Since(start))
	})
}
