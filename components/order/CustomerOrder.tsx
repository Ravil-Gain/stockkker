import { ICocktail } from "@/firebase/firestore/cocktail";
import { IOrder, IOrderElement } from "@/firebase/firestore/order";
import { changeOrderCocktailStatus } from "@/firebase/functions/orders";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";

interface IMenuItem {
  order: IOrder;
  cocktails: ICocktail[];
}

export default function CustomerOrder(props: IMenuItem) {
  const { order, cocktails } = props;
  const pendingCocktails = order.cocktails.filter((c) =>
    ["order", "process"].includes(c.status)
  );
  const changeStatus = (cocktail: IOrderElement) => {
    if (cocktail.status === "order") {
        changeOrderCocktailStatus(order.id, cocktail, 'process');
    } else {
        changeOrderCocktailStatus(order.id, cocktail, 'ready');
    }
  };
  return (
    <>
      {pendingCocktails.map((cocktail, index) => (
        <Card
          key={index}
          sx={{
            my:"8px",
            display: "flex",
            backgroundColor: cocktail.status === "process" ? "#c2b5ff" : "",
          }}
          onClick={() => changeStatus(cocktail)}
        >
          <CardMedia
            component="img"
            sx={{ width: 151 }}
            src={order.customer.photoURL || undefined}
            alt={order.customer.email || "User"}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {cocktails.find((c) => c.id === cocktail.cocktail)?.name}
              </Typography>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: "text.secondary" }}
              >
                {order.customer.displayName}
              </Typography>
            </CardContent>
            <Box
              sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
            ></Box>
          </Box>
        </Card>
      ))}
    </>
  );
}
