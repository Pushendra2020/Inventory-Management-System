 window.onload = function () {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 1500); 
}

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


 document.querySelector('a[href="#"]').addEventListener('click', () => {
     profilePage.classList.toggle('hidden');
     profilePage.classList.toggle('opacity-0');
 });

 closeProfileButton.addEventListener('click', () => {
     profilePage.classList.add('hidden');
     profilePage.classList.add('opacity-0');
 });

 let username = localStorage.getItem('username');
 let email = localStorage.getItem('email');
 let totalPrice = localStorage.getItem('totalPrice');
 let totalQunti = localStorage.getItem('totalQunti');
 let Qunti = localStorage.getItem('Qunti');

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("userin").innerHTML = `${username}`;
    document.getElementById("userin1").innerHTML = `${username}`;
    document.getElementById("userin2").innerHTML = `${username}`;
    document.getElementById("usere").innerHTML = `${email}`;
    document.getElementById("usere1").innerHTML = `${email}`;
    
    document.getElementById("totalPrice").innerHTML = `${totalPrice} Rs`;
    document.getElementById("Qunti").innerHTML = `${Qunti}`;    
    document.getElementById("totalQunti").innerHTML = `${totalQunti}`;    
});
