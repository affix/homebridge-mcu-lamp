
# "McuLamp" Plugin

Example config.json:

 ```
 "accessories": [
   {
       "accessory": "McuLamp",
       "name": "Node Lamp",
       "ip" : "192.168.0.29",
       "manufacturer" : "Your manufacturer",
       "model" : "Your model",
       "serialnumber" : "Your serial number",
       "firmwarerevision" : "Your firmware revision"
   }
 ],

```

> manufacturer, model, serialnumber, firmwarerevision are optional


This Plugin lets you control a Relay attached to a pin on an ESP8266 Device, For example I use a NodeMCU with an ESP-12E

Wiring
------

Relay vin <-> ESP 3v3
Relay gnd <-> ESP gnd
Relay in  <-> ESP Pin 2 (D4 on NodeMCU)
