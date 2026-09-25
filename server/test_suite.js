const http = require('http');

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

async function runAuthTests() {
  console.log('====================================================');
  console.log(' RUNNING ADMIN AUTHENTICATION VERIFICATION SUITE');
  console.log('====================================================\n');

  try {
    // Test Case 1: Demo Account Login
    console.log('[Test Case 1] Login with demo account (admin / admin123)...');
    const demoLoginRes = await request('POST', '/api/admin/login', {
      username: 'admin',
      password: 'admin123',
    });
    if (demoLoginRes.status !== 200 || !demoLoginRes.body.token) {
      throw new Error(`Test Case 1 Failed: ${JSON.stringify(demoLoginRes.body)}`);
    }
    console.log('✓ Test Case 1 Passed: Demo admin logged in successfully via MongoDB bcrypt hash.');

    // Test Case 2: Create Custom Admin Account & Login
    console.log('\n[Test Case 2] Creating custom admin (myadmin / mypassword123)...');
    const regRes = await request('POST', '/api/admin/register', {
      username: 'myadmin',
      password: 'mypassword123',
      confirmPassword: 'mypassword123',
    });
    if (regRes.status !== 201 || regRes.body.message !== 'Admin account created successfully.') {
      throw new Error(`Test Case 2 Registration Failed: ${JSON.stringify(regRes.body)}`);
    }
    console.log('✓ Custom admin "myadmin" saved in MongoDB successfully.');

    console.log('Logging in with custom admin (myadmin / mypassword123)...');
    const customLoginRes = await request('POST', '/api/admin/login', {
      username: 'myadmin',
      password: 'mypassword123',
    });
    if (customLoginRes.status !== 200 || !customLoginRes.body.token) {
      throw new Error(`Test Case 2 Login Failed: ${JSON.stringify(customLoginRes.body)}`);
    }
    const customToken = customLoginRes.body.token;
    console.log('✓ Test Case 2 Passed: Custom admin logged in successfully and received JWT.');

    // Duplicate Registration Block Test
    console.log('\nTesting duplicate username registration...');
    const dupRegRes = await request('POST', '/api/admin/register', {
      username: 'myadmin',
      password: 'anotherpassword',
    });
    if (dupRegRes.status !== 400 || dupRegRes.body.message !== 'Username already exists.') {
      throw new Error(`Duplicate Username test failed: ${JSON.stringify(dupRegRes.body)}`);
    }
    console.log('✓ Duplicate username registration correctly blocked: "Username already exists."');

    // Test Case 3: Wrong Password
    console.log('\n[Test Case 3] Login with wrong password (myadmin / wrongpassword)...');
    const wrongPassRes = await request('POST', '/api/admin/login', {
      username: 'myadmin',
      password: 'wrongpassword',
    });
    if (wrongPassRes.status !== 401 || wrongPassRes.body.message !== 'Invalid username or password.') {
      throw new Error(`Test Case 3 Failed: ${JSON.stringify(wrongPassRes.body)}`);
    }
    console.log('✓ Test Case 3 Passed: Wrong password rejected with "Invalid username or password."');

    // Test Case 4: Non-existent Username
    console.log('\n[Test Case 4] Login with non-existent username (nonexistent / anything)...');
    const nonExistentRes = await request('POST', '/api/admin/login', {
      username: 'nonexistent',
      password: 'anything',
    });
    if (nonExistentRes.status !== 401 || nonExistentRes.body.message !== 'Invalid username or password.') {
      throw new Error(`Test Case 4 Failed: ${JSON.stringify(nonExistentRes.body)}`);
    }
    console.log('✓ Test Case 4 Passed: Non-existent user rejected with generic "Invalid username or password."');

    // Test Case 5: Unauthenticated Admin Dashboard API Protection
    console.log('\n[Test Case 5] Accessing protected route /api/admin/camps without JWT token...');
    const unauthRes = await request('GET', '/api/admin/camps');
    if (unauthRes.status !== 401) {
      throw new Error(`Test Case 5 Failed: Expected 401 Unauthorized, got ${unauthRes.status}`);
    }
    console.log('✓ Test Case 5 Passed: Protected admin routes require valid JWT token.');

    // Test Case 6: Accessing protected route with Custom Admin Token
    console.log('\n[Test Case 6] Accessing protected route /api/admin/camps WITH custom admin JWT token...');
    const authRes = await request('GET', '/api/admin/camps', null, customToken);
    if (authRes.status !== 200 || !Array.isArray(authRes.body)) {
      throw new Error(`Test Case 6 Failed: ${JSON.stringify(authRes.body)}`);
    }
    console.log('✓ Test Case 6 Passed: Protected admin routes accessible with custom admin token.');

    console.log('\n====================================================');
    console.log(' ALL ADMIN AUTHENTICATION TESTS PASSED 100% !');
    console.log('====================================================');
  } catch (error) {
    console.error('\n❌ Auth Test Suite Error:', error.message);
    process.exit(1);
  }
}

runAuthTests();
