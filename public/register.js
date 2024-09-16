document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5500/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.text();

        if (response.ok) {
            alert('Account created successfully!');
            window.location.href = 'login.html'; // Redirect to login page
        } else {
            alert('Error: ' + data);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});