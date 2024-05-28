import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

import "./Statistic.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

export function Statistic({ data, colors }) {
  const [chartSettings, setChartSettings] = useState({
    itemsNames: [],
    itemsListsSize: 0,
    backgroundColorsRGBA: [],
    itemsListsSize: [],
  });

  function hexToRGB(hex, alpha) {
    let r = "",
      g = "",
      b = "";
    if (hex) {
      (r = parseInt(hex.slice(1, 3), 16)),
        (g = parseInt(hex.slice(3, 5), 16)),
        (b = parseInt(hex.slice(5, 7), 16));
      if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
      } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
      }
    }
  }

  useEffect(() => {
    if (data) {
      let newData = data.map((item) => {
        if (!item.color.hex) {
          item.color.hex = colors.find(
            (color) => color.name === item.color.name
          ).hex;
        }
        return item;
      });
      setChartSettings({
        itemsNames: newData.map((item) => item.name),
        itemsListsSize: newData.map((item) => item.tasks.length),
        backgroundColorsRGBA: newData.map((item) =>
          hexToRGB(item.color.hex, 0.4)
        ),
        borderColorsRGBA: newData.map((item) => hexToRGB(item.color.hex, 1)),
      });
    }
  }, [data]);

  const chartData = {
    labels: chartSettings.itemsNames,
    datasets: [
      {
        label: "Количество задач",
        data: chartSettings.itemsListsSize,
        backgroundColor: chartSettings.backgroundColorsRGBA,
        borderColor: chartSettings.borderColorsRGBA,
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="statistic">
      <h2>Статистика</h2>
      <div className="statistic__chart">
        {data.length ? (
          <Pie data={chartData} />
        ) : (
          <p>Добавьте категории и задачи, чтобы увидеть статистику</p>
        )}
      </div>
    </div>
  );
}
