# DOM Alerts - Sistema de Detecção de Fraudes

Sistema completo de autenticação e alertas para detecção de fraudes em cartões de crédito.

## 🏗️ Estrutura do Projeto

```
dom-alerts/
├── backend/           # API Go com autenticação
│   ├── cmd/          # Entry points da aplicação
│   ├── internal/     # Código interno (handlers, services, middleware)
│   ├── go.mod        # Dependências Go
│   └── go.sum
├── frontend/         # Dashboard React + TypeScript
│   ├── src/         # Código fonte React
│   ├── public/      # Arquivos estáticos
│   └── package.json # Dependências Node
└── docs/            # Documentação do projeto

```

## 🚀 Deploy

- **Frontend**: https://alertas-dom.vercel.app (Vercel)
- **Backend**: https://dom-alerts-backend-production.up.railway.app (Railway)

## 🔐 Tecnologias

### Backend
- Go 1.22
- Cloudflare Turnstile (proteção anti-bot)
- MD5 hash para senhas
- CORS configurado
- API DOM Pagamentos

### Frontend
- React 18 + TypeScript
- Vite
- React Query
- Tailwind CSS
- shadcn/ui components
- Cloudflare Turnstile widget

## 📦 Desenvolvimento

### Backend
```bash
cd backend
go mod download
go run cmd/api/main.go
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Variáveis de Ambiente

### Backend
```env
PORT=8080
DOM_API_BASE_URL=https://dev.api.grupookta.com.br
DOM_API_LOGIN_PATH=/platform/login
TURNSTILE_SECRET_KEY=0x4AAAAAACKrljrhM-S8rmvCpLtURLc2jtc
FRONTEND_ORIGIN=https://alertas-dom.vercel.app
```

### Frontend
```env
VITE_API_BASE_URL=https://dom-alerts-backend-production.up.railway.app/api/v1
VITE_TURNSTILE_SITE_KEY=0x4AAAAAACKrlvequKKX4SUX
```

## 📚 Documentação

Documentação detalhada disponível em [`docs/`](./docs/):
- [Instruções de Deploy](./docs/DEPLOY_INSTRUCTIONS.md)
- [Setup Turnstile](./docs/TURNSTILE_SETUP.md)
- [Autenticação Backend](./docs/BACKEND_AUTH.md)
- [Status de Integração](./docs/INTEGRATION_STATUS.md)

## 👥 Credenciais de Teste

- **Email**: pedro.sansone@dompagamentos.com
- **Senha**: pedro.sansone@dompagamentos.com

---

Desenvolvido para DOM Pagamentos

## 🔐 Variáveis de Ambiente

### Backend (.env na raiz)
```env
PORT=8080
DOM_API_BASE_URL=https://api.grupookta.com.br
TURNSTILE_SECRET_KEY=sua_secret_key_aqui
```

### Frontend (Credit Card Fraud Dashboard (2)/.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_TURNSTILE_SITE_KEY=sua_site_key_aqui
```

## ⚙️ Fluxo de Autenticação

1. **Frontend** → Usuário preenche email/senha + valida Turnstile
2. **Backend** → Valida token Turnstile com Cloudflare
3. **Backend** → Envia credenciais + token para DOM API
4. **DOM API** → Valida e retorna JWT
5. **Backend** → Retorna JWT ao frontend
6. **Frontend** → Armazena JWT e redireciona

## 🛠️ Stack

- **Backend:** Go 1.22
- **Frontend:** React + TypeScript + Vite
- **Segurança:** Cloudflare Turnstile
- **API Externa:** DOM Pagamentos

## 📝 Endpoints

### POST /api/v1/auth/login
Autentica usuário via DOM API.

**Request:**
```json
{
  "login": "email@example.com",
  "pass": "senha",
  "token_recaptcha": "turnstile_token_here"
}
```

**Response 200:**
```json
{
  "token": "jwt_token_from_dom_api",
  "user": {
    "email": "email@example.com",
    "name": "email@example.com"
  }
}
```

### GET /health
Health check do servidor.

**Response 200:**
```json
{"status":"ok"}
```
