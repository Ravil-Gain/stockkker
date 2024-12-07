import { useAuth } from "@/context/authContext";
import { ICocktail } from "@/firebase/firestore/cocktail";
import { IOrder, IOrderElement } from "@/firebase/firestore/order";
import { getCocktails } from "@/firebase/functions/cocktails";
import { getMyOrder } from "@/firebase/functions/orders";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { useEffect, useState } from "react";

export default function Check() {
  const [order, setOrder] = useState<IOrder>();
  const [cocktails, setCocktails] = useState<ICocktail[]>([]);
  const [isLoading, setLoading] = useState(false);
  const user = useAuth();

  useEffect(() => {
    if (!user.authUser?.uid) return;

    setLoading(true);
    getMyOrder(user.authUser.uid).then((data) => {
      setOrder(data);
      console.log(data);
    });
    getCocktails().then((cocktails) => {
      setCocktails(cocktails);
    });
  }, [user]);

  const recievedCocktail:IOrderElement[] = order?.cocktails.filter(c=>['done', 'ready', 'process'].includes(c.status)) || [];
  const tottal: number =
  recievedCocktail
      .map((c) => c.price || 0)
      .reduce((partialSum, a) => partialSum + a, 0) || 0;
  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      {recievedCocktail.map((value) => {
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
