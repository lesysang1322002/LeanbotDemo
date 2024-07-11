#include <Leanbot.h>

#define BEEP_FREQ   1500
int speed = 1000;
int SPEED_MAX  = 2000;
bool checkRemotefromWeb = false;
 
void setup() {
  Leanbot.begin();
  LbIRLine.setThreshold(60, 60, 60, 60);
}
 
void loop() {
  serial_checkCommand();
  printAllSensors();
  if (!checkRemotefromWeb) lbTouch_check();
  LbDelay(100);
}

void serial_checkCommand() {
  if (Serial.available() <= 0) return;
  static String commandBuffer = "";
  while (Serial.available() > 0) {
    char incomingChar = Serial.read();
    if (incomingChar == '\n') {
      handleCommand(commandBuffer);
      commandBuffer = "";
    } else {
      commandBuffer += incomingChar;
    }
  }
}

void printAllSensors() {
  printTouch();
  Serial.print(" - ");
  printIR();
  Serial.print(" - ");
  printPing();
  Serial.print(" - ");
  printGripper();
  Serial.println();
}
 
void printTouch() {
  const int touchPins[] = {TB1A, TB1B, TB2A, TB2B};
  Serial.print("TB ");
  for (int i = 0; i < 4; i++) {
    Serial.print(LbTouch.read(touchPins[i]) == HIGH ? "1" : "0");
  }
}
 
int threshold(int value, int thresholdValue) {
  return (value > thresholdValue) ? 1 : 0;
}
 
void printIR(){
  Serial.print("IR ");                      
  int irValues[] = {
    threshold(LbIRSensor.read(sir6L), 60),
    threshold(LbIRSensor.read(sir4L), 60),
    threshold(LbIRSensor.read(sir5R), 60),
    threshold(LbIRSensor.read(sir7R), 60)
  };
  Serial.print(irValues[0]);
  Serial.print(irValues[1]);
  Serial.print(" ");
  LbIRLine.print(LbIRLine.read()); 
  Serial.print(" ");           
  Serial.print(irValues[2]);
  Serial.print(irValues[3]);
}
 
void printPing(){
  int distance = Leanbot.pingCm(); 
  Serial.print(distance);           
  Serial.print(" cm");
}
 
void printGripper(){
  Serial.print("GR ");
  int angleL = LbGripper.readL();
  int angleR = LbGripper.readR();
  Serial.print(angleL);
  Serial.print(" ");
  Serial.print(angleR);
}
 
void handleCommand(String command) {
  if (command == "Motion") MotionDemo();
  else if (command == "Gripper") GripperDemo();
  else if (command == "Buzzer") BuzzerDemo();
  else if (command == "RGBLeds") RGBLedsDemo();
  else if (command == "LineFollow") LineFollowDemo();
  else if (command == "StraightMotion") StraightMotionDemo();
  else if (command == "Objectfollow") ObjectfollowDemo();
  else if (command == "IRLine") IRLineManualCalibration();
  else if (command == "RemoteControll") checkRemotefromWeb = true;
}

void StraightMotionDemo(){
  LbMotion.runLR( +2000, +2000 );    
  LbMotion.waitDistanceMm( 1000 );      
  LbDelay(100);
  LbMotion.runLR( -2000, -2000 );       
  LbMotion.waitDistanceMm( -980 );      
  LbMotion.runLR(0, 0);
  Serial.println("StraightMotion");
  LbDelay(100);
}
 
int lineState;
void LineFollowDemo(){         
  do {
    lineState = LbIRLine.read();
    printAllSensors();
    runFollowLine();
  } while ( LbIRLine.isBlackDetected() && lineState != 0b1111 );
  LbMotion.runLR(0, 0);
  LbDelay(100);
  Serial.println("LineFollow");
  LbDelay(100);
}
 
void ObjectfollowDemo(){
  int d = Leanbot.pingCm();
  int limit  = 15;
  int offset = 1;
  while( (d != 0) && (d < 100) ){
    d = Leanbot.pingCm();
    if (d > (limit + offset)) {
      LbMotion.runLR(SPEED_MAX, SPEED_MAX);
    } else if (d < (limit - offset)) {
      LbMotion.runLR(-SPEED_MAX, -SPEED_MAX);
    }
    printAllSensors();
    LbDelay(50);
  }
  LbMotion.runLR(0, 0);
  Serial.println("Objectfollow");
  LbDelay(100);
}
 
