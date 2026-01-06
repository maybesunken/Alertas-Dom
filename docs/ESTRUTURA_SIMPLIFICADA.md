# ✅ Estrutura Simplificada - DOM Alerts

## 📁 Arquivos Principais

### Backend (Go)
```
cmd/api/main.go                    # ✅ Simplificado - apenas login + health
internal/
  ├── handlers/
  │   └── auth_handler.go          # ✅ Simplificado - apenas LoginHandler
  ├── middleware/
  │   └── logging.go               # ✅ Logging de requisições
  └── types/
      └── auth.go                  # ✅ Tipos básicos
go.mod                             # ✅ Apenas godotenv
```

### Frontend (React)
```
src/
  ├── components/Login.tsx         # ✅ Simplificado
  ├── context/AuthContext.tsx      # ✅ Simplificado - sem refresh
  └── services/api.ts              # ✅ Simplificado - sem interceptors complexos
```

## ❌ Removido

### Código Desnecessário
- ❌ Lógica de refresh token (frontend e backend)
- ❌ Endpoints `/me`, `/logout`, `/refresh`
- ❌ Sessões in-memory no backend
- ❌ Cookies httpOnly
- ❌ Integração com Supabase
- ❌ Dependência `rs/cors` (CORS nativo agora)
- ❌ Interceptors complexos de axios
- ❌ Chamadas a `/auth/me` no carregamento
- ❌ Cache complexo (simpleQueryClient)

### Simplificações
- ✅ **Frontend**: Apenas login + localStorage
- ✅ **Backend**: Apenas proxy para DOM API
- ✅ **API**: Token vem direto da DOM API
- ✅ **CORS**: Headers nativos do Go (sem lib externa)

## 🔄 Fluxo Atual (Simplificado)

```
1. User preenche formulário
   ↓
2. Frontend valida reCAPTCHA
   ↓
3. POST /api/v1/auth/login
   Body: { login, pass, token_recaptcha }
   ↓
4. Backend → DOM API
   ↓
5. DOM API valida e retorna JWT
   ↓
6. Backend → Frontend
   Response: { token, user }
   ↓
7. Frontend salva token no localStorage
   ↓
8. User autenticado
```

## 🚀 Como Rodar

### 1. Backend (Porta 8080)
```bash
cd c:\Users\maybe\dom-alerts
go run cmd/api/main.go

# Ou compilar
go build -o server.exe cmd/api/main.go
.\server.exe
```

**Logs esperados:**
```
🚀 DOM Alerts API
   Porta: 8080
   DOM API: https://api.grupookta.com.br
✓ Servidor rodando em http://localhost:8080
```

### 2. Frontend (Porta 3000)
```bash
cd "c:\Users\maybe\dom-alerts\Credit Card Fraud Dashboard (2)"
npm run dev
```

## 🧪 Testar Login

### 1. Abrir Browser
- URL: http://localhost:3000
- Abrir DevTools (F12)
- Aba Network

### 2. Preencher Formulário
- Email: `pedro.sansone@dompagamentos.cpm` (verificar com time DOM)
- Senha: `SENHA_CORRETA` (solicitar ao time DOM)
- Marcar reCAPTCHA

### 3. Clicar "Entrar"

### 4. Verificar Network
Deve aparecer:
```
POST /api/v1/auth/login
Request:
{
  "login": "pedro.sansone@dompagamentos.cpm",
  "pass": "...",
  "token_recaptcha": "03AGdBq26..." (1600+ caracteres)
}

Response 200:
{
  "token": "eyJhbGci...",
  "user": {
    "email": "pedro.sansone@dompagamentos.cpm",
    "name": "pedro.sansone@dompagamentos.cpm"
  }
}
```

### 5. Verificar Backend Logs
```
[2026-01-05T13:35:40Z] REQUEST POST /api/v1/auth/login headers=... body=...
[login] attempting login for user=pedro.sansone@dompagamentos.cpm, recaptcha token length=1678
[login] calling DOM API at https://api.grupookta.com.br/platform/login
[login] DOM API returned status=200, body={"status":"OK","token":"eyJ..."}
[login] success for user=pedro.sansone@dompagamentos.cpm
[2026-01-05T13:35:41Z] COMPLETED POST /api/v1/auth/login in=800ms
```

## 🐛 Problemas Comuns

### Network vazio (não aparece requisição)

**Possíveis causas:**
1. ❌ Frontend não está rodando (`npm run dev`)
2. ❌ Backend não está rodando
3. ❌ URL errada no `.env` frontend
4. ❌ Erro JavaScript no console

**Solução:**
- Verificar console do browser (F12 → Console)
- Verificar terminal do frontend
- Verificar `.env`:
  ```env
  VITE_API_BASE_URL=http://localhost:8080/api/v1
  VITE_RECAPTCHA_SITE_KEY=6LclSj4sAAAAAAXXVjovZVK49L60AApsI5O3Dawj
  ```

### Error 401 "authentication failed"

**Possíveis causas:**
1. ❌ Credenciais inválidas
2. ❌ Site key reCAPTCHA errada
3. ❌ Token reCAPTCHA expirado

**Solução:**
- Verificar credenciais com time DOM
- Verificar site key com time DOM
- Gerar novo token (desmarcar e marcar reCAPTCHA)

### Error 400 "recaptcha token required"

**Causa:** reCAPTCHA não foi marcado

**Solução:** Marcar o checkbox do reCAPTCHA

### CORS Error

**Causa:** Headers CORS não configurados

**Solução:** Backend já tem CORS configurado nativamente, reiniciar servidor

## 📝 Variáveis de Ambiente

### Backend (.env na raiz)
```env
PORT=8080
DOM_API_BASE_URL=https://api.grupookta.com.br
DOM_API_LOGIN_PATH=/platform/login
```

### Frontend (.env em Credit Card Fraud Dashboard (2)/)
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_RECAPTCHA_SITE_KEY=CHAVE_CORRETA_AQUI
```

## 🎯 Próximos Passos

1. ✅ Estrutura simplificada
2. ✅ Backend limpo
3. ✅ Frontend limpo
4. ⏳ **Obter do time DOM:**
   - Site key reCAPTCHA correto
   - Credenciais de teste válidas
5. ⏳ Testar login end-to-end
6. ⏳ Resolver problemas de autenticação

## 📚 Arquivos de Referência

- [README_BACKEND.md](README_BACKEND.md) - Documentação técnica
- [CHECKLIST_LOGIN.md](CHECKLIST_LOGIN.md) - Checklist de verificação
- [INTEGRATION_STATUS.md](INTEGRATION_STATUS.md) - Status da integração
