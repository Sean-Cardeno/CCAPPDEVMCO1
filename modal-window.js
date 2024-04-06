function openAbout() {
    document.getElementById('aboutModal').style.display = 'block';
}

function closeAbout() {
    document.getElementById('aboutModal').style.display = 'none';
}

function openContact() {
    document.getElementById('contactModal').style.display = 'block';
}

function closeContact() {
    document.getElementById('contactModal').style.display = 'none';
}

window.onclick = function (event) {
    let contactModal = document.getElementById('contactModal');
    let aboutModal = document.getElementById('aboutModal');
    if (event.target == contactModal) {
        closeContact();
    } else if (event.target == aboutModal) {
        closeAbout();
    }
}

function handleLogin() {
    //putting login validation here
    const username = document.getElementById('email').value;
    const password = document.getElementById('password').value.trim();

    // Example validation
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }


    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
        .then(response => response.text())
        .then(data => {
            alert(data);
            if (data === 'Login successful') {
                window.location.href = 'main.html';
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred');
        });
}