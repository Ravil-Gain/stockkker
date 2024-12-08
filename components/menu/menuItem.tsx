import { useAuth } from "@/context/authContext";
import { AuthUserState } from "@/firebase/authUser";
import { ICocktail } from "@/firebase/firestore/cocktail";
import { IOrderElement, orderStatus } from "@/firebase/firestore/order";
import { cancelCocktail, getCocktail, orderCocktail } from "@/firebase/functions/orders";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { v4 } from "uuid";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from '@mui/icons-material/Delete';

// import AlarmOnIcon from '@mui/icons-material/AlarmOn';
// import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
// import LocalBarIcon from '@mui/icons-material/LocalBar';
// import ReceiptIcon from '@mui/icons-material/Receipt';

interface IMenuItem {
  cocktail: ICocktail;
  status: orderStatus;
  orderId: string | undefined;
  price: number;
}

export default function MenuItem(props: IMenuItem) {
  const { cocktail, status, orderId, price } = props;
  const [open, setOpen] = useState(false);

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

  const cancelOrder = () => {
    if(status !== 'order') {
      setOpen(false);
      return;
    };
    cancelCocktail(orderId, cocktail.id);
    setOpen(false);
  };

  const getDrink = (cocktail: ICocktail) => {
    getCocktail(orderId, cocktail);
  };

  const onClick = (cocktail: ICocktail) => {
    if (!user.authUser?.uid) return;
    if (status === "order") console.log("ordered");
    if (status === "done") orderDrink(user.authUser, cocktail);
    if (status === "ready") getDrink(cocktail);
  };

  return (
    <>
      <Card sx={{ my: "8px", backgroundColor }}>
        <CardContent onClick={() => onClick(cocktail)}>
          <Grid container spacing={2}>
            <Grid item xs={10}>
              {status === "order" && (
                <ClearIcon
                onClick={()=>setOpen(true) }
                  sx={{ m: "8px", height: "18px", width: "18px", pb:'2px' }}
                ></ClearIcon>
              )}
              {cocktail.name}
            </Grid>
            <Grid item xs={2}>
              {price}€
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Dialog
        fullScreen={false}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Warning"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This order is waiting for barthender, but you still can change your mind. Do you want to cancel it?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button variant="outlined" color="error" startIcon={<DeleteIcon />}onClick={() => cancelOrder()}>
            Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
