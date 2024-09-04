// let bnt=document.getElementById('bnt');


document.addEventListener('DOMContentLoaded', function () {
    console.log("work");
    console.log("work");
    fetch('/sellproduct')
        .then(response => response.json())
        .then(product => {
            product.forEach(product => {
                // Display each product
                const table = document.getElementById('tablebody').querySelector('tbody');
                const row = document.createElement('tr');
                row.classList.add('border-b');
                row.innerHTML = `
            <td class="py-3 px-6">${product.pname}</td>
            <td class="py-3 px-6">${product.ptype}</td>
            <td class="py-3 px-6">${product.price}</td>
            <td class="py-3 px-6">${product.id}</td>
        `;
                // table.insertBefore(row, table.firstChild);  // Insert each row at the top
                table.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

    });