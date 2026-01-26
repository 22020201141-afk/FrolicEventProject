(async () => {
  try {
    // Login
    const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
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

    // Register for event
    const eventId = '6973a883beea77f36eae2653';
    const registerRes = await fetch(`http://127.0.0.1:5000/api/events/${eventId}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Register Status:', registerRes.status);
    const registerText = await registerRes.text();
    console.log('Register Body:', registerText);

    // Get registrations
    const regRes = await fetch('http://127.0.0.1:5000/api/auth/registrations', {
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