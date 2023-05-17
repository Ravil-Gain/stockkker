import Diagram from "@/components/Diagram";
import { ChartData } from "chart.js/auto";
import api from "../woocommerce/woocommerce";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const p = api
      .get("products", {
        per_page: 50, // 50 products per page
      })
      .then((value) => {
        console.log(value);
      });
  }, []);

  const data: ChartData = {
    labels: [
      "Hurmaa",
      "Kiivi",
      "Churchkhella",
      "Õunad",
      "Aprikoos",
      "Hurmaa",
      "Kiivi",
      "Churchkhella",
      "Õunad",
      "Aprikoos",
      "Hurmaa",
      "Kiivi",
      "Churchkhella",
      "Õunad",
      "Aprikoos",
      "Hurmaa",
      "Kiivi",
      "Churchkhella",
      "Õunad",
      "Aprikoos",
    ],
    datasets: [
      {
        label: "Employee",
        backgroundColor: "#caf270",
        barThickness: 50,
        data: [
          12, 59, 5, 56, 58, 12, 59, 5, 56, 58, 12, 59, 5, 56, 58, 12, 59, 5,
          56, 58,
        ],
        borderRadius: {
          bottomLeft: 3,
          topLeft: 3,
          topRight: 3,
          bottomRight: 3,
        },
      },
      {
        label: "Government",
        backgroundColor: "#008d93",
        barThickness: 50,
        data: [
          12, 59, 5, 56, 58, 12, 59, 5, 56, 58, 12, 59, 5, 56, 58, 12, 59, 5,
          56, 58,
        ],
        borderRadius: {
          bottomLeft: 3,
          topLeft: 3,
          topRight: 3,
          bottomRight: 3,
        },
      },
    ],
  };

  return (
    <>
      <h1 className="mx-auto mt-10 text-xl font-semibold capitalize ">
        line Chart
      </h1>
      <div className="overflow-x-scroll">
        <div className="relative">
          <Diagram data={data} />
        </div>
        {/* <canvas id="myChartAxis" height="300" width="0"></canvas> */}
      </div>
    </>
  );
}
