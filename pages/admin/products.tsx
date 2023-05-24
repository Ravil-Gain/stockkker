import ConsumablesForm from "@/components/consumables/ConsumablesForm";
import ProductsForm from "@/components/products/ProductsForm";
import { Loading } from "@/components/ui/Loading";
import { IConsumable } from "@/firebase/firestore/consumable";
import { IWooProduct } from "@/firebase/firestore/wooProduct";
import { getConsumables } from "@/firebase/functions/consumables";
import { getProducts } from "@/firebase/functions/product";
import wooCommerce from "@/woocommerce/woocommerce";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [wooProducts, setWooProducts] = useState<IWooProduct[]>([]);
  const [consumable, setConsumables] = useState<IConsumable[]>([]);
  const [isLoadingProducts, setLoadingProducts] = useState(true);
  const [isLoadingWoo, setLoadingWoo] = useState(true);

  useEffect(() => {
    const wooProducts = wooCommerce.get("products", { per_page: 100 });
    const productsPromise = getProducts().then((data) => {
      setProducts(data);
      setLoadingProducts(false);
    });

    const consumablesPromise = getConsumables().then((data) => {
      setConsumables(data);
    });
    Promise.all([wooProducts, productsPromise, consumablesPromise]).then(
      (val) => {
        console.log(val[0].data);
        const productsIds = products.map((p) => p.id);
        const productsToAdd = val[0].data.map((prod: any) => {
          if (!productsIds.includes(prod.id))
            return {
              id: prod.id,
              name: prod.name,
              img: prod.images[0].src || "",
            };
        });
        setWooProducts(productsToAdd);
        setLoadingWoo(false);
      }
    );
  }, []);

  return (
    <>
      <div className="flex items-center  justify-between mt-10">
        <p className="text-xl font-semibold">Products</p>
        <ProductsForm
          wooProducts={wooProducts}
          consmables={consumable}
          isLoading={isLoadingWoo}
        />
      </div>
      {isLoadingProducts ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 place-items-center">
          {products.length > 0 &&
            products.map((product, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center bg-white border-8 border-sky-500 m-2 p-2"
              >
                <div className="text-xs text-center"> {product.name} </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
