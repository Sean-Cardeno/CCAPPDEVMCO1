document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (!loginForm) {
        console.error('Login form not found!');
        return;
    }

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        handleLogin();
    });
});

function handleLogin() {
    const usernameElement = document.getElementById('username');
    const passwordElement = document.getElementById('password');

    if (!usernameElement || !passwordElement) {
        console.error('Login form elements not found!');
        return;
    }

    const username = usernameElement.value.trim();
    const password = passwordElement.value.trim();
    fetch('http://gamblergoals.onrender.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to login. Please check your credentials.');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Assuming your server responds with { success: true, userID: "someId" } on successful login
                localStorage.setItem('currentUserID', data.userID);
                window.location.href = '/main';  // Ensure this path is correct
            } else {
                // If your server responds with { success: false } on failed login
                alert('Login failed: ' + (data.message || 'Incorrect email or password.'));
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('An error occurred during login: ' + error.message);
        });
}
