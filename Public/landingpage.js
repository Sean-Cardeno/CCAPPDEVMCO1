document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Redirect to the logged-in user's homepage or dashboard
                    window.location.href = '/main';
                } else {
                    // Display error message
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
