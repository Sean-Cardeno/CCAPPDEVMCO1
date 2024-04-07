document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const emailElement = document.getElementById('email');
            const passwordElement = document.getElementById('password');

            if (!emailElement || !passwordElement) {
                console.error('Login form elements not found!');
                return;
            }

            const email = emailElement.value;
            const password = passwordElement.value;

            console.log(email);
            console.log(password);

            fetch('https://gamblergoals.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        window.location.href = '/main'; // Redirect to the main page on successful login
                    } else {
                        alert('Login failed: ' + (data.message || 'Unknown error'));
                    }
                })
                .catch(error => {
                    console.error('Error during login:', error);
                    alert('An error occurred during login');
                });
        });
    }
});
