import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const PieChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const pieData = data.map((item) => item.percent);
    const pieLabels = data.map((item) => item.label);
    const backgroundColors = data.map((item) => {
      const color = item.color;
      const rgbaColor = `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.7)`;
      return rgbaColor;
    });

    const pieChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: pieLabels,
        datasets: [
          {
            data: pieData,
            backgroundColor: backgroundColors,
            borderColor: "rgba(255, 255, 255, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: "white",
              font: {
                size: 15,
              },
            },
          },
        },
      },
    });

    return () => {
      pieChart.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default PieChart;
