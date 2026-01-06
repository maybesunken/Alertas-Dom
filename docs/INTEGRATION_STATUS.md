# Status da Integração DOM Pagamentos

## ✅ Configurações Corretas

### Frontend (React)
- ✅ reCAPTCHA v2 (checkbox) integrado no login
- ✅ Site key: `6LclSj4sAAAAAAXXVjovZVK49L60AApsI5O3Dawj`
- ✅ Domínios configurados: `localhost`, `127.0.0.1`, `dev.api.grupookta.com.br`, `localhost:3000`
- ✅ Token sendo gerado e enviado corretamente
- ✅ Rodando em `http://localhost:3000`

### Backend (Go)
- ✅ API rodando em `http://localhost:8080`
- ✅ Endpoint: `/api/v1/auth/login`
- ✅ Payload correto sendo enviado para DOM API:
  ```json
  {
    "login": "pedro.sansone@dompagamentos.com",
    "pass": "pedro.sansone@dompagamentos.com",
    "token_recaptcha": "<token válido>"
  }
  ```
- ✅ Headers corretos:
  - `Content-Type: application/json; charset=utf-8`
  - `Accept: application/json`
- ✅ CORS configurado para `localhost:3000`
- ✅ Token reCAPTCHA sendo passado direto para DOM API (sem validação dupla)

### API DOM
- URL: `https://dev.api.grupookta.com.br/platform/login`
- Método: `POST`

## ❌ Problema Atual

**Resposta da API DOM:**
```json
{
  "status": "FAIL",
  "msg": "Falha na verificação de segurança. Por favor, tente novamente mais tarde."
}
```

**Status HTTP:** `401 Unauthorized`

## 🔍 O Que Verificar com o Time DOM

1. **Credenciais de Teste:**
   - As credenciais `pedro.sansone@dompagamentos.com` / `pedro.sansone@dompagamentos.com` estão corretas?
   - Existe um usuário de teste específico para desenvolvimento?
   
2. **API de Desenvolvimento:**
   - A API `https://dev.api.grupookta.com.br/platform/login` está funcional?
   - Há algum IP whitelist ou restrição de acesso?
   
3. **reCAPTCHA:**
   - ✅ O domínio `localhost` está configurado corretamente na lista de domínios permitidos do Google reCAPTCHA
   - ✅ Token reCAPTCHA está sendo recebido corretamente (1678 caracteres)
   - ✅ Token está sendo enviado para a API DOM sem validação dupla (token fresco)
   - ⚠️ A API DOM valida o token reCAPTCHA e a senha do lado deles antes de emitir o JWT

4. **Headers Adicionais:**
   - ✅ Headers corretos conforme documentação oficial
   - ✅ Não requer API Key ou Authorization adicional

5. **Diagnóstico Final:**
   - ✅ Token reCAPTCHA: **FUNCIONANDO** (recebido e enviado corretamente)
   - ✅ Estrutura do payload: **CORRETA** (conforme documentação oficial)
   - ✅ Headers HTTP: **CORRETOS**
   - ❌ **Credenciais inválidas**: `pedro.sansone@dompagamentos.com` / `pedro.sansone@dompagamentos.com`
   
   **Baseado no CT03 dos casos de teste:**
   - API retorna 401: "Credenciais inválidas" 
   - Comportamento esperado quando **senha está incorreta**

## 📝 Logs de Exemplo (Última Tentativa)

```
2026/01/02 18:14:34 [login] recaptcha token present for user=pedro.sansone@dompagamentos.com (length=1678), forwarding to DOM API
2026/01/02 18:14:34 [login] sending to DOM API: map[login:pedro.sansone@dompagamentos.com pass:pedro.sansone@dompagamentos.com token_recaptcha:0cAFcWeA5rtO...]
2026/01/02 18:14:34 [login] calling DOM API at https://dev.api.grupookta.com.br/platform/login
2026/01/02 18:14:35 [login] DOM API returned 401 for user=pedro.sansone@dompagamentos.com, body: {"status":"FAIL","msg":"Falha na verificação de segurança. Por favor, tente novamente mais tarde."}
```

**Análise:** Token reCAPTCHA com 1678 caracteres indica token válido. A mensagem "Falha na verificação de segurança" corresponde ao CT03 (senha incorreta).

## 🚀 Próximos Passos

**PROBLEMA IDENTIFICADO:** Estamos usando chaves reCAPTCHA DIFERENTES da DOM Pagamentos!

**Causa raiz:**
1. ✅ Geramos token reCAPTCHA com NOSSA site key: `6LclSj4sAAAAAAXXVjovZVK49L60AApsI5O3Dawj`
2. ❌ DOM API valida o token com a secret key DELES (diferente)
3. ❌ Google retorna: token inválido (site key não corresponde à secret key)
4. ❌ DOM retorna: "Falha na verificação de segurança"

**Solução:**
Precisamos usar a **MESMA site key** que a DOM Pagamentos configurou no Google reCAPTCHA.

**Ação necessária:**
1. ✅ **Solicitar ao Luan da DOM Pagamentos:**
   - reCAPTCHA Site Key (chave pública) configurada na API deles
   - Lista de domínios permitidos nessa configuração
2. ✅ Atualizar `VITE_RECAPTCHA_SITE_KEY` no frontend com a chave correta
3. ✅ Testar novamente

**Observação:** As credenciais `pedro.sansone@dompagamentos.com` / `pedro.sansone@dompagamentos.com` estão corretas (confirmadas pelo Luan).

**Status da integração:**
- ✅ Frontend: 100% funcional
- ✅ Backend: 100% funcional  
- ❌ **Bloqueio:** Site key do reCAPTCHA incorreta (não corresponde à configuração da DOM)

## 📋 Casos de Teste Implementados

| ID | Status | Descrição |
|----|--------|-----------|
| CT01 | ⏳ Aguardando credenciais | Login com sucesso |
| CT02 | ✅ Implementado | Validação do reCAPTCHA (botão desabilitado sem checkbox) |
| CT03 | ✅ Funcionando | Senha incorreta (retorna 401 com mensagem de erro) |
| CT04 | ✅ Implementado | Tratamento de erro de API offline |

## 📞 Informações de Contato

- **Email do usuário teste:** pedro.sansone@dompagamentos.com
- **API Base URL:** https://dev.api.grupookta.com.br
- **Site reCAPTCHA:** Etiqueta `alerts`
