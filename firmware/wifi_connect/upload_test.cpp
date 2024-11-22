//#include "Particle.h"
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"



// Define server and endpoint
//const char* server = "192.168.50.71";
//const char* endpoint = "/sensor/data";

// Define the JSON payload
String payload = "{\"avgHeartBeat\":12345, \"o2Lvl\":95, \"deviceName\":\"Argon\"}";



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

TCPClient client;
MAX30105 particleSensor;
// wifi and server setting
const char* server = "192.168.50.71"; // Replace with your local server IP this is my usb interface 
const int port = 3000;                // Port number
const char* ssid = SSID;       // Replace with your Wi-Fi SSID
const char* password = PASSWORD; // Replace with your Wi-Fi password

//heart beat sesor setting
const byte POWER_LEVEL = 0***REMOVED***FF; //  50.0mA - Presence detection of ~12 inch
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

float beatsPerMinute;
int beatAvg;

void m***REMOVED***30102Setup(){
    //Use default I2C port, 400kHz speed
    if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
        Serial.println("MAX3010X was not found. Please check wiring/power. ");
        while (1);
    }
    Serial.println("Place your inde***REMOVED*** finger on the sensor with steady pressure.");
    particleSensor.setup(POWER_LEVEL, SAMPLE_AVG, LED_MODE, SAMPLE_RATE, PULSE_WIDTH, ADC_RANGE); 
    particleSensor.setPulseAmplitudeRed(0***REMOVED***0A); //Turn Red LED to low to indicate sensor is running
    particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED
}

void sensorDataConsolePrint(long irValue){
  Serial.print("IR=");         Serial.print(irValue);
  Serial.print(", BPM=");      Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");  Serial.print(beatAvg);
  Serial.println();
}

void connectToWiFi() {
    WiFi.disconnect(); // Ensure we start fresh
    WiFi.on();         // Turn on Wi-Fi module
    // SYNTAX

    // Connects to a network with a specified authentication procedure.
    // Options are WPA2, WPA, or WEP.
    //WiFi.setCredentials("My_Router", "wepistheworst", WEP);
    WiFi.setCredentials(ssid, password, WPA2);
    WiFi.connect();

    while (!WiFi.ready()){
        Serial.println("Connecting . . .");
        delay(100);
  }

  Serial.println(WiFi.localIP());
  //Particle.connect();}
}

String createJSONPayload(int avgHeartBeat, float o2Lvl, String deviceName) {
    char buf[256]; // Buffer for the JSON payload
    memset(buf, 0, sizeof(buf));
    JSONBufferWriter writer(buf, sizeof(buf) - 1);

    writer.beginObject(); // Start JSON object
    writer.name("Avg heartBeat").value(avgHeartBeat);
    writer.name("O2 Lvl").value(o2Lvl);
    writer.name("Device Name").value(deviceName);
    writer.endObject(); // End JSON object

    return String(buf); // Convert buffer to String for easy handling
}


void readSensor(){
  Serial.println("\nReading Sensor.");
  long irValue = particleSensor.getIR();
  if (checkForBeat(irValue) == true){
   //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();
    beatsPerMinute = 60 / (delta / 1000.0);
    if (beatsPerMinute < 255 && beatsPerMinute > 20){
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable
      //Take average of readings
      beatAvg = 0;
      for (byte ***REMOVED*** = 0 ; ***REMOVED*** < RATE_SIZE ; ***REMOVED***++){
        beatAvg += rates[***REMOVED***];
      }
      beatAvg /= RATE_SIZE;
    }
  }
  sensorDataConsolePrint(irValue );
  if (irValue < 50000)
    Serial.print(" No finger?");
    particleSensor.setPulseAmplitudeGreen(0***REMOVED***0A); //Turn off Green LED
}

