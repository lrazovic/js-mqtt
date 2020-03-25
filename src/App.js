import React, { useState } from "react";
import useAxios from "axios-hooks";

import CanvasJSReact from "./canvasjs.react";
//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function App() {
  var humidityPoints = [];
  var temperaturePoints = [];
  var windDirectionPoints = [];
  var windIntensityPoints = [];
  var rainHeightPoints = [];
  const [username, setUsername] = useState("");
  const [device, setDevice] = useState("");
  const [{ data, loading, error }, refetch] = useAxios(
    "http://localhost:8080/" + device
  );
  const makeRequest = e => {
    e.preventDefault();
    setDevice(username);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  const wind_intensity = {
    theme: "light2",
    title: {
      text: "Wind Intensity"
    },
    axisY: {
      title: "Wind Intensity in m/s",
      includeZero: false
    },
    data: [
      {
        type: "line",
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "##,##%",
        dataPoints: windIntensityPoints
      }
    ]
  };
  const rain_height = {
    theme: "light2",
    title: {
      text: "Rain Height"
    },
    axisY: {
      title: "Rain Height in mm/h",
      includeZero: false
    },
    data: [
      {
        type: "line",
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "##,##%",
        dataPoints: rainHeightPoints
      }
    ]
  };
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
  const wind_direction = {
    theme: "light2",
    title: {
      text: "Wind Direction "
    },
    axisY: {
      title: "Wind Direction in degrees",
      postfix: "%",
      includeZero: false
    },
    data: [
      {
        type: "line",
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "##,##%",
        dataPoints: windDirectionPoints
      }
    ]
  };

  const temperature = {
    theme: "light2",
    title: {
      text: "Temperature"
    },
    axisY: {
      title: "Temperature in C",
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
    let date = new Date(data[i].created);
    humidityPoints.push({
      x: date,
      y: data[i].humidity
    });
    temperaturePoints.push({
      x: date,
      y: data[i].temperature
    });
    windDirectionPoints.push({
      x: date,
      y: data[i].wind_direction
    });
    rainHeightPoints.push({
      x: date,
      y: data[i].rain_height
    });
    windIntensityPoints.push({
      x: date,
      y: data[i].wind_intensity
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
      <CanvasJSChart options={temperature} />
      <CanvasJSChart options={humidity} />
      <CanvasJSChart options={wind_direction} />
      <CanvasJSChart options={wind_intensity} />
      <CanvasJSChart options={rain_height} />
    </div>
  );
}
