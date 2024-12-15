#include "Particle.h"

// Declare a global variable to hold the random number
int randNum = 0;

int simpleVar = 55;
// Function to generate a random number between 0 and 255
int generateRandomNumber() {
    return random(0, 256); // Particle's random(min, ma***REMOVED***) generates a random number between min and ma***REMOVED***
}

// Function to publish a random number event
void publishRandomNumberEvent() {
   // randNum = generateRandomNumber();  // Generate random number

    // Publish the event with the random number as a string
   // Particle.publish("randNum", randNum);
  //  delay(5000);
    Particle.publish("simpleVar", string(simpleVar));  // E***REMOVED***pose simpleVar to the cloud
}

void setup() {
    // Start the Serial Monitor for debugging
    Serial.begin(9600);
    waitFor(Serial.isConnected, 10000); // Wait for the serial connection
    
    // Print initial message
    Serial.println("Publishing Random Number Event...");
    //Particle.variable("randNum", randNum);
    Particle.variable("simpleVar", simpleVar);  // E***REMOVED***pose simpleVar to the cloud
    // Particle.variable("randNum", randNum);
   // // E***REMOVED***pose the randNum variable to the Particle Cloud
   /* if (Particle.variable("randNum" randNum) == false){
      // variable not registered!
      Serial.println("Randon Num is not registered");
     }

    // Publish the random number event
//    publishRandomNumberEvent();
//    */
}

void loop() {
    // You can repeatedly publish the event, for e***REMOVED***ample, every 10 seconds
    delay(10000); // Wait for 10 seconds
    simpleVar++;
    // Publish the random number event again
    publishRandomNumberEvent();
}

