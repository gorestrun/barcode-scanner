const url = "/html/barcode-scanner.html"
fetch(url)
	.then(response => response.text())  
	.then(html => {document.getElementById('barcode-scanner').innerHTML = html;})
	.then(() => setupBarcodeScannerModal())
	.catch((err) => console.log("Can’t access " + url + " response. Error: " + err))
 
function setupBarcodeScannerModal(){
	let barcodeScannerModal = document.getElementById("barcodeScannerModal")
	let barcodeScannerBtn = document.getElementById("barcodeScannerBtn")
	let barcodeCloseModal = document.getElementsByClassName("barcode-scanner-close")[0]
	barcodeScannerBtn.onclick = function() { barcodeScannerModal.style.display = "block"; initScan();} // When the user clicks the button, open the modal
	barcodeCloseModal.onclick = function() { barcodeScannerModal.style.display = "none"; } // When the user clicks on <span> (x), close the modal 
}

function initScan(){    
    let selectedDeviceId
    const barcodeReader = new ZXing.BrowserBarcodeReader()
    console.log('Barcode reader initialized')
    barcodeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const sourceSelect = document.getElementById('barcodeScannerSourceSelect')
            selectedDeviceId = videoInputDevices[0].deviceId
    
            if (videoInputDevices.length > 1) {
                videoInputDevices.forEach((element) => {
                    const sourceOption = document.createElement('option')
                    sourceOption.text = element.label
                    sourceOption.value = element.deviceId
                    
                    sourceSelect.appendChild(sourceOption)
                })

                const sourceSelectPanel = document.getElementById('barcodeScannerSourceSelectPanel')
                sourceSelectPanel.style.display = 'block'
                decodeBarcode(barcodeReader, selectedDeviceId)
            }

			sourceSelect.onchange = () => {
                selectedDeviceId = sourceSelect.value
                decodeBarcode(barcodeReader, selectedDeviceId)
            }	             
        })
        .catch((err) => {
            console.error(err)
        })
}

function decodeBarcode(barcodeReader, selectedDeviceId){
	barcodeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video').then((result) => {
        console.log(result)
        document.getElementById('barcode').textContent = result.text
    }).catch((err) => {
        console.error(err)
        document.getElementById('barcode').textContent = '' //When the user change camera source, an error will be displayed.
    })
    console.log(`Started continuous decode from camera with id ${selectedDeviceId}`)
}