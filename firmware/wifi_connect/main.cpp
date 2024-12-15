//#include "Particle.h"
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"

#define DEBUG_PRINT

#define MAX_HEART_READ_ITR 3 //300  // calibrate to your sensor

#define RED_COLOR RGB.color(255, 0, 0)
#define GREEN_COLOR RGB.color(0, 255, 0)                // after successful post to the server
#define BLUE_COLOR RGB.color(0, 0, 255)                // while measing
#define WHITE_COLOR RGB.color(255, 255, 255)          // 5 minutes has e***REMOVED***pired
#define PURPLE_COLOR RGB.color(128, 0, 128)           // calibration
#define YELLOW_COLOR RGB.color(255, 255, 0)          // failure to post, wifi or server not available
#define CYAN_COLOR RGB.color(0, 255, 255)            // searching wifi 
#define MAGENTA_COLOR RGB.color(255, 0, 255)         // searching sensor
#define OFF_COLOR RGB.color(0, 0, 0)

const pin_t MY_LED = D11;

// time interval and measurement frequency settings
const int MILLI_SEC = 1000;
// unsigned long  measurementIntervalInMS = 120000;   // delay in millisecond

unsigned long  measurementIntervalInMS = 300;   // delay in millisecond
unsigned long delayStartTime = 0; 
unsigned long previousMillis = 0;  // Store the last time the event occurred
const long FIVE_MIN_IN_MS = 5 * 60 * 1000;  // 5 minutes in milliseconds (5 * 60 * 1000)
const unsigned long MIN_TO_MS = 60 * MILLI_SEC;
time32_t uni***REMOVED***Time = 0;


// Use the STARTUP() macro to set the default antenna
// to use system boot time.
// In this case it would be set to the chip antenna
STARTUP(WiFi.selectAntenna(ANT_INTERNAL));

// Let Device OS manage the connection to the Particle Cloud
// SYSTEM_MODE(AUTOMATIC);
// doesn't immediately connect to the cloude 
SYSTEM_MODE(SEMI_AUTOMATIC);

// Run the application and system concurrently in separate threads
SYSTEM_THREAD(ENABLED);

TCPClient client;           // for http
MAX30105 particleSensor;    // MX10302 sensor

// Define the states of the traffic light
typedef enum {
  MEASURE_HEART_RATE,
  MEAUSURE_O2,
  CHECK_CONNECTIVITY,
  POST_TO_SERVER,
  SAVE_DATA_OFFLINE,
  CLEAR_BUFFER_AFTER_POST,
  CHK_TIME,
  WAIT_SAMPLING_PERIOD
} ece513IOTProjState;

// Define a struct to hold SPO2, heart rate, and Uni***REMOVED*** timestamp
struct sensorDataStruct {
    float SPO2;            // Blood o***REMOVED***ygen saturation
    int heartRate;         // Heart rate in beats per minute
    time32_t uni***REMOVED***Timestamp;  // Uni***REMOVED*** timestamp for the measurement
};
int32_t spo2; //SPO2 value

float beatsPerMinute;
int beatAvg;

const int MAX_SAMPLES = 1024;


// Beginning  of synchronous state
ece513IOTProjState particleState = CHK_TIME;
char t***REMOVED***Buffer[256]; // Buffer for the JSON payload

// wifi and server setting
//const char* server = "192.168.50.71"; // Replace with your local server IP this is my usb interface , 
//const char* server = "18.191.214.37"; //amazon server
const int port = 3000;                // serverPort number
// const char* ssid = SSID;          // Replace with your Wi-Fi SSIDp_
//const char* password = PASSWORD;    // Replace with your Wi-Fi password
const char* ssid = "my_wifii";          // Replace with your Wi-Fi SSID
const char* password = PASSWORD;    // Replace with your Wi-Fi password


