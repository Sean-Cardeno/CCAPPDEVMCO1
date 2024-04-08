document.addEventListener('DOMContentLoaded', async function () {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        const userData = {
            email,
            username,
            password
        };

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userData }),
            });
            const data = await response.json();

            // Handle response from the server
            if (response.ok) {
                alert('Registration successful!');
                window.location.href = '/'; // Redirect to login page upon successful registration
            } else {
                alert(`Registration failed: ${data.message}`);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });
});
