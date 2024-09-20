 // Show notification on page load
window.onload = function () {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000); // Hide after 3 seconds
}

 // Profile modal handling
 const profileBtn = document.getElementById('profileBtn');
 const profilePage = document.getElementById('profilePage');
 const closeProfile = document.getElementById('closeProfile');
 const closeProfileButton = document.getElementById('closeProfile');

 profileBtn.addEventListener('click', () => {
     profilePage.classList.remove('hidden');
 });

 closeProfile.addEventListener('click', () => {
     profilePage.classList.add('hidden');
 });

//  // Signup modal handling
//  const signupBtn = document.getElementById('signupBtn');
//  const signupModal = document.getElementById('signupModal');

//  signupBtn.addEventListener('click', () => {
//      signupModal.classList.remove('hidden');
//  });

//  // Login modal handling
//  const loginBtn = document.getElementById('loginBtn');
//  const loginModal = document.getElementById('loginModal');

//  loginBtn.addEventListener('click', () => {
//      loginModal.classList.remove('hidden');
//  });

       



 // Toggle profile modal
 document.querySelector('a[href="#"]').addEventListener('click', () => {
     profilePage.classList.toggle('hidden');
     profilePage.classList.toggle('opacity-0');
 });

 // Close profile modal
 closeProfileButton.addEventListener('click', () => {
     profilePage.classList.add('hidden');
     profilePage.classList.add('opacity-0');
 });

//  // Toggle sign up modal
//  document.querySelector('.bg-green-600').addEventListener('click', () => {
//      signupModal.classList.toggle('hidden');
//      signupModal.classList.toggle('opacity-0');
//  });

//  // Toggle login modal
//  document.querySelector('.bg-yellow-600').addEventListener('click', () => {
//      loginModal.classList.toggle('hidden');
//      loginModal.classList.toggle('opacity-0');
//  });

// -----------

//  document.addEventListener('DOMContentLoaded', () => {
//     const userId = sessionStorage.getItem('userId'); // or localStorage.getItem('userId')

//     if (userId) {
//         fetch(`/user-data/${userId}`)
//             .then(response => response.json())
//             .then(data => {
//                 displayUserData(data);
//             })
//             .catch(error => console.error('Error fetching user data:', error));
//     } else {
//         document.getElementById('dashboard-content').innerHTML = 'User not logged in.';
//     }
// });

// function displayUserData(data) {
//     const contentDiv = document.getElementById('dashboard-content');
//     contentDiv.innerHTML = `
//         <h1 class="text-2xl font-bold">Welcome, ${data.name}</h1>
//         <p class="mt-4">Here’s your personalized data:</p>
//         <ul class="mt-2">
//             ${data.items.map(item => `<li>${item}</li>`).join('')}
//         </ul>
//     `;
// }
