document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const loginBtn = document.getElementById('loginBtn');

  // Start loading state
  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

  try {
    const response = await fetch('https://pharmacy-api-v746.onrender.com/api/Auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'text/plain'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Login failed');
    }

    const data = await response.json();
    console.log('Login successful:', data);

    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);

    // Redirect based on role
    if (data.role.toLowerCase() === 'admin') {
      window.location.href = 'dashboard/';
    } else {
      window.location.href = 'index.html';
    }

  } catch (error) {
    console.error('Error during login:', error);
    alert('Login failed: ' + error.message);
  } finally {
    // Reset loading state if still on login page (in case of error)
    loginBtn.disabled = false;
    loginBtn.innerHTML = 'Login';
  }
});
