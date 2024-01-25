let element1 = document.getElementById("distanceValue");
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
    let buttonsTest = document.querySelectorAll('.buttonTest');
    let elements = document.querySelectorAll("#text10cm, #text30cm");
    if (button.innerText == "Scan") {
        requestBluetoothDevice();
    } else {
        document.getElementById("buttonText").innerText = "Scan";
        disconnect();
        requestBluetoothDevice();
        distanceValue.textContent="HC-SR04 Ultrasonic distance";
        gridItems.forEach(item => {
            item.style.border = "3px solid #CCCCCC";
        });
        buttonsTest.forEach(item => {
            item.style.border = "3px solid #CCCCCC";
        });
        elements.forEach(item => {
            item.style.color = "#CCCCCC";
        });
        slider.value=0;
        checksum= Array(12).fill(0);
        check0= Array(12).fill(0);
        check1= Array(12).fill(0);
        check10cm=false;
        check30cm=false;
        distanceValue.style.fontSize = "13px";
        element1.style.color = "black";
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
        checkbutton=true;
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

let ir2L,ir0L,ir1R,ir3R,ir4L,ir6L,ir5R,ir7R,TB1A,TB1B,TB2A,TB2B,distance="",i,angleL,angleR;

const distanceValue = document.getElementById('distanceValue');
const angleLValue = document.getElementById('textangleL');
const angleRValue = document.getElementById('textangleR');
const slidercontainer = document.getElementById('ctn-slider');
const slider = document.getElementById('distanceSlider');
const sliderbackground = document.getElementById('slider');
let element10cm = document.getElementById("text10cm");
let element30cm = document.getElementById("text30cm");

// Kiểm tra giá trị distance và thay đổi nội dung tương ứng
let check10cm=false,check30cm=false;
let Lastcommand10cm=true;
let Lastcommand30cm=true;
let Timeout10cm,Timeout30cm;
let checkArray = [];
let check0 = [];
let check1 = [];
let Timeout1 = [];
let Lastcommand1 =[];
for(let i = 0 ; i < 12; i++){
    Lastcommand1[i] = true;
}
let Timeout0 = [];
let Lastcommand0 =[];
for(let i = 0 ; i < 12; i++){
    Lastcommand0[i] = true;
}
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
        // console.log(string);
        let s = string.length;
        let stringfill=string.substring(0,s-2);
        if(stringfill == 'Gripper'){
            element = document.getElementById("testGripper");
            element.style.border = "3px solid green";
            // console.log("String is Gripper");
        }
        if(stringfill == 'Motion'){
            element = document.getElementById("testMotor");
            element.style.border = "3px solid green";
            // console.log("String is Motion");
        }
        if(stringfill == 'RGBLeds'){
            element = document.getElementById("testLed");
            element.style.border = "3px solid green";
            // console.log("String is RGBLeds");
        }
        if(stringfill == 'Buzzer'){
            element = document.getElementById("testBuzzer");
            element.style.border = "3px solid green"; 
            // console.log("String is Buzzer");     
        }
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
                if(!check1[i]){
                    if(checkArray[i]=='1'){
                    if(Lastcommand1[i]){
                    Timeout1[i] = setTimeout(() => {
                        check1[i]=true;
                    }, 5000);
                    }
                    Lastcommand1[i] = false;
                    }
                    else{
                        clearTimeout(Timeout1[i]);
                        Lastcommand1[i]=true;   
                    }
                }
                if(!check0[i]){
                    if(checkArray[i]=='0'){
                    if(Lastcommand0[i]){
                    Timeout0[i] = setTimeout(() => {
                        check0[i]=true;
                    }, 5000);
                    }
                    Lastcommand0[i] = false;
                    }
                    else{
                        clearTimeout(Timeout0[i]);
                        Lastcommand0[i]=true;   
                    }
                }
                if(check0[i] && check1[i]) checksum[i]=1;
            }
            console.log(checksum);
            for (let i = 0; i < 12; i++) {
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

                if(check1[i]){
                    element.style.border = "3px solid yellow";
                }
                if(check0[i]){
                    element.style.border = "3px solid orange";
                }
                // Kiểm tra giá trị của checkArray[i]
                if (checksum[i] === 1) {
                    // Nếu checkArray[i] bằng 1, thì đổi màu border của thẻ đó
                    element.style.border = "3px solid green";  // Đổi thành màu đỏ, bạn có thể thay đổi màu sắc tùy ý
                }
                // else{
                //     element.style.border = "3px solid #CCCCCC";
                // }
            }
            i=26;
            distance="";
            while(string[i]!=' '){
                distance +=string[i];
                i++;
            }
            let GIndex = string.indexOf('G');
            let RIndex = string.indexOf('R',GIndex);
            let NLIndex = string.indexOf('\n');
            let j = RIndex + 2;
            angleL="";
            while(string[j] != ' '){
                angleL += string[j];
                j++;
            }
            let d = angleL.length;
            // console.log("AngleL: " + angleL);
            angleR=string.substring(RIndex+d+3,NLIndex-1);
            // console.log("AngleR: " + angleR);
            // console.log("TB: " + TB1A+TB1B+TB2A+TB2B);
            // console.log("IR: " + ir6L+ ir4L +" "+ ir2L+ir0L+ir1R+ir3R + " " +ir5R+ir7R);
            // console.log("Distance: " + distance);
            // console.log("Gripper: " + angleL + " " + angleR);
            angleLValue.textContent = `${angleL}°`;
            angleRValue.textContent = `${angleR}°`;
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
            
            if(!check10cm){
                if(distance=='10'){
                    element10cm.style.color = "orange";
                if(Lastcommand10cm){
                Timeout10cm = setTimeout(() => {
                    element10cm.style.color = "green";
                    check10cm=true;
                }, 5000);
                }
                Lastcommand10cm = false;
                }
                else{
                    element10cm.style.color = "#CCCCCC";
                    clearTimeout(Timeout10cm);
                    Lastcommand10cm=true;   
                }
            }
        
            if(!check30cm){
                if(distance=='30'){
                    element30cm.style.color = "orange";
                if(Lastcommand30cm){
                Timeout30cm = setTimeout(() => {
                    element30cm.style.color = "green";
                    check30cm=true;
                }, 5000);
                }
                Lastcommand30cm=false;
                }
                else{
                    element30cm.style.color = "#CCCCCC";
                    clearTimeout(Timeout30cm);
                    Lastcommand30cm=true;   
                }
            }
            if(check10cm && check30cm){
                element1.style.color = "green";
                slidercontainer.style.border = "3px solid green ";
            }
            if (distance === "1000") {
                distanceValue.textContent="HC-SR04 Ultrasonic distance";
                distanceValue.style.fontSize = "13px";
              } else {
                distanceValue.textContent = `${distance} cm`;
                distanceValue.style.fontSize = "20px";
              }
            slider.value = distance;
        }
        string="";
    }
    else{
        string+=valueString;
    }
}

function updateBackground(id, value) {
    const element = document.getElementById(id);

    if (value === '0') {
        element.classList.remove('black');
        element.classList.add('white');
        // console.log(`Background ${id} is white`);
    } else {
        if(id=="TB1A" || id=="TB1B" ||id=="TB2A" || id=="TB2B" ){
            element.classList.remove('white');
            element.classList.add('red');
            // console.log(`Background ${id} is red`);
        }
        else{
        element.classList.remove('white');
        element.classList.add('black');
        // console.log(`Background ${id} is black`);
        }
    }
}

function TestBuzzer(){
    send("Buzzer");
    element = document.getElementById("testBuzzer");
    element.style.border = "3px solid orange";
}
function TestGripper(){
    send("Gripper");
    element = document.getElementById("testGripper");
    element.style.border = "3px solid orange";
}
function TestLed(){
    send("RGBLeds");
    element = document.getElementById("testLed");
    element.style.border = "3px solid orange";
}
function TestMotor(){
    send("Motion");
    element = document.getElementById("testMotor");
    element.style.border = "3px solid orange";
}
// let tabIndex = valueString.indexOf('\t');
// let spaceIndex = valueString.indexOf(' ');
