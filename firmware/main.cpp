//#include "Particle.h"
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"

// #define DEBUG_PRINT

#define MAX_HEART_READ_ITR 4                        //300  // calibrate to your sensor
#define ONE_DAY_MILLIS 24 * 60 * 60 * 1000 



#define RED_COLOR RGB.color(255, 0, 0)
#define GREEN_COLOR RGB.color(0, 255, 0)             // after successful post to the server
#define BLUE_COLOR RGB.color(0, 0, 255)              // while measing
#define WHITE_COLOR RGB.color(255, 255, 255)         // 5 minutes has e***REMOVED***pired
#define PURPLE_COLOR RGB.color(128, 0, 128)          // calibration
#define YELLOW_COLOR RGB.color(255, 255, 0)          // failure to post, wifi or server not available
#define CYAN_COLOR RGB.color(0, 255, 255)            // searching wifi 
#define MAGENTA_COLOR RGB.color(255, 0, 255)         // searching sensor
#define OFF_COLOR RGB.color(0, 0, 0)

const pin_t MY_LED = D11;

// time interval and measurement frequency settings
const int MILLI_SEC = 1000;

unsigned long  measurementIntervalInMS = 120000;   // delay in millisecond


// all time declarations

//unsigned long  measurementIntervalInMS = 300;   // delay in millisecond
unsigned long sensorValRdTimeInMS = 0; 
unsigned long previousMillis = 0;  // Store the last time the event occurred
const long FIVE_MIN_IN_MS = 5 * 60 * 1000;  // 5 minutes in milliseconds (5 * 60 * 1000)
const unsigned long MIN_TO_MS = 60 * MILLI_SEC;


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

// This allows for USB serial debug logs
// SerialLogHandler logHandler;                      // too many messages, system debug

TCPClient client;                                    // for http
MAX30105 particleSensor;                             // MX10302 sensor

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
  float SPO2;               // Blood o***REMOVED***ygen saturation
  int heartRate;            // Heart rate in beats per minute
  time32_t uni***REMOVED***Timestamp;  // Uni***REMOVED*** timestamp for the measurement
};

int32_t spo2; //SPO2 value
float beatsPerMinute;
int beatAvg;
const int MAX_SAMPLES = 1024;


ece513IOTProjState particleState = CHK_TIME;               // Beginning  of synchronous state
char t***REMOVED***Buffer[256];                                        // Buffer for the JSON payload

// wifi and server setting
//const char* server = "192.168.50.71";   // Replace with your local server IP this is my usb interface , 
//const char* server = "18.191.214.37";   //amazon server
const int port = 3000;                    // serverPort number
const char* ssid = "ssid";            // Replace with your Wi-Fi SSID
const char* password = "password-here";      // Replace with your Wi-Fi password


//heart beat sesor setting
const byte POWER_LEVEL =  0***REMOVED***1F; //0***REMOVED***FF; //  50.0mA - Presence detection of ~12 inch
const byte SAMPLE_AVG = 4;     // MAX30105_SAMPLEAVG_4
const byte LED_MODE = 3;       // /Watch all three LED channels
const int SAMPLE_RATE = 400;   // MAX30105_SAMPLERATE_200 , try 800
const int PULSE_WIDTH = 411;   // 18 bit resolution
const int ADC_RANGE = 16384;   // 16384 (62.5pA per LSB)

