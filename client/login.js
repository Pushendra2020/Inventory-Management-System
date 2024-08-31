// document.addEventListener("DOMContentLoaded", function() {
//     if (localStorage.getItem('loggedIn') === 'true') {
//         // Perform your actions here
//         console.log("User has logged in. Performing actions...");
//     }
// })




document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form from submitting
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Implement your login logic here
    console.log('Login details:', { email, password });

    // Close the modal
    loginModal.classList.add('hidden');
});



    // document.addEventListener("DOMContentLoaded", function() {
    //     // Perform your actions here
    //     console.log("Form has been submitted. Performing actions...");
    //     document.getElementById('welcomeMessage').innerText = "Welcome, User!";
    // });