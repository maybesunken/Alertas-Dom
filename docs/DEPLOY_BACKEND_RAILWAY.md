# 🚀 Deploy Backend Go no Railway

## 📋 Passo a Passo

### 1️⃣ **Criar conta no Railway**
Acesse: https://railway.app/
- Clique em "Login" ou "Start a New Project"
- Faça login com GitHub

### 2️⃣ **Criar novo projeto**
1. No dashboard, clique em **"New Project"**
2. Escolha **"Deploy from GitHub repo"**
3. Se for a primeira vez, autorize o Railway a acessar seu GitHub
4. Conecte o repositório `dom-alerts` (ou faça upload manual)

### 3️⃣ **Configurar variáveis de ambiente**

No Railway, vá em **Variables** e adicione:

```env
PORT=8080
ENV=production
DOM_API_BASE_URL=https://dev.api.grupookta.com.br
DOM_API_LOGIN_PATH=/platform/login
TURNSTILE_SECRET_KEY=0x4AAAAAACKrljrhM-S8rmvCpLtURLc2jtc
FRONTEND_ORIGIN=https://alertas-dom.vercel.app
```

### 4️⃣ **Deploy automático**

O Railway vai:
- ✅ Detectar que é um projeto Go
- ✅ Executar `go build`
- ✅ Iniciar o servidor
- ✅ Gerar uma URL: `https://seu-projeto.railway.app`

### 5️⃣ **Atualizar Frontend**

Depois do deploy, copie a URL do Railway e atualize no Vercel:

```bash
vercel env rm VITE_API_BASE_URL production
vercel env add VITE_API_BASE_URL production
# Cole: https://seu-projeto.railway.app/api/v1
```

Faça redeploy do frontend:
```bash
vercel --prod --force
```

---

## 🔧 **Alternativa: Deploy via CLI**

Se preferir usar linha de comando:

```powershell
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Inicializar projeto
railway init

# Deploy
railway up
```

---

## ✅ **Checklist Pós-Deploy**

- [ ] Backend rodando no Railway
- [ ] URL do backend copiada
- [ ] Frontend atualizado com nova URL
- [ ] CORS configurado para aceitar domínio Vercel
- [ ] Teste de login funcionando

---

## 🐛 **Troubleshooting**

**Erro: "Build failed"**
- Verifique se `go.mod` e `go.sum` estão commitados

**Erro: "Port already in use"**
- Railway define PORT automaticamente, use `os.Getenv("PORT")`

**Erro: CORS**
- Verifique se `FRONTEND_ORIGIN` está configurado

---

**Começe agora:** https://railway.app
