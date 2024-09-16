// document.addEventListener("DOMContentLoaded", function() {
//     if (localStorage.getItem('loggedIn') === 'true') {
//         // Perform your actions here
//         console.log("User has logged in. Performing actions...");
//     }
// })




// document.getElementById('loginForm').addEventListener('submit', (e) => {
//     e.preventDefault(); // Prevent form from submitting
//     const email = document.getElementById('loginEmail').value;
//     const password = document.getElementById('loginPassword').value;

//     // Implement your login logic here
//     console.log('Login details:', { email, password });

//     // Close the modal
//     loginModal.classList.add('hidden');
// });

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5500/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            // Redirect to the specified URL
            window.location.href = result.redirectUrl;
        } else {
            // Handle login failure
            alert(result.error || 'Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
    // document.addEventListener("DOMContentLoaded", function() {
    //     // Perform your actions here
    //     console.log("Form has been submitted. Performing actions...");
    //     document.getElementById('welcomeMessage').innerText = "Welcome, User!";
    // });
