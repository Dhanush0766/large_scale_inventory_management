#define BLYNK_PRINT Serial 
#define BLYNK_TEMPLATE_ID "TMPL39IuX1m8Z" 
#define BLYNK_TEMPLATE_NAME "Heart Monitor" 
#define BLYNK_AUTH_TOKEN "7B3euQq0D6ElR79U2c8p-N3cQ92rAvvz" 
#include <WiFi.h>       
#include <BlynkSimpleEsp32.h>  
 
char auth[] = " BLYNK_AUTH_TOKEN "; 
char ssid[] = "iot"; 
char pass[] = "password"; 
 
const int pulsePin = A0; 
const int buzzer = 8; 
const int led = 7; 
int upperLimit = 100; 
int lowerLimit = 60; 
int prevBpm = 0; 
BlynkTimer timer; 
 
void sendHeartRate() { 
  int sensorValue = analogRead(pulsePin); 
  int bpm = map(sensorValue, 0, 1023, 50, 120); 
  bpm = (bpm + prevBpm) / 2; 
  prevBpm = bpm; 
 
  Blynk.virtualWrite(V0, bpm);  
 
 
  if (bpm < lowerLimit || bpm > upperLimit) { 
    digitalWrite(led, HIGH); 
    tone(buzzer, 1000, 200); 
  }  
else { 
    digitalWrite(led, LOW); 
    noTone(buzzer); 
  } 
} 
 
void setup() { 
  Serial.begin(9600); 
  Blynk.begin(auth, ssid, pass); 
  pinMode(buzzer, OUTPUT); 
  pinMode(led, OUTPUT); 
  timer.setInterval(1000L, sendHeartRate); 
} 
 
void loop() { 
  Blynk.run(); 
  timer.run(); 
} 
