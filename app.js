var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var app = express();
var mqtt = require("mqtt");
var mongoose = require("mongoose");
var indexRouter = require("./routes/index");
var username = require("./credentials.js");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// CORS to allow localhost REST operations
app.use(cors());

//app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// MongoDB connection via mongoose
mongoose.connect("mongodb://localhost/sensors", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
var Sensor = mongoose.model("Sensor", sensorSchema);
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

//MQTT connetion and Subscribe
const clientId =
  "mqttjs_" +
  Math.random()
    .toString(16)
    .substr(2, 8);

// Local MQTT broker and device (NOT GATEWAY) username
var client = mqtt.connect("mqtt://127.0.0.1", {
  username: username,
  clientId: clientId
});

client.on("error", function(err) {
  console.error(err);
  client.end();
});

client.on("connect", function() {
  client.subscribe("v1/devices/me/attributes/+", { qos: 0 });
  client.publish(
    "v1/devices/me/attributes/request/2",
    '{"clientKeys":"humidity,temperature,rain_height,wind_direction,wind_intensity"}'
  );
});

// Serialize and store every new message received
client.on("message", function(topic, message, packet) {
  var obj = JSON.parse(message.toString())["client"];
  var msg = new Sensor(obj);
  msg.save(function(err, _) {
    if (err) return console.error(err);
  });
});

module.exports = app;