// average HB setting
const byte RATE_SIZE = 4;       //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE];          //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0;                      //Time at which the last beat occurred

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
  WiFi.disconnect();                                            // Ensure we start fresh
  WiFi.on();                                                    // Turn on Wi-Fi module
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
int  readHearBeat(){
  for (int i = 0; i<MAX_HEART_READ_ITR; i++){    //Take average of readings
    long irValue = particleSensor.getIR();
     if (checkForBeat(irValue) == true){
      Serial.println("We sensed a beat!");
      //We sensed a beat!
      long delta = millis() - lastBeat;
      lastBeat = millis();
      beatsPerMinute = 60 / (delta / 1000.0);
      if (beatsPerMinute < 255 && beatsPerMinute > 50){
        rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
        rateSpot %= RATE_SIZE; //Wrap variable
        beatAvg = 0;
        for (byte ***REMOVED*** = 0 ; ***REMOVED*** < RATE_SIZE ; ***REMOVED***++)          //Take average of readings
          beatAvg += rates[***REMOVED***];
        beatAvg /= RATE_SIZE;
      }
    }
  }
  return beatAvg;
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
int readSPO2(){
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
    #ifdef DEBUG_PRINT
    Serial.print(("i= %d  ", i)); Serial.print(F("red="));    Serial.print(redBuffer[i], DEC);
    Serial.print(F(", ir="));    Serial.println(irBuffer[i], DEC);
    #endif
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
  return int(spo2);
}

void flushSensorData(){
  spo2 = 0;
  beatAvg = 0;
  //uni***REMOVED***Time = 0;
  beatsPerMinute = 0.0;
//  writer.name("heartBeat").value(avgHeartBeat);
//  writer.name("O2Lvl").value(o2Lvl);
}

void calibrateSensor(){
  PURPLE_COLOR;
  Serial.println("---------------------------------");
  Serial.println("            Calibrating  Sensor  ");
  Serial.println("---------------------------------");
  for (int itr = 0 ; itr < 3 ; itr++){
    readHearBeat();
    readSPO2();
    Serial.print(" Sensor Calibration itr : " );
    Serial.println(itr);
  }
  flushSensorData();
  OFF_COLOR;
  
}

bool checkFiveMinutes() {
  unsigned long currentMillis = millis();

  if (sensorValRdTimeInMS > 0 && currentMillis - sensorValRdTimeInMS >= FIVE_MIN_IN_MS) {
    //reviousMillis = currentMillis;
    return true; // 5 minutes have passed
  }
  return false; // 5 minutes have not
}


// Function to check if  5 minutes have passed or sampling frequency ahs arrived 
bool checkSamplingFreq() {
  unsigned long currentMillis = millis();
  // Check if the delay has finished
  if (sensorValRdTimeInMS > 0 && currentMillis - sensorValRdTimeInMS >= measurementIntervalInMS) {
    sensorValRdTimeInMS = 0; // Reset delay timer after it finishes
    Serial.println("---------------------------------");
    Serial.println("           Sampling Freq In      ");
    Serial.println("---------------------------------");
    OFF_COLOR;
    return true;  // sampling frequency 
  }
  if (checkFiveMinutes()){
    WHITE_COLOR;
    Serial.println("---------------------------------");
    Serial.println("           5 MIN  UP             ");
    Serial.println("---------------------------------");
    return false;
  }
  return false; // Neither the delay nor 5 minutes have passed
}

struct measuringTime {
  int startTime = 6;  // 6 Am to 
  int endTime = 22;   // 10 PM Sampling Time unless changed
} samplingTime;

int setStartTime(String startTime) {
  Serial.println("---------------------------------");
  Serial.println(" CLOUD Variable StartTimeReceived");
  Serial.println("---------------------------------");
  Serial.println(startTime);
  if(startTime == ""){ return -1;}
  else{ samplingTime.startTime = startTime.toInt();
        Serial.print(" New Sampling Start Time Set : ");
        Serial.println(samplingTime.startTime);  return 1;}
}

int setEndTime(String endTime) {
  Serial.println("---------------------------------");
  Serial.println(" CLOUD Variable EndTimeReceived  ");
  Serial.println("---------------------------------");
  Serial.println(endTime);
  if(endTime == ""){ return -1;}
  else{ samplingTime.endTime = endTime.toInt();
        Serial.print(" New Sampling End Time Set : ");
        Serial.println(samplingTime.endTime);  return 1;}
}



// cloud function that sets 
int setVeasurementIntervalInMS(String sensorCaptureRate){
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
void wrStruct(int heartBeat, int O2, unsigned long uni***REMOVED***Time) {
  measurements[total_data_written].SPO2 =  O2  ;
  measurements[total_data_written].heartRate = heartBeat ;
  measurements[total_data_written].uni***REMOVED***Timestamp = uni***REMOVED***Time; 
  total_data_written = total_data_written +1;
  Serial.print("Samples Written Locally ");
  Serial.println(total_data_written);   
}

struct sensorDataStruct readStruct () {
  Serial.println("Reading data from sturct.\n");
  struct sensorDataStruct readSensorStruct;
  readSensorStruct.SPO2 = measurements[total_data_written-1].SPO2;
  readSensorStruct.heartRate= measurements[total_data_written-1].heartRate;
  readSensorStruct.uni***REMOVED***Timestamp= measurements[total_data_written-1].uni***REMOVED***Timestamp;
  return readSensorStruct;
}


// verifies time of ohe day and returns whether  it is good time to sample or not
bool isItTimeToCheckTheBeat(){
  Serial.println("---------------------------------");
  Serial.println("           Checking Time         ");
  Serial.println("---------------------------------");
  if(Time.hour() >= samplingTime.startTime && Time.hour() <= samplingTime.endTime){ // takes 24 hour format
    Serial.println("Heart Rate measurment time is valid");

     return true;
  } else {
      Serial.print("Not a valid time to take measurement, valid time is" );
      Serial.print(samplingTime.startTime );
      Serial.print(" to " );
      Serial.println(samplingTime.endTime );
      return false;
    }
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
  Particle.function("meas_period",    setVeasurementIntervalInMS);      // register the cloud 
  Particle.function("set_start_time", setStartTime);
  Particle.function("set_end_time",   setEndTime);
  Particle.function("led_on_off",     cloudLedCntrl);
  waitFor(Time.isValid, 60000);  // Wait for time to be synchronized with Particle Device Cloud (requires active connection)
  Time.zone(-7);   // az is UTC -7

}

void loop() {
  calibrateSensor();
  struct sensorDataStruct readSensorStruct;
  unsigned long  firstSampleStoredTimeLocally;
  int heartBeat = 0;
  int O2 = 0;
  time32_t uni***REMOVED***Time = 0;
  boolean Spo2status = false;
  while(1){
    switch (particleState){

      case CHK_TIME :                            // identify if it right time ot measure or not
        if(isItTimeToCheckTheBeat()){           /// may be combine the while logic with this
          particleState = MEASURE_HEART_RATE;
        } else{
          particleState = CHK_TIME;
          delay(measurementIntervalInMS);  // wait dealy time and then check the time again
        }
        break;
      // take samples for hearbeat
      case  MEASURE_HEART_RATE :
        Serial.println("Please place your inde***REMOVED*** finger on the sensor.");
        uni***REMOVED***Time = Time.now();       // time stamp for struct
        sensorValRdTimeInMS = millis();  // time for 5 mins, last sample taken  
        BLUE_COLOR;
        //digitalWrite(MY_LED, HIGH);
        Serial.println("---------------------------------");
        Serial.println("          Measuring HeartBeat    ");
        Serial.println("---------------------------------");
        heartBeat = readHearBeat();
        if ((heartBeat >= 50 && heartBeat < 255)){    // valid heart rate for living        
           particleState = MEAUSURE_O2 ;  // valid range 
           Serial.print("BPM=");      Serial.println(heartBeat);
        } else {
            particleState = MEASURE_HEART_RATE;  // dead man
        }
        
        OFF_COLOR;       
        break;
        
      // take samples for SPO2
      case  MEAUSURE_O2 :
        BLUE_COLOR;
        // digitalWrite(MY_LED, HIGH);
        Serial.println("---------------------------------");
        Serial.println("          Measuring SPO2         ");
        Serial.println("---------------------------------");
        O2 = readSPO2();
        if (((O2 > 50) && (O2 <= 100))){  // valid living SPO2
            Spo2status = true;
            Serial.print("          Measured SPO2        : ");
            Serial.println(O2);

        } else {
            Spo2status = false;
            particleState = MEAUSURE_O2;
        }

        if ( Spo2status){
            if(WiFi.ready() ){
                particleState = POST_TO_SERVER;
                Serial.println("---------------------------------");
                Serial.println("       Creating JSON payload     ");
                Serial.println("---------------------------------");
            }
            else {
                particleState =  SAVE_DATA_OFFLINE;
                OFF_COLOR;
            }
        }
        break;
      
      // post the captured data to server    
      case POST_TO_SERVER :
        createJSONPayload(heartBeat, O2 , uni***REMOVED***Time); 
        Serial.print("Sending this data to server :");
        Serial.println(t***REMOVED***Buffer);
        if( Particle.publish("ma***REMOVED***30102_data_capture_event", t***REMOVED***Buffer)){
          GREEN_COLOR;
          Serial.println("");
          Serial.println("---------------------------------");
          Serial.println("       Posted to the server      ");
          Serial.println("---------------------------------"); 
          heartBeat = 0;
          O2 = 0;
          uni***REMOVED***Time = 0;
          delay(5000);            
          OFF_COLOR;
          if (total_data_written != 0){ // post all the offline contents
            readSensorStruct = readStruct();
            O2        = readSensorStruct.SPO2;
            heartBeat = readSensorStruct.heartRate;
            uni***REMOVED***Time  = readSensorStruct.uni***REMOVED***Timestamp;
            particleState = POST_TO_SERVER;
            total_data_written = total_data_written -1;
            Serial.print("Total Contents Remaining in the Struct : ");
            Serial.println(total_data_written);
          }
          else{
            particleState = WAIT_SAMPLING_PERIOD;
            Serial.print("No local content preset ");
            Serial.println(total_data_written);
          }
        } else{
           particleState = SAVE_DATA_OFFLINE;
        }
        flushSensorData();
        break;

        // couldn't post online, now save to struct  
        case SAVE_DATA_OFFLINE : 
          YELLOW_COLOR;
          Serial.println("---------------------------------");
          Serial.println(" Couldn't post to the server     ");
          Serial.println("---------------------------------");
          if (total_data_written == 0){
            firstSampleStoredTimeLocally = millis();  // first time write
          }
          wrStruct(heartBeat, O2 , uni***REMOVED***Time);
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
        while (!checkSamplingFreq()){
          delay(100);
        }  /// wait until 5 mins e***REMOVED***pier or user delay e***REMOVED***pires
        if ( firstSampleStoredTimeLocally >= ONE_DAY_MILLIS) { // clear struct, local storaged varlue
            for (int i = 0 ; i<total_data_written; i++ ){
              //memset(&measurements[i], 0, sizeof(struct measurements));
                measurements[i].SPO2 = 0.00;
                measurements[i].heartRate = 0;
                measurements[i].uni***REMOVED***Timestamp = 0;
            }
            total_data_written = 0;
        }
        particleState =  CHECK_CONNECTIVITY;
        //particleState = CHK_TIME;
        break;
         
      case CHECK_CONNECTIVITY:
        // digitalWrite(MY_LED, LOW);
        Serial.println("---------------------------------");
        Serial.println("  Checking Wifi Connectivity      ");
        Serial.println("---------------------------------");
        if (!Particle.connected()) {
          Serial.println("Lost connection, attempting reconnect...");
          connectToWiFi();
        }
        particleState = CHK_TIME;

         
        break;
    }         
  }
}

