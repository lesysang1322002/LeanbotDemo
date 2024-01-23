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
    let gridItems = document.querySelectorAll('.grid-item');
    if (button.innerText == "Scan") {
        requestBluetoothDevice();
    } else {
        document.getElementById("buttonText").innerText = "Scan";
        disconnect();
        requestBluetoothDevice();
        distanceValue.textContent="HC-SR04 Ultrasonic distance";
        gridItems.forEach(item => {
            item.style.border = "3px solid #000";
        });
        slider.value=0;
        checksum= Array(12).fill(0);
        check0= Array(12).fill(0);
        check1= Array(12).fill(0);
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

const distanceValue = document.getElementById('distanceValue');
const slider = document.getElementById('distanceSlider');

// Kiểm tra giá trị distance và thay đổi nội dung tương ứng
let checkArray = [];
let check0 = [];
let check1 = [];
let checksum = []; 
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
            TB1A=string[3];checkArray[0]=TB1A;
            TB1B=string[4];checkArray[1]=TB1B;
            TB2A=string[5];checkArray[2]=TB2A;
            TB2B=string[6];checkArray[3]=TB2B;
            ir6L=string[13];checkArray[4]=ir6L;
            ir4L=string[14];checkArray[5]=ir4L;
            ir2L=string[16];checkArray[6]=ir2L;
            ir0L=string[17];checkArray[7]=ir0L;
            ir1R=string[18];checkArray[8]=ir1R;
            ir3R=string[19];checkArray[9]=ir3R;
            ir5R=string[21];checkArray[10]=ir5R;
            ir7R=string[22];checkArray[11]=ir7R;
            console.log(checkArray);
            for(let i=0;i<12;i++){
                if(checkArray[i]==='1') {
                    check1[i]=1;
                }
                if(checkArray[i]==='0') check0[i]=1;
                if(check0[i] && check1[i]) checksum[i]=1;
            }
            console.log(checksum);
            for (let i = 0; i < checksum.length; i++) {
                let elementId = "";  // Lưu trữ id của thẻ cần thay đổi
                switch (i) {
                    case 0: elementId = "TB1A"; break;
                    case 1: elementId = "TB1B"; break;
                    case 2: elementId = "TB2A"; break;
                    case 3: elementId = "TB2B"; break;
                    case 4: elementId = "ir6L"; break;
                    case 5: elementId = "ir4L"; break;
                    case 6: elementId = "ir2L"; break;
                    case 7: elementId = "ir0L"; break;
                    case 8: elementId = "ir1R"; break;
                    case 9: elementId = "ir3R"; break;
                    case 10: elementId = "ir5R"; break;
                    case 11: elementId = "ir7R"; break;
                    default: break;
                }
                // Lấy thẻ DOM bằng cách sử dụng id
                let element = document.getElementById(elementId);
            
                // Kiểm tra giá trị của checkArray[i]
                if (checksum[i] === 1) {
                    // Nếu checkArray[i] bằng 1, thì đổi màu border của thẻ đó
                    element.style.border = "3px solid green";  // Đổi thành màu đỏ, bạn có thể thay đổi màu sắc tùy ý
                }
                else{
                    element.style.border = "3px solid black";
                }
            }
            i=26;
            distance="";
            while(string[i]!=' '){
                distance +=string[i];
                i++;
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
            if (distance === "1000") {
                distanceValue.textContent="HC-SR04 Ultrasonic distance";
              } else {
                distanceValue.textContent = `${distance} cm`;
              }
            slider.value = distance;
        }
        string="";
    }
    else{
        string+=valueString;
    }
}

function log(text){
    
}

function checkIrTB(){
    check_array=[''];
    check0=[];
    check1=[];

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
let check=false;
function ToggleGripper(){
    if(check){
        document.getElementById("GripperText").innerText="Gripper Close";
        gripperOpen(); 
    }
    else{
        document.getElementById("GripperText").innerText="Gripper Open";
        gripperClose();
    }
    check=!check;
}
function gripperClose(){
    send("X");
}
function gripperOpen(){
    send("x");
}
function TestBuzzer(){
    send("z");
}
function TestGripper(){
    send("p");
}
function TestLed(){
    send("e");
}
function TestMotor(){
    send("o");
}
// let tabIndex = valueString.indexOf('\t');
// let spaceIndex = valueString.indexOf(' ');

