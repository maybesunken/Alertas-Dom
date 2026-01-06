# 🔐 Solicitação de Autorização - Cloudflare Turnstile

**Para:** Time de DevOps/Infraestrutura - DOM Pagamentos  
**Assunto:** Adicionar domínio no Cloudflare Turnstile para Sistema de Alertas

---

## 📋 Solicitação

Olá time,

Preciso que seja adicionado o seguinte domínio na configuração do **Cloudflare Turnstile** da DOM Pagamentos:

### **Domínio a ser autorizado:**
```
alertas-dom.vercel.app
```

---

## 🔑 Informações Técnicas

- **Site Key (pública):** `0x4AAAAAAA5T0iUk5STkr3JH`
- **Secret Key (privada):** `0x4AAAAAAA5T0l9dSB1KWWTf8PhlCZf77DE`
- **Sistema:** DOM Alerts - Sistema de Detecção de Fraudes
- **URL do sistema:** https://alertas-dom.vercel.app

---

## 📝 Passos para Autorizar

1. Acessar: https://dash.cloudflare.com (conta da DOM)
2. Ir em **Turnstile** no menu lateral
3. Localizar o site com Site Key: `0x4AAAAAAA5T0iUk5STkr3JH`
4. Clicar em **"Settings"** ou **"Edit"**
5. Na seção **"Domains"**, adicionar:
   ```
   alertas-dom.vercel.app
   ```
6. Clicar em **"Save"**

---

## ✅ Após a Autorização

Assim que o domínio for adicionado, o widget Turnstile funcionará corretamente no sistema de alertas e o login estará operacional.

---

## 📞 Contato

Se houver dúvidas ou precisar de mais informações, estou à disposição.

**Obs:** Este é um ambiente de **desenvolvimento/homologação** hospedado no Vercel.

---

**Obrigado!**
