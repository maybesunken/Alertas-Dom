# ⚠️ Configuração reCAPTCHA v3 para Produção

## 🚨 Problema: Localhost não funciona com reCAPTCHA v3

O Google reCAPTCHA v3 **bloqueia localhost por padrão** a menos que esteja explicitamente cadastrado. Para testar o sistema completo, é necessário fazer deploy em produção.

## ✅ Credenciais Atuais (NÃO FUNCIONAM EM PRODUÇÃO)

**Site Key:** `6Le7tW0pAAAAAMFRmxZyomtBk2QzsnVI2_7QuysD`  
**Secret Key:** `6Le7tW0pAAAAABsXFckmjXNrxZ7pPcvxPYJJ3aQd`

❌ Estas credenciais provavelmente são:
- De teste/desenvolvimento
- Sem domínios de produção cadastrados
- Podem não funcionar com a API DOM

## 📋 O que precisa confirmar com a DOM Pagamentos

Para integração completa, você precisa solicitar à equipe da DOM:

### 1️⃣ Credenciais Oficiais do reCAPTCHA v3
```
✔️ Site Key oficial da DOM
✔️ Secret Key (backend)
✔️ Action esperada (ex: "login")
```

### 2️⃣ Domínios Permitidos
```
✔️ alertas-dom.vercel.app (frontend em produção)
✔️ dom-alerts-backend-production.up.railway.app (backend)
✔️ localhost (opcional, se quiserem testar local)
```

### 3️⃣ Configurações do Console Google
A DOM precisa configurar no [Google reCAPTCHA Console](https://www.google.com/recaptcha/admin):
- Adicionar domínios permitidos
- Tipo: reCAPTCHA v3
- Action: `login` (ou confirmar qual action usam)

## 🔧 Como Atualizar as Credenciais

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://dom-alerts-backend-production.up.railway.app/api/v1
VITE_RECAPTCHA_SITE_KEY=SITE_KEY_OFICIAL_DA_DOM
```

### Backend (.env ou Railway Variables)
```env
PORT=8080
DOM_API_BASE_URL=https://dev.api.grupookta.com.br
DOM_API_LOGIN_PATH=/platform/login
RECAPTCHA_SECRET_KEY=SECRET_KEY_OFICIAL_DA_DOM
FRONTEND_ORIGIN=https://alertas-dom.vercel.app
```

## 🚀 Deploy em Produção

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (Railway)
1. Acesse: https://railway.com/project/7563c350-6183-4ada-8596-bd2490b64f95
2. Configure Settings → Root Directory: `backend`
3. Configure Settings → Build Command: `go build -o server ./api`
4. Configure Settings → Start Command: `./server`
5. Adicione as variáveis de ambiente
6. Clique em "Redeploy"

## 📊 Payload Enviado para DOM API

```json
{
  "login": "pedro.sansone@dompagamentos.com",
  "pass": "MD5_HASH_DA_SENHA",
  "token_recaptcha": "TOKEN_GOOGLE_RECAPTCHA_V3",
  "ip": "IP_DO_CLIENTE"
}
```

## 🔍 Action do reCAPTCHA

O código atual usa:
```javascript
const token = await executeRecaptcha("login");
```

✅ Action correta: `"login"`

## 📝 Checklist para Produção

- [ ] Confirmar com DOM as credenciais oficiais do reCAPTCHA
- [ ] Verificar se action "login" está configurada no console Google
- [ ] Adicionar domínios de produção no console reCAPTCHA
- [ ] Atualizar `.env.production` do frontend com Site Key oficial
- [ ] Atualizar variáveis Railway com Secret Key oficial
- [ ] Fazer deploy do frontend no Vercel
- [ ] Fazer deploy do backend no Railway
- [ ] Testar login com credenciais reais em produção

## 🆘 Erro Comum

```
"Falha na verificação de segurança"
```

**Possíveis causas:**
1. ❌ reCAPTCHA Site Key não cadastrada para o domínio
2. ❌ Action incorreta (esperada: "login", enviada: outra)
3. ❌ Token expirado (válido por 2 minutos)
4. ❌ IP do cliente não enviado corretamente
5. ❌ Credenciais de teste sendo usadas em produção

## 💡 Solução Temporária

Se não conseguir credenciais oficiais imediatamente:
1. Pergunte se a DOM API aceita skip do reCAPTCHA em desenvolvimento
2. Use um endpoint de dev que não valide reCAPTCHA
3. Ou solicite que adicionem `localhost` temporariamente no console

---

**Status Atual:** ⚠️ Configurado mas aguardando credenciais oficiais da DOM para funcionar em produção
