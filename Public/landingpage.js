document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const usernameElement = document.getElementById('username');
            const passwordElement = document.getElementById('password');
            console.log(usernameElement);
            if (!usernameElement || !passwordElement) {
                console.error('Login form elements not found!');
                return;
            }

            const username = usernameElement.value;
            const password = passwordElement.value;

            try {
                const response = await fetch('https://gamblergoals.onrender.com/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: username, password: password }),
                });

                if (!response.ok) {
                    // Handle different responses based on the status code
                    switch (response.status) {
                        case 401:
                            // Unauthorized access
                            alert('Login failed: Incorrect username or password');
                            break;
                        case 404:
                            // Not found
                            alert('Login failed: Resource not found');
                            break;
                        case 500:
                            // Server error
                            alert('Login failed: Server error');
                            break;
                        default:
                            // Other errors
                            throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                } else {
                    const data = await response.json();
                    if (data.success) {
                        window.location.href = '/main'; // Redirect on successful login
                    } else {
                        alert('Login failed: ' + (data.message || 'Unknown error'));
                    }
                }
            } catch (error) {
                console.error('Error during login:', error);
                alert('An error occurred during login. Please check the console for more information.');
            }
        });
    }
});
