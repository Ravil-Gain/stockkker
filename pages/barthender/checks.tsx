import CustomerCheck from "@/components/checks/CustomerCheck";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/context/authContext";
import { ICocktail } from "@/firebase/firestore/cocktail";
import { IOrder } from "@/firebase/firestore/order";
import { getCocktails } from "@/firebase/functions/cocktails";
import { getOrdersSnapshot } from "@/firebase/functions/orders";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Order() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [isLoading, setLoading] = useState(false);
  // const user = useAuth();

  useEffect(() => {
    Promise.all([
      getOrdersSnapshot().then((q) => {
        const unsubscribe = onSnapshot(
            q,
            (snap) => {
                const data =snap.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                console.log(data);
                setOrders(data.filter(d=>!d.end_date));
            },
            (error) => console.log(error.message)
          );
          return () => unsubscribe();
      }),
      getCocktails().then((cocktails) => {
        setCocktails(cocktails);
      }),
    ]).finally(() => setLoading(false));
  }, []);

  if (isLoading) return <Loading></Loading>;
  return (
    <div>
      {orders.map((order) => (
        <CustomerCheck
          cocktails={cocktails}
          order={order}
          key={order.id}
        ></CustomerCheck>
      ))}
    </div>
  );
}
