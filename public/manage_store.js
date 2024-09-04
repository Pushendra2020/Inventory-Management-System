








document.getElementById('darkModeToggle').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    // Change text color in dark mode
    document.body.style.color = document.body.classList.contains('dark-mode') ? '#f0f0f0' : '#2d2d2d';
});

// Show notification on page load
// window.onload = function () {
//     const notification = document.getElementById('notification');
//     notification.classList.add('show');
//     setTimeout(() => {
//         notification.classList.remove('show');
//     }, 3000); // Hide after 3 seconds

//     // Hide loading screen after 1 second
//     setTimeout(() => {
//         document.getElementById('loadingScreen').classList.add('hidden');
//     }, 1000);
// };

let scanButton = document.getElementById('scanButton');
scanButton.addEventListener('click', function () {
    document.getElementById('vdo_div').classList.remove('hidden');

    let selectedDeviceId;
    const codeReader = new ZXing.BrowserBarcodeReader();
    let lastScannedCode = null; // Store the last scanned code
    let scanningInProgress = false; // Flag to prevent multiple rapid scans

    console.log('ZXing code reader initialized');
    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const sourceSelect = document.getElementById('sourceSelect');
            console.log('Devices found:', videoInputDevices);

            // Select your laptop's webcam
            const laptopWebcam = videoInputDevices.find(device =>
                device.label.toLowerCase().includes("integrated camera") ||
                device.label.toLowerCase().includes("webcam")
            );
            selectedDeviceId = laptopWebcam ? laptopWebcam.deviceId : videoInputDevices[0]?.deviceId;

            if (!selectedDeviceId) {
                console.error('No webcam found');
                return;
            }

            sourceSelect.onchange = () => {
                selectedDeviceId = sourceSelect.value;
            };

            const sourceSelectPanel = document.getElementById('sourceSelectPanel');
            sourceSelectPanel.style.display = 'block';

            document.getElementById('startButton').addEventListener('click', () => {
                if (!scanningInProgress) {
                    scanningInProgress = true;
                    console.log('Work1');
                    codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video')
                        .then((result) => {
                            if (result.text !== lastScannedCode) {
                                console.log('New barcode detected:', result.text);
                                lastScannedCode = result.text;
                                console.log('Work2');
                                document.getElementById('result').innerHTML = result.text;

                                fetch(`/product?code=${encodeURIComponent(result.text)}`)
                                    .then(response => response.json())
                                    .then(product => {
                                        if (product) {
                                            const table = document.getElementById('productsTable').querySelector('tbody');
                                            const row = document.createElement('tr');
                                            row.classList.add('border-b');
let pname=product.pname;
let ptype=product.ptype;
let price=product.price;
let id=product.id;
                                            row.innerHTML = `
                                                <td class="py-3 px-6">${product.pname}</td>
                                                <td class="py-3 px-6">${product.ptype}</td>
                                                <td class="py-3 px-6">${product.price}</td>
                                                <td class="py-3 px-6">${product.id}</td>
                                            `;
                                            localStorage.setItem('Product name', pname);
                                            localStorage.setItem('Product type', ptype);
                                            localStorage.setItem('Price', price);
                                            localStorage.setItem('Id', id);
                                            table.appendChild(row);
                                        } else {
                                            alert('Product not found');
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error fetching product:', error);
                                    });
                                console.log('Work3');
                            }
                            scanningInProgress = false; // Reset after scan
                        })
                        .catch((err) => {
                            console.error('Scanning error:', err);
                            document.getElementById('result').textContent = 'Error during scanning';
                            scanningInProgress = false; // Reset on error
                        });
                }
            });

            // localStorage.setItem('Product name', pname);
            // localStorage.setItem('Product type', ptype);
            // localStorage.setItem('Price', price);
            // localStorage.setItem('Id', id);

            console.log(`Started continuous decode from camera with id ${selectedDeviceId}`);
        })
        .catch((err) => {
            console.error('Error in getting video input devices:', err);
        });

    document.getElementById('resetButton').addEventListener('click', () => {
        document.getElementById('result').textContent = '';
        lastScannedCode = null;
        codeReader.reset();
        console.log('Reset.');
    });

    setTimeout(function clickfunction() {
        document.getElementById('startButton').click();
    }, 1000);
});

// Barcode form submission
document.getElementById('barcodeForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const barcode = document.getElementById('barcodeInput').value;

    fetch(`/product/${encodeURIComponent(barcode)}`)
        .then(response => response.json())
        .then(product => {
            if (product) {
                const table = document.getElementById('productsTable').querySelector('tbody');
                const row = document.createElement('tr');
                row.classList.add('border-b');

                row.innerHTML = `
                    <td class="py-3 px-6">${product.pname}</td>
                    <td class="py-3 px-6">${product.ptype}</td>
                    <td class="py-3 px-6">${product.price}</td>
                    <td class="py-3 px-6">${product.id}</td>
                `;

                table.appendChild(row);
            } else {
                alert('Product not found');
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });
});
