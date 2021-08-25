//Does not work well with decorators, sitemesh, ...
const url = "/html/barcode-scanner.html";
fetch(url)
	.then(response => response.text())  
	.then(html => {document.getElementById('barcode-scanner').innerHTML = html;})
	.then(() => {
		document.getElementById("barcodeScannerBtn").onclick = function() { 
			document.getElementById("barcodeScannerModal").style.display = "block";
		};
	
		document.getElementsByClassName("barcode-scanner-close")[0].onclick = function() { 
			barcodeScannerModal.style.display = "none"; 
		};
	 })
	.catch((err) => console.log("Can’t access " + url + " response. Error: " + err));

window.addEventListener('load', function(){
    let selectedDeviceId;
    const barcodeReader = new ZXing.BrowserBarcodeReader();
    console.log('Window loaded, barcode reader initialized');
    barcodeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const sourceSelect = document.getElementById('barcodeScannerSourceSelect');
            selectedDeviceId = videoInputDevices[0].deviceId;

            if (videoInputDevices.length > 1) {
                const sourceOption = document.createElement('option');
                sourceOption.text = "Select an option:";
                sourceOption.value = "";
                sourceOption.selected = true;
                sourceOption.disabled = true;
                sourceSelect.appendChild(sourceOption);

                videoInputDevices.forEach((element) => {
                    const sourceOption = document.createElement('option');
                    sourceOption.text = element.label;
                    sourceOption.value = element.deviceId;

                    sourceSelect.appendChild(sourceOption);
                })
				
		    sourceSelect.onchange = () => {
                	selectedDeviceId = sourceSelect.value;
                    if(selectedDeviceId !== ""){
                        decode(barcodeReader, selectedDeviceId);
                    }
            	}	        
            
                const sourceSelectPanel = document.getElementById('barcodeScannerSourceSelectPanel');
                sourceSelectPanel.style.display = 'block';
            }

            document.getElementById('barcodeScannerBtn').addEventListener('click', () => {
                decode(barcodeReader, undefined); //undefined will force the camera to point to the back camera(environment facing)
			})
        })
        .catch((err) => {
            console.error(err);
        })
})

function decode(barcodeReader, selectedDeviceId){

	barcodeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video').then((result) => {
        console.log("Decoded value:" + result);
        document.getElementById('barcode').textContent = result.text;
    }).catch((err) => {
        console.error(err);
        document.getElementById('barcode').textContent = ''; //When the user change camera source, an error will be displayed. We do not want this.
    })
    console.log(`Started continuous decode from camera with id ${selectedDeviceId}`)
}
