import MenuItem from "@/components/menu/menuItem";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/context/authContext";
import { ICocktail } from "@/firebase/firestore/cocktail";
import { IOrder, orderStatus } from "@/firebase/firestore/order";
import { IProduct } from "@/firebase/firestore/product";
import { getCocktailsSnapshot } from "@/firebase/functions/cocktails";
import { getOrdersSnapshot } from "@/firebase/functions/orders";
import { getProductsSnapshot } from "@/firebase/functions/product";
import { calculatePrice } from "@/utils";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Menu() {
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [order, setOrder] = useState<IOrder | null | undefined>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);

  const user = useAuth();
  useEffect(() => {
    if (!user.authUser?.uid) return;

    Promise.all([
      getCocktailsSnapshot().then((q) => {
        const unsubscribe = onSnapshot(
          q,
          (snap) => {
            const data = snap.docs
              .map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }))
              .filter((d) => d.active);
            setCocktails(data);
          },
          (error) => console.log(error.message)
        );
        return () => unsubscribe();
      }),
      getOrdersSnapshot().then((q) => {
        const unsubscribe = onSnapshot(
          q,
          (snap) => {
            const data = snap.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setOrder(data.find((d) => !d.end_date && d.customer.uid === user.authUser?.uid));
          },
          (error) => console.log(error.message)
        );
        return () => unsubscribe();
      }),
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
      }),
    ]).finally(() => setLoading(false));
  }, [user]);
  if (isLoading) return <Loading></Loading>;
  return (
    <div>
      <div>
        {cocktails.map((cocktail) => {
          const price: number = calculatePrice(cocktail, products);
          const status: orderStatus =
            order?.cocktails.find(
              (c) => c.status !== "done" && c.cocktail === cocktail.id
            )?.status || "done";
          return (
            <MenuItem
              key={cocktail.id}
              cocktail={cocktail}
              orderId={order?.id}
              status={status}
              price={price}
            ></MenuItem>
          );
        })}
      </div>
    </div>
  );
}
