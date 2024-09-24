
document.getElementById('darkModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');

    document.body.style.color = document.body.classList.contains('dark-mode') ? '#f0f0f0' : '#2d2d2d';
});
let username = localStorage.getItem('username');
console.log(localStorage.getItem('username'));


const openPopupBtn = document.getElementById('openPopupBtn');
const popupContainer = document.getElementById('popupContainer');
const closePopupBtn = document.getElementById('closePopupBtn');


openPopupBtn.addEventListener('click', () => {
    popupContainer.classList.remove('hidden');
});
bntsell.addEventListener('click', () => {
    popupContainer.classList.remove('hidden');
});


window.addEventListener('click', (event) => {
    if (event.target === popupContainer) {
        popupContainer.classList.add('hidden');
    }
});

let scanButton = document.getElementById('openPopupBtn');
scanButton.addEventListener('click', function () {
    document.getElementById('vdo_div').classList.remove('hidden');

    let selectedDeviceId;
    const codeReader = new ZXing.BrowserBarcodeReader();
    let lastScannedCode = null;

    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const laptopWebcam = videoInputDevices.find(device =>
                device.label.toLowerCase().includes("integrated camera") ||
                device.label.toLowerCase().includes("webcam")
            );
            selectedDeviceId = laptopWebcam ? laptopWebcam.deviceId : videoInputDevices[0]?.deviceId;

            if (!selectedDeviceId) {
                console.error('No webcam found');
                return;
            }

            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video')
                .then((result) => {
                    if (result.text !== lastScannedCode) {
                        lastScannedCode = result.text;
                        document.getElementById('result').innerHTML = "Product inserted";

                        console.log(result.text);
                        fetch(`/product?code=${encodeURIComponent(result.text)}`)
                            .then(response => response.json())
                            .then(product => {

                                if (product && product.pname && product.ptype && product.price) { // Check if product is valid


                                    console.log(result.text);
                                    const table = document.getElementById('inventoryTable').querySelector('tbody');
                                    const row = document.createElement('tr');
                                    row.classList.add('border-b');
                                    let pname = product.pname;
                                    let ptype = product.ptype;
                                    let price = product.price;
                                    let id = product.id;
                                    let qunti = product.qunti;
                                    qunti = qunti + 1;

                                    row.innerHTML = `
                                    <td class="py-3 px-6">${product.pname}</td>
                                        <td class="py-3 px-6">${product.ptype}</td>
                                        <td class="py-3 px-6">${product.price}</td>
                                        <td class="py-3 px-6">${product.id}</td>
                                        <td class="py-3 px-6">${qunti}</td>
                                    `;
                                    table.appendChild(row);

                                    fetch('/storeproduct', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            username: username,
                                            id: id,
                                            pname: pname,
                                            ptype: ptype,
                                            price: price,
                                            qunti: qunti
                                        })
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            console.log('Product saved:', data);
                                        })
                                        .catch(error => {
                                            console.error('Error saving product:', error);
                                        });
                                } else {
                                    document.getElementById('result').textContent = 'Product not found in the database';
                                    console.error('Product not found in the database');
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching product:', error);
                            });
                    } codeReader.reset();
                    function autoRefresh() {
                        window.location = window.location.href;
                    }
                    setInterval('autoRefresh()', 5000);
                    autoRefresh();

                })
                .catch((err) => {
                    console.error('Scanning error:', err);
                    document.getElementById('result').textContent = 'Error during scanning';
                });
        })
        .catch((err) => {
            console.error('Error in getting video input devices:', err);
        });

    document.getElementById('resetButton').addEventListener('click', () => {
        document.getElementById('result').textContent = '';
        lastScannedCode = null;
        codeReader.reset();
    });

    closePopupBtn.addEventListener('click', () => {
        document.getElementById('result').textContent = '';
        lastScannedCode = null;
        codeReader.reset();
        popupContainer.classList.add('hidden');
    });
});


