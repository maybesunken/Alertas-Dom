# Script de Teste - Login

## Teste 1: Health Check

```powershell
# Testar se o backend está rodando
curl http://localhost:8080/health
```

**Resposta esperada:**
```json
{"status":"ok"}
```

## Teste 2: Login com Dados Mock

⚠️ **Importante:** Você precisa gerar um token reCAPTCHA válido primeiro!

### Passo 1: Gerar Token reCAPTCHA
1. Abrir http://localhost:3000
2. Abrir DevTools (F12) → Console
3. Executar:
```javascript
grecaptcha.execute()
```
4. Copiar o token gerado

### Passo 2: Testar Login via curl

```powershell
$token = "TOKEN_COPIADO_AQUI"

$body = @{
    login = "pedro.sansone@dompagamentos.cpm"
    pass = "SENHA_CORRETA"
    token_recaptcha = $token
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/v1/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

**Resposta esperada (sucesso):**
```json
{
  "token": "eyJhbGci...",
  "user": {
    "email": "pedro.sansone@dompagamentos.cpm",
    "name": "pedro.sansone@dompagamentos.cpm"
  }
}
```

**Resposta esperada (erro - credenciais inválidas):**
```json
{
  "error": "authentication failed"
}
```

## Teste 3: Verificar Logs do Backend

No terminal onde o backend está rodando, você deve ver:

```
[2026-01-05T13:40:00Z] REQUEST POST /api/v1/auth/login headers=map[Accept:*/* Content-Type:application/json] body={"login":"pedro.sansone@dompagamentos.cpm","pass":"****","token_recaptcha":"03AGdBq26..."}
[login] attempting login for user=pedro.sansone@dompagamentos.cpm, recaptcha token length=1678
[login] calling DOM API at https://api.grupookta.com.br/platform/login with payload: {"login":"pedro.sansone@dompagamentos.cpm","pass":"****","token_recaptcha":"03AGdBq26..."}
[login] DOM API returned status=401, body={"status":"FAIL","msg":"Falha na verificação de segurança"}
[login] DOM API authentication failed: status=FAIL, msg=Falha na verificação de segurança
[2026-01-05T13:40:01Z] COMPLETED POST /api/v1/auth/login in=800ms
```

## 🔍 Interpretando os Logs

### Status 200 da DOM API
✅ **Sucesso!** Login funcionou, credenciais e reCAPTCHA válidos

### Status 401 da DOM API
❌ **Falha de autenticação** - Pode ser:
1. Credenciais inválidas (usuário ou senha errados)
2. Token reCAPTCHA inválido ou expirado
3. Site key reCAPTCHA errada

### "Falha na verificação de segurança"
❌ **reCAPTCHA inválido** - Provavelmente:
- Site key diferente da configurada na DOM
- Token expirado (válido por 2 minutos)
- Token já foi usado

### Timeout ou Connection Error
❌ **API DOM indisponível** - Verificar:
- URL da API DOM
- Conectividade com internet
- Firewall/proxy bloqueando

## 📝 Checklist de Debug

- [ ] Backend rodando em :8080
- [ ] Frontend rodando em :3000
- [ ] Health check retorna `{"status":"ok"}`
- [ ] reCAPTCHA gerando token (1600+ caracteres)
- [ ] Token sendo enviado no payload
- [ ] Logs do backend mostrando a requisição
- [ ] Credenciais corretas obtidas do time DOM
- [ ] Site key correto no frontend
