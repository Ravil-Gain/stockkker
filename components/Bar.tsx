// import { useEffect } from "react";
// import Chart, { ChartData } from "chart.js/auto";

// interface IDiagramData {
  
//   current: number;
//   order: number;
// }

// export default function Bar(diagramData: IDiagramData) {
//   // const { data } = diagramData;

//   useEffect(() => {
//     const ctx = document.getElementById("myChart")?.getContext("2d");
//     const myChart = new Chart(ctx, {
//       type: 'bar',
//       data: {
//         labels: [''],
//         datasets: [{
//             label: "currentAmount",
//             data: [12],
//             backgroundColor: "#bbb",
//             borderColor: "#f00",
//             borderWidth: 2,
//             borderSkipped: 'top',
//             borderRadius: 30,
//             barPercentage: 0.5
//           },
//           {
//             label: "remaining",
//             data: [3],
//             backgroundColor: "#fff",
//             borderColor: "#f00",
//             borderWidth: 2,
//             borderSkipped: 'bottom',
//             borderRadius: 30,
//             barPercentage: 0.5
//           },
//         ]
//       },
//       options: {
        
//         plugins: {
//           legend: {
//             display: false
//           },
//           tooltip: {
//             displayColors: false
//           }
//         },
//         scales: {
//           y: {
//             display: false,
//             stacked: true
//           },
//           x: {
//             display: false,
//             stacked: true
//           }
//         }
//       }
//     });

//     return () => {
//       myChart.destroy();
//     };
//   }, []);

//   return (
//     <canvas
//       className="relative"
//       aria-label="chart"
//       height="50"
//       width="40"
//       id="myChart"
//     ></canvas>
//   );
// }
// //{`${data.datasets.length * 30}px`}
