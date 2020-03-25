const mqtt = require("mqtt");
const Sensor = require("./sensorSchema");

class MqttHandler {
  //MQTT connetion and Subscribe
  constructor(username) {
    this.mqttClient = null;
    this.sensor = null;
    this.host = "mqtt://0.0.0.0";
    this.clientId = "mqttjs_" + username;
    this.username = username; // mqtt credentials if these are needed to connect
  }

  connect() {
    // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
    this.mqttClient = mqtt.connect(this.host, {
      port: 1883,
      username: this.username,
      clientId: this.clientId
    });

    // Mqtt error calback
    this.mqttClient.on("error", err => {
      console.log(err);
      this.mqttClient.end();
    });

    // Connection callback
    this.mqttClient.on("connect", () => {
      this.mqttClient.subscribe("v1/devices/me/attributes/response/+", {
        qos: 0
      });
      this.mqttClient.publish(
        "v1/devices/me/attributes/request/3",
        '{"clientKeys":"humidity,temperature,rain_height,wind_direction,wind_intensity"}'
      );
    });

    this.mqttClient.on("message", (topic, message) => {
      var obj = JSON.parse(message.toString())["client"];
      obj.username = this.username;
      console.log(obj);
      var msg = Sensor(obj);
      msg.save(function(err, _) {
        if (err) return console.error(err);
      });
    });
  }
}

module.exports = MqttHandler;
