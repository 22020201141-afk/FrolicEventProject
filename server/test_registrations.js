(async () => {
  try {
    // Login
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@test.com', password: 'student123' })
    });

    console.log('Login Status:', loginRes.status);
    const loginText = await loginRes.text();
    console.log('Login Body:', loginText);

    if (loginRes.status !== 200) return;

    const loginData = JSON.parse(loginText);
    const token = loginData.data.token;

    // Get registrations
    const regRes = await fetch('http://localhost:5000/api/auth/registrations', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Registrations Status:', regRes.status);
    const regText = await regRes.text();
    console.log('Registrations Body:', regText);

  } catch (err) {
    console.error('Request error:', err);
  }
})();