# 🛡️ Cloudflare Turnstile - Guia de Configuração

## ✅ O Que Foi Implementado

Substituímos o **Google reCAPTCHA** pelo **Cloudflare Turnstile** - uma alternativa mais moderna, rápida e amigável.

### Mudanças Realizadas:

#### Backend (Go)
- ✅ Novo serviço: `internal/services/turnstile.go`
- ✅ Validação do token com API Cloudflare
- ✅ Extração do IP do cliente (`r.RemoteAddr`)
- ✅ Logs detalhados de validação

#### Frontend (React)
- ✅ Substituído `react-google-recaptcha` por `@marsidev/react-turnstile`
- ✅ Atualizado componente `Login.tsx`
- ✅ Novo visual do Turnstile (mais discreto)

## 🔧 Como Configurar

### 1. Obter Chaves do Cloudflare Turnstile

1. Acesse: https://dash.cloudflare.com/?to=/:account/turnstile
2. Clique em **"Add Site"**
3. Configure:
   - **Site Name:** DOM Alerts - Dev
   - **Domains:** `localhost`, `127.0.0.1`, `seu-dominio.com`
   - **Widget Mode:** Managed (recomendado)
   - **Pre-clearance:** **❌ NÃO** (deixe desmarcado)
     
     > ⚠️ **Importante:** Pre-clearance emite um cookie de clearance do Cloudflare WAF, mas nossa autenticação é baseada em JWT da DOM API. Os dois sistemas são independentes e não há benefício em usar pre-clearance neste caso.

4. Clique em **"Create"**
5. Copie as chaves:
   - **Site Key** (pública)
   - **Secret Key** (privada)

### 2. Configurar Backend (.env na raiz do projeto)

```env
# Cloudflare Turnstile - Secret Key (PRIVADA - NÃO COMMITAR!)
TURNSTILE_SECRET_KEY=0x4AAA...sua_secret_key_aqui
```

### 3. Configurar Frontend (Credit Card Fraud Dashboard (2)/.env)

```env
# Cloudflare Turnstile - Site Key (PÚBLICA)
VITE_TURNSTILE_SITE_KEY=0x4AAA...sua_site_key_aqui
```

### 4. Reiniciar Servidores

#### Backend:
```powershell
cd "c:\Users\maybe\dom-alerts"
.\server.exe
```

#### Frontend:
```powershell
cd "c:\Users\maybe\dom-alerts\Credit Card Fraud Dashboard (2)"
# Parar o servidor atual (Ctrl+C no terminal)
node node_modules/vite/bin/vite.js
```

Ou simplesmente **recarregar a página** do navegador.

## 🧪 Como Testar

1. Abrir http://localhost:3000
2. Preencher email e senha
3. **Widget Turnstile aparece automaticamente** (não precisa clicar)
4. Clicar em "Entrar"
5. Verificar logs:

### Backend (esperado):
```
[login] validating turnstile token for user=usuario@email.com from IP=127.0.0.1
[login] turnstile validation successful for user=usuario@email.com
[login] calling DOM API at https://api.grupookta.com.br/platform/login
```

### Frontend Console (esperado):
```
🤖 Turnstile Token: 0.abcdef123456...
📤 [Login] Calling login function...
✅ Turnstile validado com sucesso
```

## 📊 Vantagens do Turnstile vs reCAPTCHA

| Recurso | Turnstile | reCAPTCHA v2 |
|---------|-----------|--------------|
| **Performance** | ⚡ Mais rápido | 🐌 Mais lento |
| **UX** | ✅ Invisível/Discreto | ❌ Checkbox visível |
| **Privacy** | 🔒 Melhor | ⚠️ Rastreia usuário |
| **Gratuito** | ✅ Sim | ✅ Sim (com limites) |
| **Falsos positivos** | ✅ Menos | ❌ Mais |

## 🔍 Estrutura do Token

### Turnstile Token (exemplo):
```
0.AAAAAA123456abcdefGHIJKL...
```

### Validação (API Cloudflare):
```json
POST https://challenges.cloudflare.com/turnstile/v0/siteverify
{
  "secret": "0x4AAA...secret_key",
  "response": "0.AAAAAA123456...",
  "remoteip": "192.168.1.1"
}
```

### Resposta:
```json
{
  "success": true,
  "challenge_ts": "2026-01-05T13:45:00.000Z",
  "hostname": "localhost",
  "error-codes": [],
  "action": "login"
}
```

## ⚠️ Problemas Comuns

### 1. "turnstile token required"
**Causa:** Site key não configurada ou widget não carregou  
**Solução:** Verificar `VITE_TURNSTILE_SITE_KEY` no `.env`

### 2. "turnstile validation failed"
**Causa:** Secret key incorreta ou token expirado  
**Solução:** 
- Verificar `TURNSTILE_SECRET_KEY` no backend
- Token expira em 5 minutos, tentar novamente

### 3. Widget não aparece
**Causa:** Domínio não configurado no Cloudflare  
**Solução:** Adicionar `localhost` na lista de domínios permitidos

### 4. "TURNSTILE_SECRET_KEY not configured"
**Causa:** Variável de ambiente não carregada  
**Solução:** 
```powershell
cd "c:\Users\maybe\dom-alerts"
# Verificar se .env existe
Get-Content .env
```

## ❓ FAQ

### Por que não usar Pre-clearance?

**Pergunta:** "Should I enable pre-clearance for this site?"

**Resposta:** **❌ NÃO**

**Motivo:**
- **Pre-clearance** emite um cookie de clearance do Cloudflare (como se o usuário tivesse passado por um challenge em um site protegido pelo Cloudflare WAF)
- **Nossa autenticação** usa JWT da DOM API, que é completamente independente do Cloudflare
- O Turnstile aqui serve apenas para validar que é humano **antes** de chamar a DOM API
- O cookie de clearance seria útil apenas se:
  - Seu site estivesse atrás do Cloudflare Proxy
  - Você quisesse reduzir challenges futuros no Cloudflare WAF
  - Mas isso **não tem relação** com a autenticação JWT da aplicação

**Conclusão:** Pre-clearance e JWT são sistemas diferentes. Não marque a opção.

---

### Debug no Backend:
```go
log.Printf("[turnstile] validating token=%s from IP=%s", token[:20]+"...", remoteIP)
```

### Debug no Frontend:
```javascript
console.log('🤖 Turnstile Token:', turnstileToken);
```

## 🎯 Próximos Passos

Após configurar as chaves:

1. ✅ Testar login com credenciais corretas
2. ✅ Verificar validação do Turnstile nos logs
3. ✅ Confirmar que DOM API está sendo chamada
4. 🎉 Login funcional!

---

**Documentação Oficial:**
- https://developers.cloudflare.com/turnstile/
- https://github.com/marsidev/react-turnstile
