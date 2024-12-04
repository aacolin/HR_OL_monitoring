#include "Particle.h"

int simpleVar = 42;

void setup() {
    Particle.variable("simpleVar", simpleVar);  // E***REMOVED***pose simpleVar to the cloud
}

void loop() {
    delay(10000);  // Wait for 10 seconds before doing anything
}

