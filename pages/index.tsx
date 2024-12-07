// import { ChartData } from "chart.js/auto";
// import { getOrdersSnapshot } from "@/firebase/functions/orders";
// import { getProducts, getProductsSnapshot } from "@/firebase/functions/product";
// import { onSnapshot } from "firebase/firestore";
// import { useEffect, useState } from "react";

export default function Home() {
  // const [products, setProducts] = useState([]);
  // const [isLoading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   getProducts().then((dataProducts) => {
  //     // setProducts(dataProducts);
  //     setLoading(false);
  //   });

  //   // wooCommerce.get("products", { per_page: 50 }).then((data) => {
  //   //   setProducts(data.data);
  //   //   setLoading(false);
  //   // });
  // }, []);

  // const data: ChartData = {
  //   labels: [
  //     "Hurmaa"
  //   ],
  //   datasets: [
  //     {
  //       label: "Employee",
  //       backgroundColor: "#caf270",
  //       barThickness: 50,
  //       data: [
  //         12
  //       ],
  //       borderRadius: {
  //         bottomLeft: 3,
  //         topLeft: 3,
  //         topRight: 3,
  //         bottomRight: 3,
  //       },
  //     },
  //     {
  //       label: "Government",
  //       backgroundColor: "#008d93",
  //       barThickness: 50,
  //       data: [
  //         6
  //       ],
  //       borderRadius: {
  //         bottomLeft: 3,
  //         topLeft: 3,
  //         topRight: 3,
  //         bottomRight: 3,
  //       },
  //     },
  //   ],
  // };

  return (
    <>
      {/* <h1 className="mx-auto mt-10 text-xl font-semibold capitalize ">
        line Chart
      </h1> */}

      <div className="overflow-x-scroll">
        <div className="relative">
          {/* <Bar current={0} order={0} /> */}
          <h1>BarBuh</h1>
        </div>
        {/* <canvas id="myChartAxis" height="300" width="0"></canvas> */}
      </div>
    </>
  );
}
