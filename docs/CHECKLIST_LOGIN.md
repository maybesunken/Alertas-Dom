# ✅ Checklist de Verificação - Problemas de Login

## 🎯 Problemas Identificados

### 1. ❌ Site Key do reCAPTCHA Incorreta

**Problema:** Estamos usando site key **DIFERENTE** da configurada pela DOM Pagamentos.

**Como funciona o reCAPTCHA:**
```
Frontend (nossa site key) → Google → Token
Token → DOM API → Google (secret key da DOM) → ❌ FALHA (chaves não correspondem)
```

**Site key atual no código:**
- `6LclSj4sAAAAAAXXVjovZVK49L60AApsI5O3Dawj`

**Ação necessária:**
- [ ] Solicitar ao **Luan da DOM Pagamentos** a site key correta
- [ ] Atualizar no frontend em `.env`:
  ```env
  VITE_RECAPTCHA_SITE_KEY=CHAVE_CORRETA_AQUI
  ```

---

### 2. ❌ Credenciais de Teste Incorretas

**Credenciais atuais (provavelmente inválidas):**
- Login: `pedro.sansone@dompagamentos.com`
- Senha: `pedro.sansone@dompagamentos.com`

**Ação necessária:**
- [ ] Solicitar ao time DOM credenciais válidas para ambiente de desenvolvimento
- [ ] Testar com as novas credenciais

---

### 3. ✅ Estrutura do Payload (CORRETO)

O backend está enviando o payload correto:
```json
{
  "login": "usuario@email.com",
  "pass": "senha",
  "token_recaptcha": "token_aqui"
}
```

✅ Campo `token_recaptcha` correto (não `recaptchaToken`)

---

### 4. ✅ Headers HTTP (CORRETO)

```
Content-Type: application/json; charset=utf-8
Accept: application/json
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

---

## 🔍 Como Testar

### Teste 1: Verificar Token reCAPTCHA no Frontend

1. Abrir Developer Tools (F12)
2. Aba Network
3. Fazer login
4. Ver requisição para `/api/v1/auth/login`
5. Verificar:
   ```json
   {
     "token_recaptcha": "03AGdBq26..." // Deve ter ~1600+ caracteres
   }
   ```

### Teste 2: Verificar Logs do Backend

```bash
go run cmd/api/main.go
```

Procurar por:
```
[login] attempting login for user=...
[login] calling DOM API at https://dev.api.grupookta.com.br/platform/login
[login] DOM API returned status=XXX, body=...
```

### Teste 3: Testar DOM API Direto (curl)

```bash
# Gerar token reCAPTCHA no frontend primeiro
# Copiar o token e testar:

curl -X POST https://dev.api.grupookta.com.br/platform/login \
  -H "Content-Type: application/json; charset=utf-8" \
  -H "Accept: application/json" \
  -d '{
    "login": "USUARIO_VALIDO",
    "pass": "SENHA_VALIDA",
    "token_recaptcha": "TOKEN_GERADO_NO_FRONTEND"
  }'
```

**Resposta esperada (sucesso):**
```json
{
  "status": "OK",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Resposta esperada (falha de reCAPTCHA):**
```json
{
  "status": "FAIL",
  "msg": "Falha na verificação de segurança. Por favor, tente novamente mais tarde."
}
```

**Resposta esperada (credenciais inválidas):**
```json
{
  "status": "FAIL",
  "msg": "Credenciais inválidas"
}
```

---

## 📋 Checklist Completo

### Frontend
- [ ] Site key do reCAPTCHA correto no `.env`
- [ ] reCAPTCHA v2 (checkbox) implementado
- [ ] Token sendo gerado (verificar Developer Tools)
- [ ] Payload enviando `token_recaptcha` (não `recaptchaToken`)

### Backend Go
- [x] Rota `/api/v1/auth/login` implementada
- [x] Payload correto (`token_recaptcha`)
- [x] Headers HTTP corretos
- [x] Logs detalhados habilitados
- [x] CORS configurado para localhost:3000

### API DOM
- [ ] Credenciais válidas obtidas
- [ ] Site key reCAPTCHA correto
- [ ] Ambiente de desenvolvimento acessível
- [ ] Sem IP whitelist bloqueando acesso

---

## 🚨 Próximas Ações Prioritárias

1. **URGENTE:** Solicitar ao Luan (DOM):
   - ✉️ Site key do reCAPTCHA para ambiente de desenvolvimento
   - ✉️ Credenciais de teste válidas (usuário/senha)
   - ✉️ Confirmar se há IP whitelist ou outras restrições

2. **Testar:** Assim que obter os dados corretos:
   - Atualizar site key no frontend
   - Atualizar credenciais de teste
   - Testar login end-to-end

3. **Verificar:** Se ainda falhar:
   - Verificar logs do backend
   - Testar DOM API diretamente com curl
   - Verificar se token reCAPTCHA não expirou (válido por 2 min)

---

## 📞 Contatos

**Luan - DOM Pagamentos**
- Solicitar: Site key reCAPTCHA + Credenciais de teste
- Confirmar: Sem IP whitelist ou restrições

---

## 📝 Anotações

### Mensagens de Erro da DOM API

| Status | Mensagem | Causa |
|--------|----------|-------|
| 401 | "Falha na verificação de segurança" | reCAPTCHA inválido ou site key errada |
| 401 | "Credenciais inválidas" | Usuário ou senha incorretos |
| 500 | "Internal Server Error" | Problema no servidor DOM |
| Timeout | Connection timeout | API DOM indisponível |

### Domínios Configurados no reCAPTCHA

Devem estar na lista de domínios permitidos no Google reCAPTCHA:
- `localhost`
- `127.0.0.1`
- `dev.api.grupookta.com.br` (se testar direto)
- Domínio de produção (quando deploy)