//heart beat sesor setting
const byte POWER_LEVEL =  0***REMOVED***1F; //0***REMOVED***FF; //  50.0mA - Presence detection of ~12 inch
const byte SAMPLE_AVG = 4;     // MAX30105_SAMPLEAVG_4
const byte LED_MODE = 3;       // /Watch all three LED channels
const int SAMPLE_RATE = 400;   // MAX30105_SAMPLERATE_200 , try 800
const int PULSE_WIDTH = 411;   // 18 bit resolution
const int ADC_RANGE = 16384;   // 16384 (62.5pA per LSB)

// average HB setting
const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred

// print sensor val that we got
void sensorDataConsolePrint(long irValue){
  Serial.print("IR=");         Serial.print(irValue);
  Serial.print(", BPM=");      Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");  Serial.print(beatAvg);
  Serial.println();
}

// connect to wif 
void connectToWiFi() {
  CYAN_COLOR;
  WiFi.disconnect(); // Ensure we start fresh
  WiFi.on();         // Turn on Wi-Fi module
  WiFi.setCredentials(ssid, password, WPA2);
  WiFi.connect();
  Serial.print("Connecting  to WIFI. . .");
  unsigned long startTime = millis();
  while (!WiFi.ready() && millis() - startTime < 30000) {  // with watch dog timer
    Serial.print(" .");
    delay(100);
  }
  Serial.println();
  Serial.println(WiFi.localIP());
  Particle.connect();   // enable cloud services
  OFF_COLOR;
}

//void createJSONPayload(int avgHeartBeat, float o2Lvl, String deviceName) {
void createJSONPayload(int avgHeartBeat, float o2Lvl, time32_t sampledTime) {
  memset(t***REMOVED***Buffer, 0, sizeof(t***REMOVED***Buffer));
  JSONBufferWriter writer(t***REMOVED***Buffer, sizeof(t***REMOVED***Buffer) - 1);

  writer.beginObject(); // Start JSON object
  writer.name("heartBeat").value(avgHeartBeat);
  writer.name("O2Lvl").value(o2Lvl);
  // writer.name("deviceName").value(deviceName);
  writer.name("sampledTime").value(sampledTime);
  writer.endObject(); // End JSON object
  //return String(t***REMOVED***Buffer); // Convert buffer to String for easy handling
}

// read hearbeat
void  readHearBeat(){
  // Serial.println("\n Measuring Heart Beat.");
  //Take average of readings
  for (int i = 0; i<MAX_HEART_READ_ITR; i++){
    long irValue = particleSensor.getIR();
    if (checkForBeat(irValue) == true){
      Serial.println("We sensed a beat!");
      //We sensed a beat!
      long delta = millis() - lastBeat;
      lastBeat = millis();
      beatsPerMinute = 60 / (delta / 1000.0);

      if (beatsPerMinute < 255 && beatsPerMinute > 20){
        rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
        rateSpot %= RATE_SIZE; //Wrap variable
        //Take average of readings
        beatAvg = 0;
        for (byte ***REMOVED*** = 0 ; ***REMOVED*** < RATE_SIZE ; ***REMOVED***++)
          beatAvg += rates[***REMOVED***];
        beatAvg /= RATE_SIZE;
      }
    }
    else {Serial.println("No beat sensed !");}
    // Serial.print("IR=");
    // Serial.print(irValue);
    // Serial.print(", BPM=");
    // Serial.print(beatsPerMinute);
    // Serial.print(", Avg BPM=");
    // Serial.print(beatAvg);
    // Serial.println();
    if (irValue < 50000) { Serial.print(" No finger?");}
    particleSensor.setPulseAmplitudeGreen(0***REMOVED***0A); //Turn off Green LED
  }
}

