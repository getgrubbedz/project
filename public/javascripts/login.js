const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent default form submission

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // Prepare login data (replace with your API endpoint)
  const data = { username, password };

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Login failed with status ${response.status}`);
    }
    location.reload();
/*
    //const loginData = await response.json();

    // Handle successful login
    if (response.token) {
      console.log('Login successful!');
      localStorage.setItem('jwtToken', loginData.token); // Store JWT token in local storage
      // Redirect to the desired protected route or handle successful login UI changes
    } else {
      console.error('Login failed:', loginData.message);
      // Handle login failure (e.g., display error message)
    }*/
  } catch (error) {
    console.error('Error logging in:', error);
    // Handle errors (e.g., display error message)
  }
});