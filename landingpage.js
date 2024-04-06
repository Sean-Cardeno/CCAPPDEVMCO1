// landingpage.js

function handleLogin() {
    const emailElement = document.getElementById('email');
    const passwordElement = document.getElementById('password');

    if (!emailElement || !passwordElement) {
        console.error('Login form elements not found!');
        return;
    }

    const email = emailElement.value;
    const password = passwordElement.value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, userPassword: password }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Assuming your server responds with { success: true, userID: "someId" } on successful login
                localStorage.setItem('currentUserID', data.userID);
                window.location.href = 'main.html';
                // Redirect or update UI as necessary
            } else {
                // If your server responds with { success: false } on failed login
                alert('Login failed: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error during login:', error);
            alert('An error occurred during login');
        });
}


// Add event listener to the login form submit event
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            handleLogin();
        });
    }
});