void MotionDemo(){
  LbMotion.runLRrpm(30, 30);
  LbMotion.waitDistanceMm(100);
  LbMotion.runLRrpm(-30, -30);
  LbMotion.waitDistanceMm(100);
  LbMotion.runLRrpm(30, -30);
  LbMotion.waitRotationDeg(90);
  LbMotion.runLRrpm(-30, 30);
  LbMotion.waitRotationDeg(90);
  LbMotion.stopAndWait();
  Serial.println("Motion");
  LbDelay(100);
}
 
void GripperDemo(){
  printAllSensors();
  LbGripper.close();
  printAllSensors();
  LbDelay(1000);
  LbGripper.open();
  printAllSensors();
  LbDelay(50);
  Serial.println("Gripper");
  LbDelay(100);
}
 
void RGBLedsDemo(){
  LbRGB.fillColor(CRGB(random8(), random8(), random8()));
  LbRGB.show();
  LbDelay(1000);
  LbRGB.clear();
  LbRGB.show();
  Serial.println("RGBLeds");
  LbDelay(100);
}

void BuzzerDemo(){
  const int notes[] = {261, 293, 329, 349, 392, 440, 493, 523};
  for (int i = 0; i < 8; i++) {
    Leanbot.tone(notes[i], 100);
    LbDelay(100);
  }
  Serial.println("Buzzer");
  LbDelay(100);
}
 
void IRLineManualCalibration(){
  LbIRLine.doManualCalibration(TB1A);
}
 
void runFollowLine() {
  for (int i = 0; i < 30; i++) {
    int lineValue = LbIRLine.read();
    LbIRLine.displayOnRGB(CRGB::DarkCyan);
 
    switch (lineValue) {
      case 0b0100:
      case 0b1110:
        LbMotion.runLR(0, +speed);
        break;
      case 0b1100:
      case 0b1000:
        LbMotion.runLR(-speed, +speed);
        break;
      case 0b0010:
      case 0b0111:
        LbMotion.runLR(+speed, 0);
        break;
      case 0b0011:
      case 0b0001:
        LbMotion.runLR(+speed, -speed);
        break;
      default:
        LbMotion.runLR(+speed, +speed);
    }
 
    if (LbIRLine.isBlackDetected())
      break;
 
    LbMotion.waitDistanceMm(1);
  }
}

void lbTouch_check() {
  if (LbTouch.onPress(TB1A)) {
    if (LbMotion.isMoving())      Leanbot_setSpeed(0, 0);
    else {
      delay(100);
      if (LbTouch.onPress(TB1B))  Leanbot_setSpeed(+2, +2);
      else                        Leanbot_setSpeed(+0, +2);
    }
    beepSingle();
    delay(50);
    return;
  }
 
  if (LbTouch.onPress(TB1B)) {
    if (LbMotion.isMoving())      Leanbot_setSpeed(0, 0);
    else {
      delay(100);
      if (LbTouch.onPress(TB1A))  Leanbot_setSpeed(+2, +2);
      else                        Leanbot_setSpeed(+2, +0);
    }
    beepSingle();
    delay(50);
    return;
  }
 
  if (LbTouch.read(TB2A) && LbTouch.read(TB2B)) {
    beepSingle();
    LbGripper_Toggle();
  }
}
 
void beepSingle() {
  Leanbot.tone(BEEP_FREQ, 50);        // play sound at 1500Hz for 50ms
}
 
void Leanbot_setSpeed(int speedL, int speedR) {
  LbMotion.runLR(SPEED_MAX * speedL / 4, SPEED_MAX * speedR / 4);
}
 
void LbGripper_Toggle() {
  static bool GripperIsClose = false;
 
  if (GripperIsClose) {
    LbGripper.open();
    GripperIsClose = false;
  } else {
    LbGripper.close();
    GripperIsClose = true;
  }
}