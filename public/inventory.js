// Toggle dark mode
document.getElementById('darkModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    // Change text color in dark mode
    document.body.style.color = document.body.classList.contains('dark-mode') ? '#f0f0f0' : '#2d2d2d';
});

// Show notification on page load
window.onload = function () {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000); // Hide after 3 seconds

    // Hide loading screen after 1 second
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
    }, 1000);
};

// Get elements
const openPopupBtn = document.getElementById('openPopupBtn');
const popupContainer = document.getElementById('popupContainer');
const closePopupBtn = document.getElementById('closePopupBtn');

// Open popup
openPopupBtn.addEventListener('click', () => {
    popupContainer.classList.remove('hidden');
});
bntsell.addEventListener('click', () => {
    popupContainer.classList.remove('hidden');
});

// Optionally, close the popup when clicking outside the popup content
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
                     // Stop the camera after scanning
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


document.addEventListener('DOMContentLoaded', function () {
    console.log("work");
    fetch('/storeproduct')
        .then(response => response.json())
        .then(product => {
            product.forEach(product => {
                // Display each product
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
                // table.insertBefore(row, table.firstChild);  // Insert each row at the top
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

                        fetch(`/sellproduct`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
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
