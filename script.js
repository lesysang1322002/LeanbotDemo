var bleService = '0000ffe0-0000-1000-8000-00805f9b34fb';
var bleCharacteristic = '0000ffe1-0000-1000-8000-00805f9b34fb';
var gattCharacteristic;
var bluetoothDeviceDetected;
function isWebBluetoothEnabled() {
    if (!navigator.bluetooth) {
    console.log('Web Bluetooth API is not available in this browser!');
    // log('Web Bluetooth API is not available in this browser!');
    return false
    }

    return true
}
const button = document.getElementById("toggleButton");
function toggleFunction() {

    if (button.innerText == "Scan") {
        requestBluetoothDevice();
    } else {
        document.getElementById("buttonText").innerText = "Scan";
        disconnect();
        requestBluetoothDevice();
    }
}
function requestBluetoothDevice() {
    if(isWebBluetoothEnabled){
logstatus('Finding...');
navigator.bluetooth.requestDevice({
    filters: [{
        services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }] 
    })         
.then(device => {
    dev=device;
    logstatus("Connect to " + dev.name);
    console.log('Đang kết nối với', dev);
    return device.gatt.connect();
})
.then(server => {
        console.log('Getting GATT Service...');
        logstatus('Getting Service...');
        return server.getPrimaryService(bleService);
    })
    .then(service => {
        console.log('Getting GATT Characteristic...');
        logstatus('Geting Characteristic...');
        return service.getCharacteristic(bleCharacteristic);
    })
    .then(characteristic => {
        logstatus(dev.name);
        document.getElementById("buttonText").innerText = "Rescan";
    gattCharacteristic = characteristic
    gattCharacteristic.addEventListener('characteristicvaluechanged', handleChangedValue)
    return gattCharacteristic.startNotifications()
})
.catch(error => {
    if (error instanceof DOMException && error.name === 'NotFoundError' && error.message === 'User cancelled the requestDevice() chooser.') {
    console.log("Người dùng đã hủy yêu cầu kết nối thiết bị.");
    logstatus("Scan to connect");
    } else {
    console.log("Không thể kết nối với thiết bị: " + error);
    logstatus("ERROR");
    }
    });
}}
function disconnect()
{
    logstatus("Scan to connect");
    console.log("Đã ngắt kết nối với: " + dev.name);
    return dev.gatt.disconnect();
}
function send(data)
{
    console.log("You -> " + data + "\n");
    gattCharacteristic.writeValue(str2ab(data+"\n"));
}
function str2ab(str)
{
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, l = str.length; i < l; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}
function  logstatus(text){
const navbarTitle = document.getElementById('navbarTitle');
navbarTitle.textContent = text;
}
document.addEventListener('DOMContentLoaded', function () {
    var infoButton = document.getElementById('infoButton');
    var infoContent = document.getElementById('infoContent');
  
    infoButton.addEventListener('click', function (event) {
        event.stopPropagation(); // Ngăn chặn sự kiện click lan sang các phần tử cha
        if (infoContent.style.display === 'block') {
            infoContent.style.display = 'none';
        } else {
            infoContent.style.display = 'block';
        }
    });
  
    document.addEventListener('click', function () {
        infoContent.style.display = 'none';
    });
});

let ir2L,ir0L,ỉr1R,ir3R,distance;
const slider = document.getElementById('distanceSlider');
const distanceValue = document.getElementById('distanceValue');
function handleChangedValue(event) {
    let data = event.target.value;
    let dataArray = new Uint8Array(data.buffer);
    let textDecoder = new TextDecoder('utf-8');
    let valueString = textDecoder.decode(dataArray);
    let tabIndex = valueString.indexOf('\t');
    let spaceIndex = valueString.indexOf(' ');
    ir2L=valueString[0];
    ir0L=valueString[1];
    ir1R=valueString[2];
    ir3R=valueString[3];
    distance=valueString.substring(tabIndex+1,spaceIndex);
    console.log("Ir: " + ir2L+ir0L+ir1R+ir3R);
    console.log("Distance: "+ distance);
    console.log('Convert2Str:',valueString);
    if (ir2L === '0') {
        document.getElementById('ir2L').classList.remove('black');
        document.getElementById('ir2L').classList.add('white');
        console.log("Background ir2L is white");
    }
    else{
        document.getElementById('ir2L').classList.remove('white');
        document.getElementById('ir2L').classList.add('black');
        console.log("Background ir2L is black");
    }
    if (ir0L === '0') {
        document.getElementById('ir0L').classList.remove('black');
        document.getElementById('ir0L').classList.add('white');
        console.log("Background ir0L is white");
    }
    else{
        document.getElementById('ir0L').classList.remove('white');
        document.getElementById('ir0L').classList.add('black');
        console.log("Background ir0L is black");
    }
    if (ir1R === '0') {
        document.getElementById('ir1R').classList.remove('black');
        document.getElementById('ir1R').classList.add('white');
        console.log("Background ir1R is white");
    }
    else{
        document.getElementById('ir1R').classList.remove('white');
        document.getElementById('ir1R').classList.add('black');
        console.log("Background ir1R is black");
    }
    if (ir3R === '0') {
        document.getElementById('ir3R').classList.remove('black');
        document.getElementById('ir3R').classList.add('white');
        console.log("Background ir3R is white");
    }
    else{
        document.getElementById('ir3R').classList.remove('white');
        document.getElementById('ir3R').classList.add('black');
        console.log("Background ir3R is black");
    }
    slider.value = distance;
    distanceValue.textContent = `Distance: ${distance} cm`;
}


