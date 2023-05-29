import wooCommerce from "@/woocommerce/woocommerce";
import { useEffect, useState } from "react";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    wooCommerce.get("products", { per_page: 50 }).then((data) => {
      setProducts(data.data);
      setLoading(false);
      console.log(data.data);
    });
  }, []);

  return (
    <>
      <h1 className="mx-auto mt-10 text-xl font-semibold capitalize ">Admin</h1>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 place-items-center">
          {products &&
            products.map((product, index) => (
              <div key={index} className="flex flex-col items-center justify-center h-40 w-40 bg-white border-8 border-sky-500 m-2 p-2">
                 <img alt={product.name} src={product.images[0]?.src} className="object-cover h-20 w-20"></img>
                 <div className="text-xs text-center"> { product.name} </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
