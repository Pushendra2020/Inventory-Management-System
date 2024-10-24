

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
                let lef;
                let ex_date;

                if(product.lef == -1){
                    lef="Expired";
                    row.innerHTML =`
                    <td class="py-3 px-6">${product.pname}</td>
                    <td class="py-3 px-6">${product.ptype}</td>
                    <td class="py-3 px-6">${product.price}</td>
                    <td class="py-3 px-6">${product.id}</td>
                    <td class="py-3 px-6">${product.qunti}</td>
                    <td class="py-3 px-6">${product.ex_date}</td>
                    <td class="py-3 px-6">${lef}</td>`
                }else if(product.lef == -2){
                    lef="No have expiry date";
                    ex_date="No date";
                    row.innerHTML =`
                    <td class="py-3 px-6">${product.pname}</td>
                    <td class="py-3 px-6">${product.ptype}</td>
                    <td class="py-3 px-6">${product.price}</td>
                    <td class="py-3 px-6">${product.id}</td>
                    <td class="py-3 px-6">${product.qunti}</td>
                    <td class="py-3 px-6">${ex_date}</td>
                    <td class="py-3 px-6">${lef}</td>`
                }

else{
                row.innerHTML = `
            <td class="py-3 px-6">${product.pname}</td>
            <td class="py-3 px-6">${product.ptype}</td>
            <td class="py-3 px-6">${product.price}</td>
            <td class="py-3 px-6">${product.id}</td>
            <td class="py-3 px-6">${product.qunti}</td>
            <td class="py-3 px-6">${product.ex_date}</td>
            <td class="py-3 px-6">${product.lef}</td>
        `;
        
}
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


    
  