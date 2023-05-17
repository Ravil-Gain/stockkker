import { useEffect } from "react";
import Chart, { ChartData } from "chart.js/auto";

interface IDiagramData {
  data: ChartData;
}

export default function Diagram(diagramData: IDiagramData) {
  const { data } = diagramData;
  useEffect(() => {
    const ctx = document.getElementById("myChart")?.getContext("2d");
    const myChart = new Chart(ctx, {
      type: "bar",
      data,
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          x: {
            stacked: true,
          },
          y: { stacked: true },
        },
      },
    });

    return () => {
      myChart.destroy();
    };
  }, []);

  return (
    <canvas
      className="relative"
      aria-label="chart"
      height="550"
      width="580"
      id="myChart"
    ></canvas>
  );
}
//{`${data.datasets.length * 30}px`}
