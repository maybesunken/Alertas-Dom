
  # Credit Card Fraud Dashboard ✅

Este repositório contém um front-end em **React + Vite + TypeScript** para um dashboard de detecção de fraudes em cartões de crédito. O design original está no Figma: https://www.figma.com/design/Okq1KYoOMiIcbC3M23DRnp/Credit-Card-Fraud-Dashboard.

---

## 🚀 Visão geral

- **Stack:** Vite, React, TypeScript, Tailwind CSS, shadcn/ui, framer-motion, axios
- **Objetivo:** UI para visualizar transações, alertas de fraude, relatórios e opções de configuração; integrar com um backend em Go (API REST)

---

## 📁 Estrutura principal do projeto

- `index.html` — entry HTML
- `src/main.tsx` — boot do app; agora envolve a aplicação com `AuthProvider`
- `src/App.tsx` — roteamento básico de páginas (Dashboard, Transactions, Alerts, Reports, Settings)
- `src/components/` — componentes de UI principais
  - `Login.tsx` — tela de login (atualizada para usar `AuthContext`)
  - `Dashboard.tsx` — visão geral, atualmente consome dados via API (ou mocks se backend indisponível)
  - `Transactions.tsx`, `Alerts.tsx`, `Reports.tsx`, `Settings.tsx` — telas principais (algumas usam mocks atualmente)
  - `ui/` — componentes utilitários e primitives (shadcn)
- `src/context/AuthContext.tsx` — provider de autenticação (login/logout, estado do usuário, `isAuthenticated`, `loading`)
- `src/services/api.ts` — cliente HTTP (axios) configurado com `baseURL` vindo de `VITE_API_BASE_URL` e `withCredentials` (cookies suportados)
- `src/types/` — tipos TypeScript para respostas API (ex.: `User`, `AuthMeResponse`)

---

## 🔧 O que foi implementado (funções-chave)

- **AuthContext** (`src/context/AuthContext.tsx`) ✅
  - `login(email, password)` → POST `/auth/login` e GET `/auth/me` para popular o usuário
  - `logout()` → POST `/auth/logout`
  - `isAuthenticated`, `loading`, `setLocalUser` (para fallback local)
- **Cliente HTTP** (`src/services/api.ts`) ✅
  - Instância axios com `baseURL` = `import.meta.env.VITE_API_BASE_URL` (default: `http://localhost:8080/api/v1`) e `withCredentials: true`
  - Interceptor básico para erros (401)
- **Login** (`src/components/Login.tsx`) ✅
  - Usa `useAuth().login(...)` para autenticar
  - Se o backend estiver inacessível ou invalidar credenciais, faz fallback para um usuário local (token `mock-token`) para permitir navegação local
- **Configuração de ambiente** ✅
  - `.env.example` com `VITE_API_BASE_URL`

---

## 🔌 Contrato de API esperado (exemplos)

Estes são os endpoints que o frontend tenta consumir. Adapte o backend Go conforme necessário.

- POST /api/v1/auth/login
  - Request: `{ "email": "a@b.com", "password": "senha", "recaptcha": "<recaptcha-token>" }` (frontend envia `recaptcha` quando `VITE_RECAPTCHA_SITE_KEY` estiver configurado)
  - Response (200): `{ "ok": true, "token": "<jwt-if-used>" }` (ou cookies HttpOnly conforme implementação)
- GET /api/v1/auth/me
  - Response (200): `{ "user": { "id": "...", "name": "...", "email": "..." } }`
- POST /api/v1/auth/logout
  - Response (200): `{ "ok": true }`
- GET  /api/v1/transactions?search=&status=&page=&limit=
  - Response: `{ "data": [Transaction], "total": number, "page": number }`
- GET  /api/v1/dashboard/stats
  - Response: `{ "transactionsToday": number, "fraudCount": number, ... }`
- GET  /api/v1/alerts?limit=&severity=
  - Response: `{ "data": [Alert] }`
- POST /api/v1/alerts/:id/resolve
  - Response: `{ "ok": true }`

> Observação: o cliente axios está configurado com `withCredentials: true`. Se você optar por usar JWT em Authorization header, ajuste o backend e o cliente conforme apropriado.

---

## 🧭 Como rodar localmente

1. Instalar dependências:

```bash
npm install
```

2. Copiar variáveis de ambiente:

```bash
cp .env.example .env.local
# ou crie .env.local manualmente com:
# VITE_API_BASE_URL=http://localhost:8080/api/v1
```

3. Rodar o front:

```bash
npm run dev
```

4. Acessar: http://localhost:5173 (porta padrão do Vite)

5. Testar login: insira qualquer e-mail/senha. O front tentará autenticar com o backend; se o backend estiver parado, um **usuário mock** será criado localmente para permitir navegação.

---

## ⚠️ Notas sobre o backend Go

- Habilite **CORS** para a origem do front (por exemplo `http://localhost:5173`). Se usar cookies para autenticação, configure `Access-Control-Allow-Credentials: true` e permita a origem específica (não `*`).
- Rota de login deve setar cookie HttpOnly (ou retornar token) conforme o fluxo escolhido.
- Recomenda-se usar HTTPS em produção e aplicar rate-limiting / proteção CSRF quando usar cookies.

---

## ✅ Próximos passos recomendados

- Implementar chamadas reais nas telas (Transactions, Dashboard, Alerts) substituindo mocks.
- Adicionar caching e gerenciamento de fetch com **React Query** (`@tanstack/react-query`).
- Implementar refresh token e logout forçado (expiração de sessão).
- Adicionar testes E2E (Playwright) para fluxo de login e páginas principais.

---

## 🧾 Exemplo rápido de cURL para testes

Login:

```bash
curl -X POST $VITE_API_BASE_URL/auth/login -H "Content-Type: application/json" -d '{"email":"a@b.com","password":"senha"}' -c cookiejar.txt
```

Me:

```bash
curl -X GET $VITE_API_BASE_URL/auth/me -b cookiejar.txt
```

---

## ✍️ Contato / Contribuição

Se quiser que eu gere um PR com:
- substituição de mocks por chamadas reais em `Transactions` e `Dashboard`,
- integração com `react-query` e tipagem mais completa,
- collection Postman/Insomnia com os endpoints,

diga qual opção prefere e eu implemento. ✨

---

© 2026 Dom Pagamentos
