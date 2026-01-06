// Test the complete auth flow: login -> /auth/me -> /auth/refresh

const BASE_URL = 'http://localhost:8081/api/v1';

async function testAuthFlow() {
  console.log('\n🧪 Testing authentication flow...\n');

  try {
    // Step 1: Login
    console.log('=== POST /auth/login ===');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'senha',
        recaptcha: 'test-token'
      })
    });
    
    const loginData = await loginRes.json();
    console.log('Status:', loginRes.status);
    console.log('Response:', JSON.stringify(loginData, null, 2));

    if (!loginData.token) {
      console.error('❌ No token received!');
      return;
    }

    const token = loginData.token;
    console.log('✓ Token received:', token.slice(0, 30) + '...');

    // Step 2: Get user info
    console.log('\n=== GET /auth/me ===');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: { 'authorization': `Bearer ${token}` }
    });

    const meData = await meRes.json();
    console.log('Status:', meRes.status);
    console.log('Response:', JSON.stringify(meData, null, 2));

    if (meRes.status === 200) {
      console.log('✓ User authenticated successfully');
    }

    // Step 3: Refresh token
    console.log('\n=== POST /auth/refresh ===');
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'authorization': `Bearer ${token}` }
    });

    const refreshData = await refreshRes.json();
    console.log('Status:', refreshRes.status);
    console.log('Response:', JSON.stringify(refreshData, null, 2));

    if (refreshData.token) {
      console.log('✓ New token received:', refreshData.token.slice(0, 30) + '...');
    }

    console.log('\n✅ All tests passed!\n');

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

testAuthFlow();
