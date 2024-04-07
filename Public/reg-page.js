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

        try {
            const response = await fetch('https://gamblergoals.onrender.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            alert(data.message); // Assuming the response contains a message property
            if (data.message === 'User created successfully') {
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error:', error.message);
            alert('An error occurred. Please try again later.');
        }
    });
});
