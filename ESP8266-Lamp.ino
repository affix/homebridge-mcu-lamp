#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "<APNAME>";
const char* password = "<APPASSWD>";

// HTTP server will listen at port 80
ESP8266WebServer server(80);

// Global Variables
const int relay = 2; // Pin D4 on my NodeMCU
int curstate = 1;

/*
*  Handle Relay State Change
*/
void handle_relay() {
  // get the value of request argument "state" and convert it to an int
  int state = server.arg("state").toInt();

  curstate = state; // Set the current state
  digitalWrite(relay, state); // Set relay state
  server.send(200, "text/plain",  ((state)?"false":"true")); // Return True / False
}

/*
*  Handle Request for Current State
*/
void handle_state() {
  server.send(200, "text/plain", ((curstate)?"1":"0"));
}


void setup(void) {

  Serial.begin(115200);
  Serial.println("");

  // Set Relay mode
  pinMode(relay, OUTPUT);
  // Connect to WiFi network
  WiFi.begin(ssid, password);

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());
  // And as regular external functions:
  server.on("/state", handle_state);
  server.on("/relay", handle_relay);

  // Start the server
  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
  // check for incomming client connections frequently in the main loop:
  server.handleClient();
}
