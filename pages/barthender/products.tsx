import ProductsForm from "@/components/products/ProductsForm";
import ProductsList from "@/components/products/ProductsList";
import { useAuth } from "@/context/authContext";
import { IProduct } from "@/firebase/firestore/product";
import { getProductsSnapshot } from "@/firebase/functions/product";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Products() {
  const user = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    if (user.authUser && user.authUser.admin) {
      getProductsSnapshot().then((q) => {
        const unsubscribe = onSnapshot(
          q,
          (snap) => {
            const data = snap.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setProducts(data);
          },
          (error) => console.log(error.message)
        );
        return () => unsubscribe();
      });
    }
  }, [user]);
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
