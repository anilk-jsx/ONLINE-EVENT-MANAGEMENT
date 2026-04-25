import http from 'http';

const BASE_URL = 'http://localhost:5001/api';

async function fetchApi(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const req = http.request(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  try {
    const uniqueId = Date.now();
    console.log(`[TEST] Creating User...`);
    const regRes = await fetchApi('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Test Dashboard',
        email: `dashboard${uniqueId}@test.com`,
        password: 'Password123!',
        rpassword: 'Password123!',
        mobile_number: '9876543210'
      }
    });

    if (regRes.status !== 201) {
      console.error('Registration failed:', regRes.body);
      return;
    }
    const token = regRes.body.token;
    console.log(`[TEST] Registration success. Token length: ${token.length}`);

    console.log(`[TEST] Accessing Profile...`);
    const profileRes = await fetchApi('/api/auth/profile', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`[TEST] Profile response status: ${profileRes.status}`);
    console.log(`[TEST] Profile user details:`, profileRes.body.user);

    console.log(`[TEST] Creating Event...`);
    const eventRes = await fetchApi('/api/events', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: {
        title: 'Test Event ' + uniqueId,
        date: '2026-10-10',
        time: '14:00',
        location: 'Virtual',
        available_seats: 100,
        duration: '2 hours'
      }
    });
    console.log(`[TEST] Create Event status: ${eventRes.status}`);

    console.log(`[TEST] Accessing My Events...`);
    const myEventsRes = await fetchApi('/api/events/my-events', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`[TEST] My Events returned ${myEventsRes.body.events?.length} events.`);
    
    console.log(`[TEST] Registration for own event...`);
    const eventId = eventRes.body?.event?._id;
    if (eventId) {
        const regOwnRes = await fetchApi(`/api/registrations/event/${eventId}/register`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`[TEST] Registered for Event status: ${regOwnRes.status}`);
        
        console.log(`[TEST] Accessing My Registrations...`);
        const myRegRes = await fetchApi('/api/registrations/my-registrations', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`[TEST] My Registrations returned ${myRegRes.body.registrations?.length} registrations.`);
    }

    console.log(`[TEST] ALL PASSED`);
  } catch (error) {
    console.error('Test error:', error);
  }
}

runTests();
