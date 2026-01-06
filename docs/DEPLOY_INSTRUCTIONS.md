# 🚀 Instruções de Deploy - DOM Alerts

## 📋 Pré-requisitos

Antes de fazer deploy, você precisa:

1. ✅ **Site Key do Turnstile configurada** com o domínio de produção
2. ✅ **URL da API backend** de produção
3. ✅ **Domínio autorizado** no Cloudflare Turnstile

---

## 🔧 1. Configurar Variáveis de Ambiente

Edite o arquivo `.env.production`:

```bash
cd "Credit Card Fraud Dashboard (2)"
```

Atualize com os valores de produção:

```env
VITE_API_BASE_URL=https://sua-api-producao.com/api/v1
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAA5T0iUk5STkr3JH
```

---

## 🏗️ 2. Build do Frontend

```powershell
# No terminal PowerShell
cd "c:\Users\maybe\dom-alerts\Credit Card Fraud Dashboard (2)"

# Instalar dependências (se necessário)
npm install

# Criar build de produção
npm run build
```

**Resultado:** Pasta `dist/` com arquivos estáticos prontos para deploy

---

## 🌐 3. Opções de Deploy

### Opção A: Vercel (Recomendado - Grátis)

1. Crie conta em: https://vercel.com
2. Instale Vercel CLI:
   ```powershell
   npm install -g vercel
   ```
3. Deploy:
   ```powershell
   cd "Credit Card Fraud Dashboard (2)"
   vercel
   ```
4. Configure as variáveis de ambiente no painel Vercel:
   - `VITE_API_BASE_URL`
   - `VITE_TURNSTILE_SITE_KEY`

**Domínio:** `seu-projeto.vercel.app`

---

### Opção B: Netlify (Grátis)

1. Crie conta em: https://netlify.com
2. Arraste a pasta `dist/` para o painel do Netlify
3. Configure variáveis no painel: Settings → Environment Variables

**Domínio:** `seu-projeto.netlify.app`

---

### Opção C: Cloudflare Pages (Grátis)

1. Crie conta em: https://pages.cloudflare.com
2. Conecte ao repositório Git ou faça upload da pasta `dist/`
3. Configure:
   - Build command: `npm run build`
   - Build output: `dist`
4. Variáveis de ambiente no painel

**Domínio:** `seu-projeto.pages.dev`

---

### Opção D: Servidor Próprio (Nginx/Apache)

1. Faça upload dos arquivos da pasta `dist/` para o servidor
2. Configure o servidor web:

**Nginx:**
```nginx
server {
    listen 80;
    server_name alertas.grupookta.com.br;
    root /var/www/dom-alerts/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## ⚙️ 4. Configurar Turnstile para Domínio de Produção

No painel Cloudflare Turnstile:

1. Acesse: https://dash.cloudflare.com/?to=/:account/turnstile
2. Edite o site com Site Key: `0x4AAAAAAA5T0iUk5STkr3JH`
3. Adicione o domínio de produção:
   ```
   alertas.grupookta.com.br
   seu-projeto.vercel.app
   seu-dominio.com
   ```
4. Salve

---

## ✅ 5. Verificação Pós-Deploy

Após deploy, teste:

1. ✅ Widget Turnstile aparece sem erro de domínio
2. ✅ Login funciona com credenciais válidas
3. ✅ Requisições chegam na API backend
4. ✅ Console do navegador sem erros

---

## 🔐 6. Configurar CORS no Backend

Atualize o backend Go para aceitar o domínio de produção:

```go
// cmd/api/main.go
func corsHandler() func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            origin := r.Header.Get("Origin")
            allowedOrigins := []string{
                "http://localhost:3000",
                "https://alertas.grupookta.com.br",
                "https://seu-projeto.vercel.app",
            }
            
            for _, allowed := range allowedOrigins {
                if origin == allowed {
                    w.Header().Set("Access-Control-Allow-Origin", origin)
                    break
                }
            }
            // ... resto do código CORS
        })
    }
}
```

---

## 📝 Checklist Final

Antes de ir para produção:

- [ ] `.env.production` configurado com URLs corretas
- [ ] Build executado sem erros (`npm run build`)
- [ ] Domínio adicionado no Turnstile
- [ ] CORS configurado no backend para domínio de produção
- [ ] Teste de login funcionando
- [ ] Remover logs de debug do console (senha em texto plano)

---

## 🐛 Troubleshooting

### Erro: "Widget bloqueado - domínio inválido"
**Solução:** Adicione o domínio no painel Cloudflare Turnstile

### Erro: CORS blocked
**Solução:** Configure CORS no backend para aceitar o domínio de produção

### Erro: API não responde
**Solução:** Verifique `VITE_API_BASE_URL` no `.env.production`

### Build falha
**Solução:** Execute `npm install` primeiro, depois `npm run build`

---

## 📞 Suporte

Se precisar de ajuda, entre em contato com o time de DevOps da DOM Pagamentos.
