import { useAuth } from "@/context/authContext";
import { AuthUserState } from "@/firebase/authUser";
import { ICocktail } from "@/firebase/firestore/cocktail";
import { IOrderElement, orderStatus } from "@/firebase/firestore/order";
import { getCocktail, orderCocktail } from "@/firebase/functions/orders";
import { Card, CardContent } from "@mui/material";
import { v4 } from "uuid";

interface IMenuItem {
  cocktail: ICocktail;
  status: orderStatus;
  orderId: string | undefined;
  price:number;
}

export default function MenuItem(props: IMenuItem) {
  const { cocktail, status, orderId, price } = props;
  const user = useAuth();
  let backgroundColor;
  switch (status) {
    case "order":
      backgroundColor = "#9575cd";
      break;
    case "process":
      backgroundColor = "#ffca28";
      break;
    case "ready":
      backgroundColor = "#81c784";
      break;
    case "done":
      backgroundColor = "#cfd8dc";
      break;
    default:
      backgroundColor = "#cfd8dc";
      break;
  }


  const orderDrink = (user: AuthUserState, cocktail: ICocktail) => {
    const orderItem: IOrderElement = {
      id: v4(),
      cocktail: cocktail.id,
      status: "order",
      price: price,
    };
    orderCocktail(user, orderId, orderItem);
  };

  const getDrink =(cocktail: ICocktail)=>{
    getCocktail(orderId, cocktail)
  }

  const onClick =(cocktail:ICocktail)=>{
    if (!user.authUser?.uid) return;
    if (status === 'order') console.log('ordered');
    if (status === 'done') orderDrink(user.authUser, cocktail);
    if (status === 'ready') getDrink(cocktail);
  }

  return (
    <Card sx={{ minWidth: 275, my: "8px", backgroundColor }}>
      <CardContent onClick={() => onClick(cocktail)}>
        {cocktail.name} {price}
      </CardContent>
    </Card>
  );
}
