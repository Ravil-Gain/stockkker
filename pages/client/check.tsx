import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/context/authContext";
import { ICocktail } from "@/firebase/firestore/cocktail";
import { IOrder, IOrderElement } from "@/firebase/firestore/order";
import { getCocktails } from "@/firebase/functions/cocktails";
import { getMyOrder } from "@/firebase/functions/orders";
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function Check() {
  const user = useAuth();
  const [order, setOrder] = useState<IOrder>();
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (user.authUser) {
      if (!user.authUser?.uid) return;
      Promise.all([
        getMyOrder(user.authUser.uid).then((data) => {
          setOrder(data);
          console.log(data);
        }),
        getCocktails().then((cocktails) => {
          setCocktails(cocktails);
        }),
      ]).finally(() => setLoading(false));
    }
  }, [user]);

  const recievedCocktails: IOrderElement[] =
    order?.cocktails.filter((c) =>
      ["done", "ready", "process"].includes(c.status)
    ) || [];
  const tottal: number =
    recievedCocktails
      .map((c) => c.price || 0)
      .reduce((partialSum, a) => partialSum + a, 0) || 0;

  if (isLoading) return <Loading></Loading>;
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {recievedCocktails.map((value) => {
        const labelId = `checkbox-list-label-${value}`;
        return (
          <ListItem
            key={value.id}
            secondaryAction={
              <IconButton edge="end" aria-label="comments">
                {value.price}
              </IconButton>
            }
          >
            <ListItemText
              id={labelId}
              primary={cocktails.find((c) => c.id === value.cocktail)?.name}
            />
          </ListItem>
        );
      })}
      <Divider component="li" />
      <ListItem
        key={"tottal"}
        secondaryAction={
          <IconButton edge="end" aria-label="comments">
            {Math.round(tottal * 100) / 100}
          </IconButton>
        }
      >
        <ListItemText id={"tottal-Label"} primary={"Tottal"} />
      </ListItem>
    </List>
  );
}