// set up sensor
void m***REMOVED***30102Setup(){
  MAGENTA_COLOR;
  //Use default I2C port, 400kHz speed
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("---------------------------------");
    Serial.println("   AX3010X was not found         ");
    Serial.println("---------------------------------");
    while (1);
  } else {
      Serial.println("---------------------------------");
      Serial.println("   AX3010X  found                ");
      Serial.println("---------------------------------");
  }
  particleSensor.setup(POWER_LEVEL, SAMPLE_AVG, LED_MODE, SAMPLE_RATE, PULSE_WIDTH, ADC_RANGE); 
  particleSensor.setPulseAmplitudeRed(0***REMOVED***0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED  
  OFF_COLOR;
}

void setupO2(){
  byte ledBrightness = 60; //Options: 0=Off to 255=50mA
  byte sampleAverage = 4; //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 2; //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100; //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411; //Options: 69, 118, 215, 411
  int adcRange = 4096; //Options: 2048, 4096, 8192, 16384
  
  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange); //Configure sensor with these settings
}
// read SPO2 Sparkfun e***REMOVED***ample 8
void readO2(){
  int32_t bufferLength; //data length
  bufferLength = 100; //buffer length of 100 stores 4 seconds of samples running at 25sps
  uint32_t irBuffer[bufferLength]; //infrared LED sensor data
  uint32_t redBuffer[bufferLength];  //red LED sensor data
 
  int8_t validSPO2; //indicator to show if the SPO2 calculation is valid
  int32_t heartRate; //heart rate value
  int8_t validHeartRate; //indicator to show if the heart rate calculation is valid

  byte pulseLED = 11; //Must be on PWM pin
  byte readLED = 13; //Blinks with each data read
  
  //read the first 100 samples, and determine the signal range
  for (int i = 0 ; i < bufferLength-1 ; i++){
    while (particleSensor.available() == false){ //do we have new data?
      particleSensor.check(); //Check the sensor for new data
    }
    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.ne***REMOVED***tSample(); //We're finished with this sample so move to ne***REMOVED***t sample

    Serial.print(("i= %d  ", i)); Serial.print(F("red="));    Serial.print(redBuffer[i], DEC);
    Serial.print(F(", ir="));    Serial.println(irBuffer[i], DEC);
  }
  //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
  ma***REMOVED***im_heart_rate_and_o***REMOVED***ygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
  for (int itr = 0 ; itr < 1 ; itr++){
    //dumping the first 25 sets of samples in the memory and shift the last 75 sets of samples to the top
    for (byte i = 25; i < 100; i++){
      redBuffer[i - 25] = redBuffer[i];
      irBuffer[i - 25] = irBuffer[i];
    }
    //take 25 sets of samples before calculating the heart rate.
    for (byte i = 75; i < 100; i++){
      while (particleSensor.available() == false) //do we have new data?
        particleSensor.check(); //Check the sensor for new data

      digitalWrite(readLED, !digitalRead(readLED)); //Blink onboard LED with every data read

      redBuffer[i] = particleSensor.getRed();
      irBuffer[i] = particleSensor.getIR();
      particleSensor.ne***REMOVED***tSample(); //We're finished with this sample so move to ne***REMOVED***t sample
      #ifdef DEBUG_PRINT
        //send samples and calculation result to terminal program through UART
        Serial.print(F("itr="));  Serial.print(itr, DEC); Serial.print(F("red="));  Serial.print(redBuffer[i], DEC); Serial.print(F(", ir="));   Serial.print(irBuffer[i], DEC);
        Serial.print(F(", HR=")); Serial.print(heartRate, DEC); Serial.print(F(", HRvalid="));  Serial.print(validHeartRate, DEC);
        Serial.print(F(", SPO2=")); Serial.print(spo2, DEC); Serial.print(F(", SPO2Valid="));  Serial.println(validSPO2, DEC);
      #endif
    }
    //After gathering 25 new samples recalculate HR and SP02
    ma***REMOVED***im_heart_rate_and_o***REMOVED***ygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);
  }
}

void flushSensorData(){
  spo2 = 0;
  beatAvg = 0;
}

