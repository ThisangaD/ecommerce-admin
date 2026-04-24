async function triggerError() {
  try {
    const loginRes = await fetch('http://127.0.0.1:3000/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'admin123' })
    });
    
    const setCookieHeader = loginRes.headers.get('set-cookie');
    const cookie = setCookieHeader ? setCookieHeader.split(';')[0] : '';

    console.log('Fetching Product list...');
    await fetch('http://127.0.0.1:3000/admin/api/resources/Product/actions/list', {
      headers: { Cookie: cookie }
    });
    console.log('Done fetching.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}
triggerError();
