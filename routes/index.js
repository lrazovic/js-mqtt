var express = require("express");
var router = express.Router();
var mqttHandler = require("../mqttHandler");
var Sensor = require("../sensorSchema");

router.get("/:username", function(req, res) {
  const deviceUsername = req.params.username;
  var mqttClient = new mqttHandler(deviceUsername);
  mqttClient.connect();
  Sensor.find({ username: deviceUsername }, (err, sensors) => {
    res.json(sensors);
  });
});

module.exports = router;
