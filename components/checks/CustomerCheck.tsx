import { ICocktail } from "@/firebase/firestore/cocktail";
import { IOrder, IOrderElement } from "@/firebase/firestore/order";
import { completeOrder } from "@/firebase/functions/orders";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface IMenuItem {
  order: IOrder;
  cocktails: ICocktail[];
}

export default function CustomerCheck(props: IMenuItem) {
  const { order, cocktails } = props;
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [open, setOpen] = useState(false);

  const recievedCocktail: IOrderElement[] =
    order?.cocktails.filter((c) =>
      ["done", "ready", "process"].includes(c.status)
    ) || [];

  const tottal: number =
    recievedCocktail
      .map((c) => c.price || 0)
      .reduce((partialSum, a) => partialSum + a, 0) || 0;

  const setAsPaid = () => {
    completeOrder(order.id).then((result) => {
      if (result) setOpen(false);
    });
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
        }}
      >
        <CardMedia
          component="img"
          sx={{ width: 151 }}
          src={order.customer.photoURL || undefined}
          alt={order.customer.email || "User"}
        />
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          {showInfo ? (
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography component="div" variant="h5">
                {order.customer.displayName}
              </Typography>
              <Typography
                variant="subtitle1"
                component="div"
                sx={{ color: "text.secondary" }}
              >
                {Math.round(tottal * 100) / 100} €
              </Typography>
            </CardContent>
          ) : (
            <CardContent sx={{ flex: "1 0 auto" }}>
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
                        primary={
                          cocktails.find((c) => c.id === value.cocktail)?.name
                        }
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
            </CardContent>
          )}
          <CardActions>
            {showInfo ? (
              <Button size="small" onClick={() => setShowInfo(!showInfo)}>
                Show Info
              </Button>
            ) : (
              <Button size="small" onClick={() => setShowInfo(!showInfo)}>
                Hide Info
              </Button>
            )}
            <Button size="small" onClick={() => setOpen(true)}>
              Complete
            </Button>
          </CardActions>
        </Box>
      </Card>

      <Dialog
        fullScreen={false}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Close the bill ?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Confirmation of this means user has paid the bill. Detailed
            information could be found in database.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => setOpen(false)}>
            Disagree
          </Button>
          <Button onClick={() => setAsPaid()} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
