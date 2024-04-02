const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const first = document.getElementById('first').value;
  const last = document.getElementById('last').value;
  const email = document.getElementById('email').value;

  // Basic validation (optional)
  if (!username || !password) {
    alert('Please enter username and password.');
    return;
  }

  // Prepare registration data
  const data = { username, password, first, last, email };

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Registration failed with status ${response.status}`);
    }
    location.reload();

    /*const responseData = await response.json();

    if (responseData.message === 'User registered successfully!') {
      console.log('Registration successful!');
      // Handle successful registration (e.g., redirect to login page, display success message)
    } else {
      console.error('Registration failed:', responseData.message);
      // Handle registration failure (e.g., display error message)
    }*/
  } catch (error) {
    console.error('Error registering:', error);
    // Handle errors (e.g., display error message)
  }
});