void calibrateSensor(){
  PURPLE_COLOR;
  for (int itr = 0 ; itr < 3 ; itr++){
    readHearBeat();
    readO2();
  }
  flushSensorData();
  OFF_COLOR;
  Serial.println("---------------------------------");
  Serial.println("           Sensor Calibrated     ");
  Serial.println("---------------------------------");
}

bool checkFiveMinutes() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= FIVE_MIN_IN_MS) {  // 5 minutes have passed, update the last time
    previousMillis = currentMillis;
    return true; // 5 minutes have passed
  }
  return false; // 5 minutes have not
}


// Function to check if delay or 5 minutes have passed
bool checkDelayOrFiveMinutes() {
  unsigned long currentMillis = millis();
  
  // Check if the delay has finished
  if (delayStartTime > 0 && currentMillis - delayStartTime >= measurementIntervalInMS) {
      delayStartTime = 0; // Reset delay timer after it finishes
        Serial.println("---------------------------------");
        Serial.println("           WDT  UP               ");
        Serial.println("---------------------------------");
      return true;  // Delay has finished
  }
  if (checkFiveMinutes()){
    WHITE_COLOR;
    Serial.println("---------------------------------");
    Serial.println("           5 MIN  UP             ");
    Serial.println("---------------------------------");
    return true;
  }
  return false; // Neither the delay nor 5 minutes have passed
}

// cloud function that sets 
int setmeasurementIntervalInMS(String sensorCaptureRate){
  Serial.println("---------------------------------");
  Serial.println(" CLOUD Variable Received         ");
  Serial.println("---------------------------------");
  Serial.print("from cloud sensorCaptureRate = ");
  Serial.println(sensorCaptureRate);
  unsigned long setTimeInMin = sensorCaptureRate.toInt();
  if(setTimeInMin > 0 ){measurementIntervalInMS = setTimeInMin * MIN_TO_MS; Serial.print("measurementIntervalInMS = "); Serial.print(measurementIntervalInMS); Serial.println();return 1;}
  else { return -1;}
}

// cloud function to turn the led on and off for debug 
int cloudLedCntrl(String command){
  // look for the matching argument "coffee" <-- ma***REMOVED*** of 64 characters long
  if(command == "1") {digitalWrite(MY_LED, HIGH); return 1;}
  else {digitalWrite(MY_LED, LOW); return -1;}  
}

struct sensorDataStruct measurements[MAX_SAMPLES];
static int total_data_written = 0;

// writes to a global sturct when the IOT can't post the sensor data to server 
void wrStruct() {
  measurements[total_data_written].SPO2 =   beatAvg ;
  measurements[total_data_written].heartRate =  spo2 ;
  measurements[total_data_written].uni***REMOVED***Timestamp = uni***REMOVED***Time; 
  total_data_written = total_data_written +1;
  Serial.print("Samples Wirtten ");
  Serial.println(total_data_written);
    
}



// verifies time of ohe day and returns whether  it is good time to sample or not
bool isItTimeToCheckTheBeat(){
  Serial.println("---------------------------------");
  Serial.println("           Checking Time         ");
  Serial.println("---------------------------------");
  if(Time.hour() >= 6 && Time.hour() <= 22){
     Serial.println("Heart Rate measurment time is valid");

     return true;
  } else {Serial.println("Not a valid time to take measurement, valid time is 6 AM to 10 PM"); return false;}
}

void setup() {
  Serial.begin(115200);
  waitFor(Serial.isConnected, 10000); // Wait for serial connection
  m***REMOVED***30102Setup();  // sensor setup

  pinMode(MY_LED, OUTPUT);  // Enable control of the RGB LED
  RGB.control(true);                            // INTERNAL RGB CNTRL
  connectToWiFi(); // Connect to Wifi

  Particle.variable("sensor_rd_val",t***REMOVED***Buffer);  // particle cloud variable 
                       //variable name                 //function
  Particle.function("meas_int", setmeasurementIntervalInMS);      // register the cloud function
  Particle.function("led_on_off", cloudLedCntrl);
  waitFor(Time.isValid, 60000);  // Wait for time to be synchronized with Particle Device Cloud (requires active connection)
  Time.zone(-7);   // az is UTC -7

}

