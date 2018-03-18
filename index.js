'use strict';

var request = require("request");
var Service, Characteristic;

module.exports = function(homebridge) {
	Service = homebridge.hap.Service;
	Characteristic = homebridge.hap.Characteristic;

	homebridge.registerAccessory("homebridge-mcu-lamp", "McuLamp", McuLampAccessory);
}

function McuLampAccessory(log, config) {
	this.log = log;
	this.name = config["name"];
	this.mcuIP = config["ip"];
	this.manufacturer = config["manufacturer"] || "ESP8266 Relay Lamp Switch";
	this.model = config["model"] || "Lamp Relay Switch";
	this.serialnumber = config["serialnumber"] || "1234567890";
	this.firmwarerevision = config["firmwarerevision"] || "1.0.1";
}

McuLampAccessory.prototype.identify = function(callback) {
	this.log('Identify requested!');
    callback();
};

McuLampAccessory.prototype.getPowerState = function(callback) {
	this.log("Getting State");
	request.get({
		url: 'http://' + this.mcuIP + '/status'
	}, function(err, response, body) {
		var status = body == '1' ? 1 : 0;
		callback(null, status);
	}.bind(this));
}

McuLampAccessory.prototype.setPowerState = function(state, callback) {
	var url = state ? "1": "0";
	request.get({
		url: 'http://' + this.mcuIP + '/relay?state=' + url
	}, function(err, response, body) {
		callback(null, state);
	}.bind(this));
},

McuLampAccessory.prototype.getServices = function() {
	
	var informationService = new Service.AccessoryInformation();

  informationService
    .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
    .setCharacteristic(Characteristic.Model, this.model)
    .setCharacteristic(Characteristic.SerialNumber, this.serialnumber)
	  .setCharacteristic(Characteristic.FirmwareRevision, this.firmwarerevision);
	
	var lightbulbService = new Service.Lightbulb(this.name);

	lightbulbService
		.getCharacteristic(Characteristic.On)
		.on('get', this.getPowerState.bind(this))
		.on('set', this.setPowerState.bind(this));
	
	return [informationService, lightbulbService];
}
