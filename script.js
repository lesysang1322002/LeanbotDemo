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

let ir2L,ir0L,ir1R,ir3R,ir4L,ir6L,ir5R,ir7R,TB1A,TB1B,TB2A,TB2B,distance="",i;
const distanceContainer = document.getElementById("distanceContainer");
// Kiểm tra giá trị distance và thay đổi nội dung tương ứng
const slider = document.getElementById('distanceSlider');
const distanceValue = document.getElementById('distanceValue');
let string="";
function handleChangedValue(event) {
    let data = event.target.value;
    let dataArray = new Uint8Array(data.buffer);
    let textDecoder = new TextDecoder('utf-8');
    let valueString = textDecoder.decode(dataArray);
    let n = valueString.length;
    if(valueString[n-1]=='\n'){
        string+=valueString;
        console.log(string);
        if(string[0]=='T'){
            TB1A=string[3];
            TB1B=string[4];
            TB2A=string[5];
            TB2B=string[6];
            ir6L=string[13];
            ir4L=string[14];
            ir2L=string[16];
            ir0L=string[17];
            ir1R=string[18];
            ir3R=string[19];
            ir5R=string[21];
            ir7R=string[22];
            i=26;
            distance="";
            while(string[i]!=' '){
                distance +=string[i];
                i++;
            }
            if (distance === "1000") {
                distanceContainer.innerHTML = '<h6>HC-SR04 Ultrasonic distance</h6>';
              } else {
                distanceContainer.innerHTML = `<input type="range" id="distanceSlider" min="0" max="100" value="0" />`;
              }
            console.log("TB: " + TB1A+TB1B+TB2A+TB2B);
            console.log("IR: " + ir6L+ ir4L +" "+ ir2L+ir0L+ir1R+ir3R + " " +ir5R+ir7R);
            console.log("Distance: " + distance);
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
        string="";
    }
    else{
        string+=valueString;
    }
}

function log(text){
    
}
function updateBackground(id, value) {
    const element = document.getElementById(id);

    if (value === '0') {
        element.classList.remove('black');
        element.classList.add('white');
        console.log(`Background ${id} is white`);
    } else {
        if(id=="TB1A" || id=="TB1B" ||id=="TB2A" || id=="TB2B" ){
            element.classList.remove('white');
            element.classList.add('red');
            console.log(`Background ${id} is red`);
        }
        else{
        element.classList.remove('white');
        element.classList.add('black');
        console.log(`Background ${id} is black`);
        }
    }
}
// let tabIndex = valueString.indexOf('\t');
// let spaceIndex = valueString.indexOf(' ');