scanButton.addEventListener('click', function () {
    document.getElementById('vdo_div').classList.remove('hidden');

    let selectedDeviceId;
    const codeReader = new ZXing.BrowserBarcodeReader();
    let lastScannedCode = null;


    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const selectDeviceDropdown = document.getElementById('deviceSelect'); 

            selectDeviceDropdown.innerHTML = '';

            videoInputDevices.forEach((device) => {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Camera ${selectDeviceDropdown.length + 1}`;
                selectDeviceDropdown.appendChild(option);
            });

            const laptopWebcam = videoInputDevices.find(device =>
                device.label.toLowerCase().includes("integrated camera") ||
                device.label.toLowerCase().includes("webcam")
            );
            selectedDeviceId = laptopWebcam ? laptopWebcam.deviceId : videoInputDevices[0]?.deviceId;
            selectDeviceDropdown.value = selectedDeviceId;

            selectDeviceDropdown.addEventListener('change', (event) => {
                selectedDeviceId = event.target.value;
                codeReader.reset();
                startScanning(selectedDeviceId);
            });

            startScanning(selectedDeviceId);
        })
        .catch((err) => {
            console.error('Error in getting video input devices:', err);
        });

    function startScanning(deviceId) {
        codeReader.decodeOnceFromVideoDevice(deviceId, 'video')
            .then((result) => {
                if (result.text !== lastScannedCode) {
                    lastScannedCode = result.text;
                    document.getElementById('result').innerHTML = "Product inserted";
                    console.log(result.text);

                    fetch(`/product?code=${encodeURIComponent(result.text)}`)
                        .then(response => response.json())
                        .then(product => {
                            if (product && product.pname && product.ptype && product.price) {
                                const table = document.getElementById('inventoryTable').querySelector('tbody');
                                const row = document.createElement('tr');
                                row.classList.add('border-b');
                                let pname = product.pname;
                                let ptype = product.ptype;
                                let price = product.price;
                                let id = product.id;
                                let qunti = product.qunti;
                                qunti = qunti + 1;

                                row.innerHTML = `
                                    <td class="py-3 px-6">${pname}</td>
                                    <td class="py-3 px-6">${ptype}</td>
                                    <td class="py-3 px-6">${price}</td>
                                    <td class="py-3 px-6">${id}</td>
                                    <td class="py-3 px-6">${qunti}</td>
                                `;
                                table.appendChild(row);

                                fetch('/storeproduct', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        username: username,
                                        id: id,
                                        pname: pname,
                                        ptype: ptype,
                                        price: price,
                                        qunti: qunti
                                    })
                                })
                                .then(response => response.json())
                                .then(data => {
                                    console.log('Product saved:', data);
                                })
                                .catch(error => {
                                    console.error('Error saving product:', error);
                                });
                            } else {
                                document.getElementById('result').textContent = 'Product not found in the database';
                                console.error('Product not found in the database');
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching product:', error);
                        });
                }
                codeReader.reset();

                function autoRefresh() {
                    window.location = window.location.href;
                }
                setInterval(autoRefresh, 5000);
                autoRefresh();
            })
            .catch((err) => {
                console.error('Scanning error:', err);
                document.getElementById('result').textContent = 'Error during scanning';
            });
    }

    document.getElementById('resetButton').addEventListener('click', () => {
        document.getElementById('result').textContent = '';
        lastScannedCode = null;
        codeReader.reset();
    });

    closePopupBtn.addEventListener('click', () => {
        document.getElementById('result').textContent = '';
        lastScannedCode = null;
        codeReader.reset();
        popupContainer.classList.add('hidden');
    });
});



document.addEventListener('DOMContentLoaded', function () {
    console.log("work");
    fetch(`/storeproduct?username=${username}`)
        .then(response => response.json())
        .then(product => {
            username = username;
            let Qunti = 0;
            product.forEach(product => {
                Qunti = product.qunti + Qunti;
                localStorage.setItem('Qunti', Qunti);
                console.log(Qunti);
                const table = document.getElementById('inventoryTable').querySelector('tbody');
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
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });

});




bntsell.addEventListener('click', function () {
    let vdo_div = document.getElementById('vdo_div');
    vdo_div.classList.remove('hidden');
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserBarcodeReader();
    let lastScannedCode = null;

    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const laptopWebcam = videoInputDevices.find(device =>
                device.label.toLowerCase().includes("integrated camera") ||
                device.label.toLowerCase().includes("webcam")
            );
            selectedDeviceId = laptopWebcam ? laptopWebcam.deviceId : videoInputDevices[0]?.deviceId;

            if (!selectedDeviceId) {
                console.error('No webcam found');
                return;
            }

            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video')
                .then((result) => {
                    if (result.text !== lastScannedCode) {
                        lastScannedCode = result.text;
                        document.getElementById('result').innerHTML = "Product inserted";
                        console.log(result.text);

                        fetch(`/sellproduct?username=${username}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                username: username,
                                id: result.text
                            })
                        })
                            .then(response => response.json())
                            .then(data => {
                                if (data.success) {
                                    console.log('Product moved to sellproduct:', data);
                                } else {
                                    console.error('Error:', data.message);
                                }
                            })
                            .catch(error => {
                                console.error('Error saving product:', error);
                            });
                    }
                    codeReader.reset();
                    function autoRefresh() {
                        window.location = window.location.href;
                    }
                    setInterval('autoRefresh()', 5000);
                    autoRefresh();
                })
                .catch((err) => {
                    console.error('Scanning error:', err);
                    document.getElementById('result').textContent = 'Error during scanning';
                });
        })
        .catch((err) => {
            console.error('Error in getting video input devices:', err);
        });

    document.getElementById('resetButton').addEventListener('click', () => {
        document.getElementById('result').textContent = '';
        lastScannedCode = null;
        codeReader.reset();
    });

    closePopupBtn.addEventListener('click', () => {
        document.getElementById('result').textContent = '';
        lastScannedCode = null;
        codeReader.reset();
        popupContainer.classList.add('hidden');
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const main = document.getElementById('main');
    searchButton.addEventListener('click', () => {
        main.classList.remove('hidden');
        const query = searchInput.value.trim();
        if (query) {
            fetch(`/user?name=${query}`, {
                method: 'GET'
            })
                .then(response => response.json())
                .then(data => {
                    const tbody = document.querySelector('#foodTable tbody');
                    tbody.innerHTML = '';
                    data.forEach(item => {
                        const row = document.createElement('tr');

                        const idCell = document.createElement('td');
                        idCell.textContent = item.pname;
                        row.appendChild(idCell);

                        const nameCell = document.createElement('td');
                        nameCell.textContent = item.ptype;
                        row.appendChild(nameCell);

                        const caloriesCell = document.createElement('td');
                        caloriesCell.textContent = item.price;
                        row.appendChild(caloriesCell);

                        const proteinCell = document.createElement('td');
                        proteinCell.textContent = item.id;
                        row.appendChild(proteinCell);

                        const carbsCell = document.createElement('td');
                        carbsCell.textContent = item.qunti;
                        row.appendChild(carbsCell);

                        tbody.appendChild(row);
                    });
                })
                .catch(error => console.error('Error fetching data:', error));
        }
    });
});
