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
function requestBluetoothDevice() {
    if(isWebBluetoothEnabled){
logstatus('Finding...');
navigator.bluetooth.requestDevice({
    filters: [{
        services: ['0000ffe0-0000-1000-8000-00805f9b34fb'] }] 
    })         
.then(device => {
    device.addEventListener('gattserverdisconnected', onDisconnected);
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
        checkMessageWithin5Seconds();        
        checkconnected=true;
        distanceValue.style.color = "black";
        textangle.style.color = "black";
        textangleLeft.style.color = "black";
        textangleRight.style.color = "black";
        testIRLineCalibration.style.color = "black";
        buttonsTest.forEach(item => {
            item.style.color = "black";
        });
        gridItems.forEach(item => {
            item.style.removeProperty("color");
        });
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
function onDisconnected(event) {
    const device = event.target;
    resetPageColor();
    logstatus("Scan to connect");
    document.getElementById("buttonText").innerText = "Scan";
    console.log(`Device ${device.name} is disconnected.`);
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

let checkconnected=false;

let checkmessage=false;

const button = document.getElementById("toggleButton");

let gridItems = document.querySelectorAll('.grid-item');
let buttonsTest = document.querySelectorAll('.buttonTest');
let elements = document.querySelectorAll("#text10cm, #text30cm");

function toggleFunction() {
    if (button.innerText == "Scan") {
        requestBluetoothDevice();
    } else {
        disconnect();
        requestBluetoothDevice();
        resetPageColor();
    }
}
function resetPageColor(){
        checkconnected=false;
        checkmessage=false;
        checkpopup = false;
        navbarTitle.style.color = "orange";
        document.getElementById("buttonText").innerText = "Scan";
        distanceValue.style.color = "#CCCCCC";
        textangle.style.color = "#CCCCCC";
        textangleLeft.style.color = "#CCCCCC";
        textangleRight.style.color = "#CCCCCC";
        testIRLineCalibration.style.color = "#CCCCCC";
        buttonsTest.forEach(item => {
        item.style.color = "#CCCCCC";
        });
        gridItems.forEach(item => {
            item.style.color = "#CCCCCC";
        });
        distanceValue.textContent="HC-SR04 Ultrasonic distance";
        distanceValue.style.fontSize = "13px";
        clearTimeout(Timeout10cm);
        clearTimeout(Timeout30cm);
        for(let i=0;i<12;i++){
            clearTimeout(Timeout1[i]);
            clearTimeout(Timeout0[i]);
            Lastcommand1[i] = true;
            Lastcommand0[i] = true;
            check0[i] = false;
            check1[i] = false;
        }
        angleLValue.textContent = '';
        angleRValue.textContent = '';
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
        slidercontainer.style.border = "3px solid #CCCCCC ";
        element10cm.style.color = "#CCCCCC";
        element10cm.style.color = "#CCCCCC";
        resetBackground();
        checkClickDone = false;
}
if(!checkconnected){
    distanceValue.style.color = "#CCCCCC";
    textangle.style.color = "#CCCCCC";
    textangleLeft.style.color = "#CCCCCC";
    textangleRight.style.color = "#CCCCCC";
    buttonsTest.forEach(item => {
        item.style.color = "#CCCCCC";
    });
    gridItems.forEach(item => {
        item.style.color = "#CCCCCC";
    });
}
let ir2L,ir0L,ir1R,ir3R,ir4L,ir6L,ir5R,ir7R,TB1A,TB1B,TB2A,TB2B,distance="",i,angleL,angleR;

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
let Timeout0 = [];
let Lastcommand0 =[];
for(let i = 0 ; i < 12; i++){
    Lastcommand1[i] = true;
    Lastcommand0[i] = true;
    check0[i] = false;
    check1[i] = false;
}
let checksum = []; 
let string="";
let stringfill;
let lineState="";
let stringcheck="";
let distanceInt;
function handleChangedValue(event) {
    let data = event.target.value;
    let dataArray = new Uint8Array(data.buffer);
    let textDecoder = new TextDecoder('utf-8');
    let valueString = textDecoder.decode(dataArray);
    let n = valueString.length;
    if(valueString[n-1]=='\n'){
        string+=valueString;
        stringcheck=string[0]+string[1]+string[2]+string[7]+string[8]+string[9]+string[10]+string[11]+string[12];
        // Kiểm tra điều kiện
        if (stringcheck === "TB  - IR ") {
            console.log("Bản tin đúng trước 5 giây.");
            checkmessage=true;
            clearTimeout(timeoutCheckMessage); // Hủy kết thúc sau 5 giây
        }
        let s = string.length;
        stringfill=string.substring(0,s-2);
        UpdateBorderButtonDemo();
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
            lineState= ir4L + ir2L + ir0L + ir1R;
            if(lineState ==='1111' || lineState ==='0000'){
                testFollowline.style.color = "#CCCCCC";
            }
            else{
                testFollowline.style.color = "green";
            }
            console.log(lineState);
            for(let i=0;i<12;i++){
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
                let element = document.getElementById(elementId);
                if(!check1[i]){
                    if(checkArray[i]=='1'){
                        element.style.border = "3px solid orange";
                    if(Lastcommand1[i]){
                    Timeout1[i] = setTimeout(() => {
                        element.style.border = "3px solid #CCCCCC";
                        check1[i]=true;
                    }, 3000);
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
                        element.style.border = "3px solid orange";
                    if(Lastcommand0[i]){
                    Timeout0[i] = setTimeout(() => {
                        element.style.border = "3px solid #CCCCCC";
                        check0[i]=true;
                    }, 3000);
                    }
                    Lastcommand0[i] = false;
                    }
                    else{
                        clearTimeout(Timeout0[i]);
                        Lastcommand0[i]=true;   
                    }
                }
                if(check0[i] && check1[i]) {
                    checksum[i]=1;
                    element.style.border = "3px solid green";  
                }
            }
            i=26;
            distance="";
            while(string[i]!=' '){
                distance +=string[i];
                i++;
            }
            distanceInt = parseInt(distance); // Chuyển đổi thành số nguyên
            if(distanceInt>100){
                testObjectfollow.style.color = "#CCCCCC";
            }
            else{
                testObjectfollow.style.color = "green";
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
            angleR=string.substring(RIndex+d+3,NLIndex-1);
            angleLValue.textContent = `${angleL}°`;
            angleRValue.textContent = `${angleR}°`;
            Updateallbackground(); 
            if(!check10cm){
                if(distance=='10'){
                    element10cm.style.color = "orange";
                if(Lastcommand10cm){
                Timeout10cm = setTimeout(() => {
                    element10cm.style.color = "green";
                    check10cm=true;
                }, 3000);
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
                }, 3000);
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
                distanceValue.style.color = "green";
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
    if(areAllElementsEqualToOne(checkButtonGreen) && areAllElementsEqualToOne(checksum) && check10cm && check30cm){
        navbarTitle.style.color = "green";
    }
}

let timeoutCheckMessage;

function checkMessageWithin5Seconds() {
    // Thiết lập hàm setTimeout để kết thúc sau 5 giây
    timeoutCheckMessage = setTimeout(function() {
        console.log("Đã hết thời gian 5 giây, bản tin sai.");
        let infoBox = document.getElementById("infopopup");
        // Hiển thị info box
        infoBox.style.display = "block";
        document.addEventListener("click", function(event) {
            if (!infoBox.contains(event.target)) {
                infoBox.style.display = "none";
            }
        });
    }, 5000);
}
function updateBackground(id, value) {
    const element = document.getElementById(id);
    if (value === '0') {
        element.classList.remove('black');
        element.classList.add('white');
    } else {
        if(id=="TB1A" || id=="TB1B" ||id=="TB2A" || id=="TB2B" ){
            element.classList.remove('white');
            element.classList.add('red');
        }
        else{
        element.classList.remove('white');
        element.classList.add('black');
        }
    }
}
function handleTimeoutCheck(check, array, lastCommand, timeout) {
    for (let i = 0; i < 12; i++) {
        if (!check[i]) {
            if (array[i] === '1') {
                if (lastCommand[i]) {
                    timeout[i] = setTimeout(() => {
                        check[i] = true;
                    }, 3000);
                }
                lastCommand[i] = false;
            } else {
                clearTimeout(timeout[i]);
                lastCommand[i] = true;
            }
        }
    }
}
function Updateallbackground(){
    // if(!checkClickDone){
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
    // }
}
let checkButtonGreen = [0,0,0,0,0,0,0];
function UpdateBorderButtonDemo(){
    console.log(stringfill);
    if(stringfill == 'Gripper'){
        element = document.getElementById("testGripper");
        element.style.border = "3px solid green";
        checkButtonGreen[0]=1;
        checkClickDone = false;
    }
    if(stringfill == 'Motion'){
        element = document.getElementById("testMotor");
        element.style.border = "3px solid green";
        checkButtonGreen[1]=1;
        checkClickDone = false;
    }
    if(stringfill == 'RGBLeds'){
        element = document.getElementById("testLed");
        element.style.border = "3px solid green";
        checkButtonGreen[2]=1;
        checkClickDone = false;
    }
    if(stringfill == 'Buzzer'){
        element = document.getElementById("testBuzzer");
        element.style.border = "3px solid green"; 
        checkButtonGreen[3]=1;
        checkClickDone = false;
    }
    if(stringfill == 'StraightMotion'){
        element = document.getElementById("testStraightMotion");
        element.style.border = "3px solid green"; 
        checkButtonGreen[4]=1;
        checkClickDone = false;
    }
    if(stringfill == 'LineFollow'){
        element = document.getElementById("testFollowline");
        element.style.border = "3px solid green"; 
        checkButtonGreen[5]=1;
        checkClickDone = false;
    }
    if(stringfill == 'Objectfollow'){
        element = document.getElementById("testObjectfollow");
        element.style.border = "3px solid green"; 
        checkButtonGreen[6]=1;
        checkClickDone = false;
    }
    // console.log(checkButtonGreen);
}
function areAllElementsEqualToOne(arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== 1) {
        return false;
      }
    }
    return true;
  }
function resetBackground(){
    updateBackground('ir2L', '0');
    updateBackground('ir0L', '0');
    updateBackground('ir1R', '0');
    updateBackground('ir3R', '0');
    updateBackground('ir4L', '0');
    updateBackground('ir6L', '0');
    updateBackground('ir5R', '0');
    updateBackground('ir7R', '0');
    updateBackground('TB1A', '0');
    updateBackground('TB1B', '0');
    updateBackground('TB2A', '0');
    updateBackground('TB2B', '0');
}
let checkClickDone = false;
// Thực hiện send và đổi màu viền khi click
function runTest(component, command){
    if(checkmessage && !checkClickDone){
        send(command);
        element = document.getElementById("test" + component);
        element.style.border = "3px solid orange";
        checkClickDone = true;
        // resetBackground();
    }
}

function TestBuzzer(){
    runTest("Buzzer", "Buzzer");
}

function TestGripper(){
    runTest("Gripper", "Gripper");
}

function TestLed(){
    runTest("Led", "RGBLeds");
}

function TestMotor(){
    runTest("Motor", "Motion");
}
function TestLineFollow(){
    if(checkmessage){
    if(lineState!=='1111' && lineState!=='0000'){
    runTest("Followline","LineFollow");
    }
    else{
        alert('Please put Leanbot on black line to run Line Follow Demo');
    }
    }
}
function TestStraightMotion(){
    runTest("StraightMotion","StraightMotion");
}
function TestObjectfollow(){
    if(checkmessage){
    if(distanceInt <= 100){
        runTest("Objectfollow","Objectfollow");
    }
    else{
        alert('Please put an object within 100 cm in front of Leanbot');
    }
    }
}
function TestIRLineCalibration(){
    if(checkmessage){
    send("IRLine");
    }
}
// function TestLineFollowOff(){
//     // element = document.getElementById("testFollowline");
//     // element.style.border = "3px solid gray";
//     send("lineFollowOff");
// }
// let checkLineFollow = false;

// function toggleLineFollow(){
//     if(checkLineFollow){
//         TestLineFollowOff();
//         checkLineFollow = false;
//     }
//     else{
//         TestLineFollowOn();
//         checkLineFollow = true;
//     }
// }
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