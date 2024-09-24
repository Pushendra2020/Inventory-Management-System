

let username = localStorage.getItem('username');

document.addEventListener('DOMContentLoaded', function () {
    console.log("work");
    console.log("work");
    fetch(`/sellproduct?username=${username}`)
        .then(response => response.json())
        .then(product => {
            let totalQunti = 0; 
            let totalPrice = 0;
            product.forEach(product => {
                totalQunti = product.qunti + totalQunti;
                totalPrice =totalPrice +( product.price * product.qunti);
                localStorage.setItem( "totalQunti" ,totalQunti);
                localStorage.setItem( "totalPrice" ,totalPrice);
                const table = document.getElementById('tablebody').querySelector('tbody');
                const row = document.createElement('tr');
                row.classList.add('border-b');
                row.innerHTML = `
            <td class="py-3 px-6">${product.pname}</td>
            <td class="py-3 px-6">${product.ptype}</td>
            <td class="py-3 px-6">${product.price}</td>
            <td class="py-3 px-6">${product.id}</td>
            <td class="py-3 px-6">${product.qunti}</td>
        `;
        
        
                table.appendChild(row);
            });
            const totalQuntiDisplay = document.getElementById('totalQunti');
            totalQuntiDisplay.textContent = `${totalQunti}`;
            const totalPriceDisplay = document.getElementById('totalPrice');
            totalPriceDisplay.textContent = `${totalPrice} Rs`;
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });  
     });


    
  
