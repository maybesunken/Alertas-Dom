# Backend Go - DOM Alerts API

## 📁 Estrutura Simplificada

```
cmd/api/main.go              # Ponto de entrada, configuração de rotas
internal/
  ├── handlers/
  │   └── auth_handler.go    # Handler de login (simplificado)
  ├── middleware/
  │   ├── jwt.go             # Middleware JWT (não usado atualmente)
  │   └── logging.go         # Logging de requisições
  └── types/
      └── auth.go            # Tipos de dados
```

## 🚀 Como Funciona

### Fluxo de Login

1. **Frontend** envia para `/api/v1/auth/login`:
```json
{
  "login": "usuario@email.com",
  "pass": "senha123",
  "token_recaptcha": "03AGdBq26..."
}
```

2. **Backend Go** valida os campos e repassa para **DOM API**

3. **DOM API** (`https://dev.api.grupookta.com.br/platform/login`):
   - Valida o reCAPTCHA com Google
   - Valida usuário e senha
   - Retorna JWT se sucesso

4. **Backend Go** retorna ao frontend:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "usuario@email.com",
    "name": "usuario@email.com"
  }
}
```

## ⚙️ Variáveis de Ambiente (.env)

```env
# Porta do servidor
PORT=8080

# URL da API DOM
DOM_API_BASE_URL=https://dev.api.grupookta.com.br
DOM_API_LOGIN_PATH=/platform/login

# CORS
FRONTEND_ORIGIN=http://localhost:3000

# Ambiente (development/production)
ENV=development
```

## 🔌 Endpoints

### POST /api/v1/auth/login
Autentica usuário via DOM API.

**Request:**
```json
{
  "login": "email@domain.com",
  "pass": "password",
  "token_recaptcha": "recaptcha_token_here"
}
```

**Response 200:**
```json
{
  "token": "jwt_token",
  "user": {
    "email": "email@domain.com",
    "name": "email@domain.com"
  }
}
```

**Response 400:**
```json
{
  "error": "recaptcha token required"
}
```

**Response 401:**
```json
{
  "error": "authentication failed"
}
```

### GET /health
Health check do servidor.

**Response 200:**
```json
{
  "status": "ok"
}
```

## 🔧 Como Rodar

```bash
# 1. Instalar dependências
go mod download

# 2. Configurar .env
cp .env.example .env

# 3. Rodar servidor
go run cmd/api/main.go

# Ou compilar e rodar
go build -o server cmd/api/main.go
./server
```

## 🐛 Logs

O servidor loga todas as requisições automaticamente via middleware:

```
2026/01/05 10:30:15 ✓ Servidor iniciando...
2026/01/05 10:30:15   DOM API URL: https://dev.api.grupookta.com.br
2026/01/05 10:30:15   Frontend Origin: http://localhost:3000
2026/01/05 10:30:15 🚀 API rodando em http://localhost:8080

2026/01/05 10:30:20 [login] attempting login for user=teste@email.com, recaptcha token length=1678
2026/01/05 10:30:20 [login] calling DOM API at https://dev.api.grupookta.com.br/platform/login
2026/01/05 10:30:21 [login] DOM API returned status=200, body={"status":"OK","token":"eyJhbG..."}
2026/01/05 10:30:21 [login] success for user=teste@email.com
```

## ❌ Problemas Comuns

### 1. Erro: "authentication failed"
**Causas possíveis:**
- ❌ Credenciais inválidas (usuário/senha incorretos)
- ❌ Site key do reCAPTCHA diferente da configurada na DOM
- ❌ Token reCAPTCHA expirado (válido por 2 minutos)
- ❌ API DOM indisponível

**Solução:**
1. Verificar credenciais corretas com time DOM
2. Confirmar site key do reCAPTCHA com time DOM
3. Verificar logs do servidor para detalhes

### 2. Erro: "recaptcha token required"
**Causa:** Frontend não está enviando o token do reCAPTCHA

**Solução:** Verificar integração do reCAPTCHA no frontend

### 3. Erro CORS
**Causa:** Frontend rodando em origem diferente da configurada

**Solução:** Atualizar `FRONTEND_ORIGIN` no `.env`

## 📝 Notas Importantes

### ⚠️ Site Key do reCAPTCHA
**CRÍTICO:** O site key do reCAPTCHA no frontend **DEVE** ser o mesmo configurado pela DOM Pagamentos no Google reCAPTCHA. Caso contrário, a validação falhará.

- Site key atual: `6LclSj4sAAAAAAXXVjovZVK49L60AApsI5O3Dawj`
- ⚠️ **VERIFICAR COM TIME DOM** se este é o site key correto

### 🔐 Segurança
- Backend **NÃO valida** o reCAPTCHA (deixa DOM API fazer)
- Backend **NÃO armazena** tokens ou sessões
- Backend atua apenas como **proxy** para DOM API

### 🚫 Removido da Estrutura
- ❌ Lógica de refresh token (não será usada)
- ❌ Handlers `/me`, `/logout`, `/refresh`
- ❌ Sessões in-memory
- ❌ Integração com Supabase
- ❌ Cookie storage

## 📚 Referências

- [Documentação DOM API](docs/BACKEND_AUTH.md)
- [Status de Integração](INTEGRATION_STATUS.md)
- [Segurança JWT](docs/SECURITY_JWT.md)
