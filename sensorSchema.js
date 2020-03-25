const mongoose = require("mongoose");

sensorSchema = new mongoose.Schema({
  created: {
    type: Date,
    default: Date.now
  },
  username: String,
  temperature: Number,
  humidity: Number,
  rain_height: Number,
  wind_direction: Number,
  wind_intensity: Number
});

module.exports = mongoose.model("Sensor", sensorSchema);