void loop() {
  // digitalWrite(MY_LED, HIGH);
  
  calibrateSensor();
  while(1){
    switch (particleState){
      // identify if it right time ot measure or not
      case CHK_TIME :
        if(isItTimeToCheckTheBeat()){  /// may be combine the while logic with this
          particleState = MEASURE_HEART_RATE;
        } else{
          particleState = CHK_TIME;
          delay(measurementIntervalInMS);  // wait dealy time and then check the time again
        }
        break;
      // take samples for hearbeat
      case  MEASURE_HEART_RATE :
        uni***REMOVED***Time = Time.now();
        BLUE_COLOR;
        //digitalWrite(MY_LED, HIGH);
        Serial.println("---------------------------------");
        Serial.println("          Measuring HeartBeat    ");
        Serial.println("---------------------------------");
        readHearBeat();
        particleState =  MEAUSURE_O2;
        OFF_COLOR;       
        break;
        
      // take samples for SPO2
      case  MEAUSURE_O2 :
        BLUE_COLOR;
        // digitalWrite(MY_LED, HIGH);
        Serial.println("---------------------------------");
        Serial.println("          Measuring SPO2         ");
        Serial.println("---------------------------------");
        readO2();
        if (spo2 == -999){ particleState = MEAUSURE_O2;}
        else if (WiFi.ready() ){
          particleState = POST_TO_SERVER;
          Serial.println("---------------------------------");
          Serial.println("       Creating JSON payload     ");
          Serial.println("---------------------------------");
        }
        else {particleState =  SAVE_DATA_OFFLINE;}
          OFF_COLOR;
        break;
      
      // post the captured data to server    
      case POST_TO_SERVER :
        if( Particle.publish("ma***REMOVED***30102_data_capture_event", t***REMOVED***Buffer)){
          GREEN_COLOR;
          Serial.println("");
          createJSONPayload(beatAvg, spo2 , uni***REMOVED***Time); 
          Serial.println("---------------------------------");
          Serial.println("       Posted to the server      ");
          Serial.println("---------------------------------");
         
          flushSensorData();
          delay(5000);            
          OFF_COLOR;
        }
        else{ particleState = SAVE_DATA_OFFLINE;}
        break;

        // couldn't post online, now save to struct  
        case SAVE_DATA_OFFLINE : 
          YELLOW_COLOR;
          Serial.println("---------------------------------");
          Serial.println(" Couldn't post to the server     ");
          Serial.println("---------------------------------");
          wrStruct();
          delay(5000);            // flash yellow foa  5  sec
          OFF_COLOR;
          particleState = WAIT_SAMPLING_PERIOD;
        break;
       
      // how often to sample
      // default shold be 30 mins
      case WAIT_SAMPLING_PERIOD :  // WatchDOG
        // digitalWrite(MY_LED, LOW);
        Serial.println("---------------------------------");
        Serial.println("           Waiting for Fs        ");
        Serial.println("---------------------------------");

        delayStartTime = millis();  // Set the starting time for the delay
        
        while (!checkDelayOrFiveMinutes()){
          delay(100);
        }  /// wait until 5 mins e***REMOVED***pier or user delay e***REMOVED***pires 
        particleState = CHK_TIME;
        break;
         
      default:
        // digitalWrite(MY_LED, LOW);
        Serial.println("---------------------------------");
        Serial.println("           In Default State      ");
        Serial.println("---------------------------------");
        //readHearBeat();
        particleState =  MEASURE_HEART_RATE;
        break;
    }         
  }
}

