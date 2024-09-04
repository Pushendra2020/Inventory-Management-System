 // Profile modal handling
 const profileBtn = document.getElementById('profileBtn');
 const profilePage = document.getElementById('profilePage');
 const closeProfile = document.getElementById('closeProfile');

 profileBtn.addEventListener('click', () => {
     profilePage.classList.remove('hidden');
 });

 closeProfile.addEventListener('click', () => {
     profilePage.classList.add('hidden');
 });

 // Signup modal handling
 const signupBtn = document.getElementById('signupBtn');
 const signupModal = document.getElementById('signupModal');

 signupBtn.addEventListener('click', () => {
     signupModal.classList.remove('hidden');
 });

 // Login modal handling
 const loginBtn = document.getElementById('loginBtn');
 const loginModal = document.getElementById('loginModal');

 loginBtn.addEventListener('click', () => {
     loginModal.classList.remove('hidden');
 });