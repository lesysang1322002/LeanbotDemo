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

let ir2L,ir0L,ir1R,ir3R,ir4L,ir6L,ir5R,ir7R,TB1A,TB1B,TB2A,TB2B,distance="";
const slider = document.getElementById('distanceSlider');
const distanceValue = document.getElementById('distanceValue');
function handleChangedValue(event) {
    let data = event.target.value;
    let dataArray = new Uint8Array(data.buffer);
    let textDecoder = new TextDecoder('utf-8');
    let valueString = textDecoder.decode(dataArray);
    if(valueString[0]=='T'){
        TB1A=valueString[3];
        TB1B=valueString[4];
        TB2A=valueString[5];
        TB2B=valueString[6];
        ir6L=valueString[13];
        ir4L=valueString[14];
        ir2L=valueString[16];
        ir0L=valueString[17];
        ir1R=valueString[18];
        ir3R=valueString[19];
        }
        else if(valueString[0]==' '){
            ir5R=valueString[1];
            ir7R=valueString[2];
            let i = 6;
            distance="";
            while(valueString[i] !== ' ') {
                distance += valueString[i];
                i++;
            }
        }
        console.log("TB: " + TB1A+TB1B+TB2A+TB2B);
        console.log("IR: " + ir6L+ ir4L +" "+ ir2L+ir0L+ir1R+ir3R + " " +ir5R+ir7R);
        updateBackground('ir2L', ir2L);
        updateBackground('ir0L', ir0L);
        updateBackground('ir1R', ir1R);
        updateBackground('ir3R', ir3R);
        updateBackground('ir4L', ir4L);
        updateBackground('ir6L', ir6L);
        updateBackground('ir5R', ir5R);
        updateBackground('ir7R', ir7R);
        updateBackground('TB1A', TB1A);
        updateBackground('TB1B', TB1B);
        updateBackground('TB2A', TB2A);
        updateBackground('TB2B', TB2B);
        slider.value = distance;
        distanceValue.textContent = `${distance} cm`;
}
function updateBackground(id, value) {
    const element = document.getElementById(id);

    if (value === '0') {
        element.classList.remove('black');
        element.classList.add('white');
        console.log(`Background ${id} is white`);
    } else {
        element.classList.remove('white');
        element.classList.add('black');
        console.log(`Background ${id} is black`);
    }
}
// let tabIndex = valueString.indexOf('\t');
// let spaceIndex = valueString.indexOf(' ');

