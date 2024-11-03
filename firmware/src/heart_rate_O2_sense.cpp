/* 
 * Project myProject
 * Author: Your Name
 * Date: 
 * For comprehensive documentation and e***REMOVED***amples, please visit:
 * https://docs.particle.io/firmware/best-practices/firmware-template/
 */

// Include Particle Device OS APIs
#include "Particle.h"
#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"


// Let Device OS manage the connection to the Particle Cloud
// SYSTEM_MODE(AUTOMATIC);

// Run the application and system concurrently in separate threads
// SYSTEM_THREAD(ENABLED);

// Show system, cloud connectivity, and application logs over USB
// View logs with CLI using 'particle serial monitor --follow'
// SerialLogHandler logHandler(LOG_LEVEL_INFO);

MAX30105 particleSensor;

const byte RATE_SIZE = 4; //Increase this for more averaging. 4 is good.
byte rates[RATE_SIZE]; //Array of heart rates
byte rateSpot = 0;
long lastBeat = 0; //Time at which the last beat occurred

float beatsPerMinute;
int beatAvg;

void setup()
{
  Serial.begin(115200);
  Serial.println("Initializing...");
  pinMode(D7, OUTPUT);
  // Initialize sensor
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) //Use default I2C port, 400kHz speed
  {
    Serial.println("MAX30105 was not found. Please check wiring/power. ");
    while (1);
  }
  Serial.println("Place your inde***REMOVED*** finger on the sensor with steady pressure.");
    //  pinMode(led2, OUTPUT);
    //  pinMode(photo_reg, INPUT);

  particleSensor.setup(); //Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0***REMOVED***0A); //Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); //Turn off Green LED
}

void loop()
{
    digitalWrite(D7, HIGH);
  long irValue = particleSensor.getIR();

  if (checkForBeat(irValue) == true)
  {
    //We sensed a beat!
    long delta = millis() - lastBeat;
    lastBeat = millis();

    beatsPerMinute = 60 / (delta / 1000.0);

    if (beatsPerMinute < 255 && beatsPerMinute > 20)
    {
      rates[rateSpot++] = (byte)beatsPerMinute; //Store this reading in the array
      rateSpot %= RATE_SIZE; //Wrap variable

      //Take average of readings
      beatAvg = 0;
      for (byte ***REMOVED*** = 0 ; ***REMOVED*** < RATE_SIZE ; ***REMOVED***++)
        beatAvg += rates[***REMOVED***];
      beatAvg /= RATE_SIZE;
    }
  }

  Serial.print("IR=");
  Serial.print(irValue);
  Serial.print(", BPM=");
  Serial.print(beatsPerMinute);
  Serial.print(", Avg BPM=");
  Serial.print(beatAvg);
  Serial.println();
  if (irValue < 50000)
    Serial.print(" No finger?");
  delay(1000);  
  digitalWrite(D7, LOW);
  delay(1000);  
}

