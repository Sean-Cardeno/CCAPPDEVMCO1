document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    registrationForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        console.log('Password:', password);
        console.log('Confirm Password:', confirmPassword);
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                userName: username,  // Changed to match server.js
                userPassword: password // Changed to match server.js
            }),
        })
            .then(response => response.text())
            .then(data => {
                alert(data);
                if (data === 'User created successfully') {
                    window.location.href = 'landingpage.html';
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred');
            });
    });
});
