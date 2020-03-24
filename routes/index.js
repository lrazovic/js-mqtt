var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");

var sensorSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  temperature: Number,
  humidity: Number,
  rain_height: Number,
  wind_direction: Number,
  wind_intensity: Number
});

var Sensor = mongoose.model("Sensor", sensorSchema);

router.get("/", async function(req, res, next) {
  const query = Sensor.find();
  const docs = await query; // Get the documents
  res.json(docs);
});

module.exports = router;
