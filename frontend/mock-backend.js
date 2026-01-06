const http = require('http');
const url = require('url');
const fs = require('fs');

// Load .env.test manually
const envPath = '.env.test';
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const PORT = process.env.MOCK_API_PORT ? Number(process.env.MOCK_API_PORT) : 8081;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;
const ALLOW_TEST_TOKEN = process.env.ALLOW_TEST_TOKEN === 'true';

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Credentials': 'true'
  });
  res.end(body);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (e) { resolve({}); }
    });
    req.on('error', reject);
  });
}

async function verifyRecaptcha(token) {
  // Allow test token if flag is set
  if (ALLOW_TEST_TOKEN && token === 'test-token') {
    console.log('✓ reCAPTCHA: test-token accepted (ALLOW_TEST_TOKEN=true)');
    return { success: true, score: 0.9, action: 'login' };
  }

  // If no secret is configured, reject
  if (!RECAPTCHA_SECRET) {
    console.error('✗ reCAPTCHA: RECAPTCHA_SECRET not configured');
    return { success: false, error_codes: ['missing_secret'] };
  }

  // Verify with Google
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET,
        response: token,
      }).toString(),
    });

    const result = await response.json();
    console.log(`✓ reCAPTCHA verify: success=${result.success} score=${result.score} action=${result.action} errors=${JSON.stringify(result['error-codes'] || [])}`);
    return result;
  } catch (err) {
    console.error('✗ reCAPTCHA verify error:', err.message);
    return { success: false, error_codes: ['verify_failed'] };
  }
}

const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  const path = parsed.pathname;
  console.log(new Date().toISOString(), req.method, path);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Credentials': 'true'
    });
    return res.end();
  }

  if (req.method === 'POST' && path === '/api/v1/auth/login') {
    const body = await parseBody(req);
    console.log('login body:', { email: body.email, password: '***', recaptcha: body.recaptcha?.slice(0, 20) + '...' });
    
    if (!body || !body.email) {
      return sendJson(res, 400, { error: 'email required' });
    }

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(body.recaptcha || '');
    if (!recaptchaResult.success) {
      console.error('✗ login failed: reCAPTCHA verification failed');
      return sendJson(res, 401, { status: 'FAIL', msg: 'Falha na verificação de segurança. Por favor, tente novamente mais tarde.' });
    }

    // Success: return a token
    const token = `mock-jwt-${Date.now()}`;
    return sendJson(res, 200, { token });
  }

  if (req.method === 'GET' && path === '/api/v1/auth/me') {
    const auth = req.headers['authorization'] || '';
    const cookie = req.headers['cookie'] || '';
    const tokenInHeader = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const tokenInCookie = cookie.split(';').map(s => s.trim()).find(s => s.startsWith('token='));
    const token = tokenInHeader || (tokenInCookie ? tokenInCookie.split('=')[1] : null);
    
    if (!token || !token.startsWith('mock-jwt-')) {
      return sendJson(res, 401, { error: 'unauthenticated' });
    }
    return sendJson(res, 200, { user: { id: 'local', name: 'Usuário Mock', email: 'test@local' } });
  }

  if (req.method === 'POST' && path === '/api/v1/auth/refresh') {
    const auth = req.headers['authorization'] || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    
    if (!token || !token.startsWith('mock-jwt-')) {
      return sendJson(res, 401, { error: 'invalid refresh token' });
    }
    
    // Return a new token
    const newToken = `mock-jwt-${Date.now()}`;
    console.log('✓ refresh: issued new token');
    return sendJson(res, 200, { token: newToken });
  }

  // fallback
  sendJson(res, 404, { error: 'not found' });
});

server.listen(PORT, () => {
  console.log(`\n🚀 Mock API listening on http://localhost:${PORT}`);
  console.log(`Environment:`);
  console.log(`  RECAPTCHA_SECRET: ${RECAPTCHA_SECRET ? '***configured***' : 'not set (tokens will be rejected)'}`);
  console.log(`  ALLOW_TEST_TOKEN: ${ALLOW_TEST_TOKEN}`);
  console.log(`\nEndpoints available:`);
  console.log(`  POST /api/v1/auth/login — requires reCAPTCHA token`);
  console.log(`  GET /api/v1/auth/me — requires Bearer token`);
  console.log(`  POST /api/v1/auth/refresh — requires Bearer token`);
  console.log(`\nTest: RECAPTCHA_SECRET="..." ALLOW_TEST_TOKEN=true node mock-backend.js\n`);
});
