import React, { useState } from "react";
import useAxios from "axios-hooks";
import defaultDevice from "./credentials";

import CanvasJSReact from "./canvasjs.react";
//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function App() {
  var humidityPoints = [];
  var temperaturePoints = [];
  const [username, setUsername] = useState("");
  const [device, setDevice] = useState(defaultDevice);
  const [{ data, loading, error }, refetch] = useAxios(
    "http://localhost:8080/" + device
  );
  const makeRequest = e => {
    e.preventDefault();
    setDevice(username);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const humidity = {
    theme: "light2",
    title: {
      text: "Humidity"
    },
    axisY: {
      title: "Humidity in %",
      postfix: "%",
      includeZero: false
    },
    data: [
      {
        type: "line",
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "##,##%",
        dataPoints: humidityPoints
      }
    ]
  };
  const temperature = {
    theme: "light2",
    title: {
      text: "Temperature"
    },
    axisY: {
      title: "Humidity in %",
      postfix: "%",
      includeZero: false
    },
    data: [
      {
        type: "line",
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "##,##%",
        dataPoints: temperaturePoints
      }
    ]
  };
  for (var i = 0; i < data.length; i++) {
    humidityPoints.push({
      x: new Date(data[i].created),
      y: data[i].humidity
    });
  }
  for (i = 0; i < data.length; i++) {
    temperaturePoints.push({
      x: new Date(data[i].created),
      y: data[i].temperature
    });
  }
  return (
    <div>
      <form onSubmit={makeRequest}>
        <p>Username {device}</p>
        <input
          placeholder="username"
          onChange={event => setUsername(event.target.value)}
        />
        <button type="submit">Select Device</button>
      </form>

      <button onClick={refetch}>refetch</button>
      <CanvasJSChart options={humidity} />
      <CanvasJSChart options={temperature} />
    </div>
  );
}
