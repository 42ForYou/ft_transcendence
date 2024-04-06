import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");
    const chartData = data.map((item) => item.percent);
    const chartLabels = data.map((item) => item.label);
    const backgroundColors = data.map((item) => item.color);

    // 전체 데이터 합 계산
    const total = chartData.reduce((acc, cur) => acc + cur, 0);

    const barChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartLabels,
        datasets: [
          {
            label: "Statistics",
            data: chartData,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map((color) => `${color}99`),
            borderWidth: 1,
            barThickness: 20,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = "";
                if (context.parsed.y !== null) {
                  // 각 데이터 포인트에 대한 퍼센테이지 계산
                  const percentage = ((context.parsed.y / total) * 100).toFixed(2);
                  label += `${context.raw} (${percentage}%)`;
                }
                return label;
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                // Y축의 퍼센테이지도 전체 합을 기준으로 계산
                const percentage = ((value / total) * 100).toFixed(0);
                return `${percentage}%`;
              },
              stepSize: 0.2,
            },
          },
        },
      },
    });

    return () => {
      barChart.destroy();
    };
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default BarChart;
