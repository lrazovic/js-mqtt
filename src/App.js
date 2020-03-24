import React from "react";
import useAxios from "axios-hooks";

import CanvasJSReact from "./canvasjs.react";
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default function App() {
  var dataPoints = [];
  const [{ data, loading, error }, refetch] = useAxios("http://localhost:8080");
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  const options = {
    theme: "light2",
    title: {
      text: "Humidity"
    },
    axisY: {
      title: "Humidity in %",
      prefix: "%",
      includeZero: false
    },
    data: [
      {
        type: "line",
        xValueFormatString: "MMM YYYY",
        yValueFormatString: "##,##%",
        dataPoints: dataPoints
      }
    ]
  };
  for (var i = 0; i < data.length; i++) {
    dataPoints.push({
      x: new Date(data[i].created),
      y: data[i].humidity
    });
  }
  return (
    <div>
      <button onClick={refetch}>refetch</button>
      <CanvasJSChart options={options} />
    </div>
  );
}
