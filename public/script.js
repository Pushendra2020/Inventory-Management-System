





window.addEventListener('load', function () {
    let selectedDeviceId;
    const codeReader = new ZXing.BrowserBarcodeReader();
    let lastScannedCode = null; // Store the last scanned code
    let scanningInProgress = false; // Flag to prevent multiple rapid scans

    console.log('ZXing code reader initialized');
    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const sourceSelect = document.getElementById('sourceSelect');
            
            // Select your laptop's webcam
            const laptopWebcam = videoInputDevices.find(device => device.label.toLowerCase().includes("integrated camera") || device.label.toLowerCase().includes("webcam"));
            selectedDeviceId = laptopWebcam ? laptopWebcam.deviceId : videoInputDevices[0].deviceId;
            
            videoInputDevices.forEach((element) => {
                const sourceOption = document.createElement('option');
                sourceOption.text = element.label;
                sourceOption.value = element.deviceId;
                sourceSelect.appendChild(sourceOption);
            });

            sourceSelect.onchange = () => {
                selectedDeviceId = sourceSelect.value;
            };

            const sourceSelectPanel = document.getElementById('sourceSelectPanel');
            sourceSelectPanel.style.display = 'block';

            document.getElementById('startButton').addEventListener('click', () => {
                if (!scanningInProgress) {
                    scanningInProgress = true; 
            
                    codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video').then((result) => {
                        if (result.text !== lastScannedCode) {
                            console.log('New barcode detected:', result.text);
                            lastScannedCode = result.text; 
                            document.getElementById('result').innerHTML = result.text;                                       
                            $.ajax({
                                url: 'http://localhost:5500/scan',
                                type: 'POST',
                                data: JSON.stringify({ code: result.text }),
                                contentType: 'application/json',
                                success: function(response) {                             
                                    document.getElementById('video').innerHTML = 
                                        "Product Code: " + response.id + "<br>" +
                                        "Product Name: " + response.pname + "<br>" +
                                        "Product Type: " + response.ptype + "<br>" +
                                        "Price: " + response.price + "<br>";
                                },
                                error: function(xhr, status, error) {
                                    document.getElementById('result').innerHTML = 'No results found for the scanned code.';
                                    console.error('Error:', error);
                                }
                            });
                        }
                        scanningInProgress = false; 
                    }).catch((err) => {
                        console.error(err);
                        document.getElementById('result').textContent = err;
                        scanningInProgress = false; // Reset the flag
                    });
            
                    console.log(`Started continuous decode from camera with id ${selectedDeviceId}`);
                }
            });
            

          

            document.getElementById('resetButton').addEventListener('click', () => {
                document.getElementById('result').textContent = 'hii';
                lastScannedCode = null; 
                codeReader.reset();
                console.log('Reset.');

            });

            setTimeout(function clickfunction() {
                document.getElementById('startButton').click();
            }, 1000);
            // clickfunction();
        })
        .catch((err) => {
            console.error(err);
        });
});
