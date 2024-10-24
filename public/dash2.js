/*notification*/
window.onload = function () {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 1500);
}

/* event listeners */
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

/*  product qauntity logic */ 
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





document.addEventListener('DOMContentLoaded', function () {
    console.log("work");
    fetch(`/storeproduct?username=${username}`)
        .then(response => response.json())
        .then(product => {
        
            const topProduct = product[product.length - 1];

            if (topProduct) {
                const table = document.getElementById('inventoryTable').querySelector('tbody');
                const row = document.createElement('tr');
                row.classList.add('border-b');

                let lef;
                let ex_date;
                if (topProduct.lef == -1) {
                    lef = "Expired";
                    row.innerHTML = `
                    <td class="py-3 px-6">${topProduct.pname}</td>
                    <td class="py-3 px-6">${topProduct.ptype}</td>
                    <td class="py-3 px-6">${topProduct.price}</td>
                    <td class="py-3 px-6">${topProduct.id}</td>
                
                    <td class="py-3 px-6">${topProduct.ex_date}</td>
                    <td class="py-3 px-6">${lef}</td>
                    <td class="py-3 px-6">Stored</td>
                `;
                } else if (topProduct.lef == -2) {
                    lef = "No have expiry date";
                    ex_date = "No date"
                    row.innerHTML = `
                    <td class="py-3 px-6">${topProduct.pname}</td>
                    <td class="py-3 px-6">${topProduct.ptype}</td>
                    <td class="py-3 px-6">${topProduct.price}</td>
                    <td class="py-3 px-6">${topProduct.id}</td>
                    
                    <td class="py-3 px-6">${ex_date}</td>
                    <td class="py-3 px-6">${lef}</td>
                    <td class="py-3 px-6">Stored</td>
                `;
                } else {
                    row.innerHTML = `
                    <td class="py-3 px-6">${topProduct.pname}</td>
                    <td class="py-3 px-6">${topProduct.ptype}</td>
                    <td class="py-3 px-6">${topProduct.price}</td>
                    <td class="py-3 px-6">${topProduct.id}</td>
                    
                    <td class="py-3 px-6">${topProduct.ex_date}</td>
                    <td class="py-3 px-6">${topProduct.lef}</td>
                    <td class="py-3 px-6">Stored</td>
                `;
                }
               
                table.appendChild(row);
            } else {
                console.error("No products found");
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});


document.addEventListener('DOMContentLoaded', function () {
    console.log("work");
    fetch(`/sellproduct?username=${username}`)
        .then(response => response.json())
        .then(product => {
          
            const topProduct = product[product.length - 1];
            if (topProduct) {
               
                const table = document.getElementById('inventoryTable').querySelector('tbody');
                const row = document.createElement('tr');
                row.classList.add('border-b');          
                let lef;
                let ex_date;
                if (topProduct.lef == -1) {
                    lef = "Expired";
                    row.innerHTML = `
                    <td class="py-3 px-6">${topProduct.pname}</td>
                    <td class="py-3 px-6">${topProduct.ptype}</td>
                    <td class="py-3 px-6">${topProduct.price}</td>
                    <td class="py-3 px-6">${topProduct.id}</td>
                   
                    <td class="py-3 px-6">${topProduct.ex_date}</td>
                    <td class="py-3 px-6">${lef}</td>
                    <td class="py-3 px-6">Sell</td>
                `;
                } else if (topProduct.lef == -2) {
                    lef = "No have expiry date";
                    ex_date = "No Date"
                    row.innerHTML = `
                    <td class="py-3 px-6">${topProduct.pname}</td>
                    <td class="py-3 px-6">${topProduct.ptype}</td>
                    <td class="py-3 px-6">${topProduct.price}</td>
                    <td class="py-3 px-6">${topProduct.id}</td>
                    
                    <td class="py-3 px-6">${ex_date}</td>
                    <td class="py-3 px-6">${lef}</td>
                    <td class="py-3 px-6">Sell</td>
                `;
                } else {
                    row.innerHTML = `
                    <td class="py-3 px-6">${topProduct.pname}</td>
                    <td class="py-3 px-6">${topProduct.ptype}</td>
                    <td class="py-3 px-6">${topProduct.price}</td>
                    <td class="py-3 px-6">${topProduct.id}</td>
                   
                    <td class="py-3 px-6">${topProduct.ex_date}</td>
                    <td class="py-3 px-6">${topProduct.lef}</td>
                    <td class="py-3 px-6">Sell</td>
                `;
                }
              
                table.appendChild(row);


            } else {
                console.error("No products found");
            }
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
});


/* chart */
document.addEventListener('DOMContentLoaded', function () {
    fetch(`/productQuantities?username=${username}`)
        .then(response => response.json())
        .then(productQuantities => {
            
            const labels = productQuantities.map(p => p.ptype);
            const data = productQuantities.map(p => p.total_quantity);

            const ctx = document.getElementById('myChart').getContext('2d');
            let myChart; 
            
           
            function createChart(chartType) {
                if (myChart) {
                    myChart.destroy(); 
                }
                myChart = new Chart(ctx, {
                    type: chartType,
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Quantity by Product Type',
                            data: data,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }

         
            createChart('pie');
            document.getElementById('barid').addEventListener('click', function () {
                createChart('bar');
            });
            document.getElementById('pieid').addEventListener('click', function () {
                createChart('pie');
            });
            document.getElementById('lineid').addEventListener('click', function () {
                createChart('line');
            });
            document.getElementById('doughnutid').addEventListener('click', function () {
                createChart('doughnut');
            });
        })
        .catch(error => {
            console.error('Error fetching product quantities:', error);
        });
});



document.addEventListener('DOMContentLoaded', function () {
    fetch(`/productQuantities1?username=${username}`)
        .then(response => response.json())
        .then(productQuantities => {
           
            const labels = productQuantities.map(p => p.ptype);
            const data = productQuantities.map(p => p.total_quantity);

            const ctx = document.getElementById('myChart1').getContext('2d');
            let myChart;
            
         
            function createChart(chartType) {
                if (myChart) {
                    myChart.destroy();
                }
                myChart = new Chart(ctx, {
                    type: chartType,
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Quantity by Product Type',
                            data: data,
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
            createChart('pie');
            document.getElementById('barid').addEventListener('click', function () {
                createChart('bar');
            });
            document.getElementById('pieid').addEventListener('click', function () {
                createChart('pie');
            });
            document.getElementById('lineid').addEventListener('click', function () {
                createChart('line');
            });
            document.getElementById('doughnutid').addEventListener('click', function () {
                createChart('doughnut');
            });
        })
        .catch(error => {
            console.error('Error fetching product quantities:', error);
        });
});
