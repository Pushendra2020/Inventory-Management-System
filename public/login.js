document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    localStorage.setItem('email',email);
    try {
        const response = await fetch('http://localhost:5501/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('username', result.username);
            
            window.location.href = result.redirectUrl;
        } else {
            alert(result.error || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