void sendPostRequest() {
    readSensor();
    Serial.println("\nInside sendPostRequest() Loop");
    if (client.connect(server, port)) {
        Serial.println("Connected to server.");

        // Create JSON payload using `JSONBufferWriter`
        //int a = 42;
       // float b = 3.14;
        const String deviceName = "Particle Argon";
        String jsonPayload = createJSONPayload(beatAvg, 0.0 , deviceName);
        //Serial.println(jsonPayload);

        //String payload = "{\"key\": \"value\"}";  // Make sure this is valid JSON

        //String payload = "{\"Avg heartBeat\": avgHeartBeat,\"O2 Lvl\": 0.0,\"Device Name\": \"Argon\"}";  // Make sure this is valid JSON

        String payload = "{\"Avg heartBeat\": " + String(beatAvg) + 
                 ", \"O2 Lvl\": " + String(0.0, 1) + // Using 1 digit of precision for float
                 ", \"Device Name\": \"" + deviceName + "\"}";


        Serial.println(payload);
        // Construct HTTP POST request
        String postRequest = "POST /sensor/data HTTP/1.1\r\n";
        postRequest += "Host: " + String(server) + "\r\n";
        postRequest += "Content-Type: application/json\r\n";
        postRequest += "Content-Length: " + String(payload.length()) + "\r\n";
        postRequest += "Connection: close\r\n\r\n";
        //postRequest += jsonPayload;
        postRequest += payload;

Serial.println(postRequest);  // Debug: Print the request to verify it
//client.print(postRequest);    // Send request
 Serial.println("\n\n\n\n");
        // Send POST request
        client.print(postRequest);
        // Read response
        Serial.println("Server response:");
        unsigned long startTime = millis();
        while ((client.connected() || client.available()) && millis() - startTime < 30000) {
              //  Serial.print("Stuck in Server Response");

            if (client.available()) {
                char c = client.read(); //read byte at time
                Serial.print(c);
                //Serial.print("client.available()");
              //  lastDataTime = millis();  // Reset the timer when data is received

            }
        }

        client.stop(); // Disconnect from server
        Serial.println("\nDisconnected from server.");
    } else {
        Serial.println("Failed to connect to server.");
    }
}

void setup() {
    Serial.begin(115200);
    //waitFor(Serial.isConnected, 10000); // Wait for serial connection
    //connectToWiFi(); // Ensure device is connected to Wi-Fi
    WiFi.disconnect(); // Ensure we start fresh
    WiFi.on();         // Turn on Wi-Fi module
    WiFi.setCredentials(ssid, password, WPA2);
    WiFi.connect();
    Serial.print("Connecting . . .");

    // SYNTAX
    //while (!WiFi.ready()){
    unsigned long startTime = millis();
    while (!WiFi.ready() && millis() - startTime < 30000) {
      Serial.print(" .");
     
      delay(100);
    }
    Serial.println();
    Serial.println(WiFi.localIP());
    m***REMOVED***30102Setup();
        // sendPostRequest(); // Send the POST request
}

void loop() {
    // Repeat POST request every 10 seconds
    delay(10000);
    sendPostRequest();
   // httpPost();
}


/*
void httpPost() {
  // Start serial communication for debugging
  // Define the server and URL
  const char *host = "localhost";  // Replace with the server's IP or domain
  const char *url = "/sensor/data";  // The API endpoint
  int port = 3000;  // The port number
  
  // JSON payload to send in the POST request
  String payload = "{\"avgHeartBeat\":12345, \"o2Lvl\":95, \"deviceName\":\"Argon\"}";
  
  // Create headers for the request
  String header = "Content-Type: application/json";

  // Send the POST request
  int statusCode = http.post(server, port, url, header, payload, response);

  // Check if the request was successful
  if (statusCode == 200) {
    Serial.println("POST request successful");
    Serial.println(response.body);  // Print the response body for debugging
  } else {
    Serial.print("Error: ");
    Serial.println(response.body);  // Print the response body for debugging
    Serial.println(statusCode);  // Print error code if request failed
  }
}
*/