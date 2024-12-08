import CocktailsList from "@/components/cocktails/CocktailsList";
import CocktailForm from "@/components/cocktails/CocktailForm";
import { ICocktail } from "@/firebase/firestore/cocktail";
import { IProduct } from "@/firebase/firestore/product";
import { getCocktailsSnapshot } from "@/firebase/functions/cocktails";
import { getProducts } from "@/firebase/functions/product";
import { useEffect, useState } from "react";
import { onSnapshot } from "firebase/firestore";
import { useAuth } from "@/context/authContext";

export default function Cocktails() {
  const user = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [productsLoading, setProductsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user.authUser && user.authUser.admin) {
      Promise.all([
        getProducts().then((products) => {
          setProducts(products);
        }),
        getCocktailsSnapshot().then((q) => {
          const unsubscribe = onSnapshot(
            q,
            (snap) => {
              const data = snap.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              setCocktails(data);
            },
            (error) => console.log(error.message)
          );
          return () => unsubscribe();
        }),
      ]).finally(() => setProductsLoading(false));
    }
  }, [user]);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xl font-semibold">Cocktails</p>
        <CocktailForm
          products={products}
          isLoading={productsLoading}
          cocktails={cocktails}
        />
      </div>
      <CocktailsList cocktails={cocktails} products={products}></CocktailsList>
    </div>
  );
}
