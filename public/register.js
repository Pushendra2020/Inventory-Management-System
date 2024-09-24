document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    
    
    try {
        const response = await fetch('http://localhost:5501/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.text();

        if (response.ok) {
            alert('Account created successfully!');
            window.location.href = 'login.html'; 
        } else {
            alert('Error: ' + data);
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});
