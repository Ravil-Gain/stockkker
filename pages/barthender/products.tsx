import ProductsForm from "@/components/products/ProductsForm";
import ProductsList from "@/components/products/ProductsList";
import { IProduct } from "@/firebase/firestore/product";
import { getProducts } from "@/firebase/functions/product";
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
    });
  }, []);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xl font-semibold">Products</p>
        <ProductsForm products={products} />
      </div>
      <div>
        <ProductsList products={products}></ProductsList>
      </div>
    </div>
  );
}
