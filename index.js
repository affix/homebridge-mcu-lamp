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

  this.service = new Service.Switch(this.name);

  this.service
    .getCharacteristic(Characteristic.On)
    .on('get', this.getState.bind(this))
    .on('set', this.setState.bind(this));
}

McuLampAccessory.prototype.getState = function(callback) {
  this.log("Getting State");
  request.get({
      url: 'http://'+ this.mcuIP +'/status'
  }, function(err, response, body) {
      var status = body == '1' ? 1 : 0;
      callback(null, status);
  }.bind(this));
}

McuLampAccessory.prototype.setState = function(state, callback) {
  var url = state ? "1": "0";
  request.get({
      url: 'http://'+ this.mcuIP + '/relay?state=' + url
  }, function(err, response, body) {
      callback(null, state);
  }.bind(this));
},

McuLampAccessory.prototype.getServices = function() {
  return [this.service];
}
