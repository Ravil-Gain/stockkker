import { ICocktail } from "@/firebase/firestore/cocktail";
import { IProduct } from "@/firebase/firestore/product";
import {
  activateCocktail,
  deactivateCocktail,
} from "@/firebase/functions/cocktails";
import { calculatePrice } from "@/utils";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { EditCocktail } from "./EditCocktailForm";

interface ICocktailItem {
  cocktails: ICocktail[];
  products: IProduct[];
}

export default function CocktailsList(props: ICocktailItem) {
  const { cocktails, products } = props;
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const deactivate = (id: string) => {
    deactivateCocktail(id);
  };
  const activate = (id: string) => {
    activateCocktail(id);
  };
  return (
    <div>
      {cocktails
        .sort((x, y) => {
          return x === y ? 0 : x ? -1 : 1;
        })
        .map((cocktail, index) => {
          const backgroundColor = cocktail.active ? "#e0f2f1" : "#ffcdd2";
          return (
            <Card
              key={index}
              sx={{ minWidth: 275, my: "8px", backgroundColor }}
            >
              {showInfo ? (
                <CardContent>
                  {cocktail.ingredients.map((i, index) => {
                    return (
                      <Typography key={index} variant="h5" component="div">
                        {`${i.amount} - ${
                          products.find((p) => p.id === i.product)?.name
                        }`}
                      </Typography>
                    );
                  })}
                </CardContent>
              ) : (
                <CardContent>
                  <Grid container direction={"row"} spacing={2}>
                    <Grid item xs={10}>
                      <Typography variant="h5" component="div">
                        {cocktail.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography component="div">
                        {" "}
                        {calculatePrice(cocktail, products)}€
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              )}
              <CardActions>
                {cocktail.active ? (
                  <Button size="small" onClick={() => deactivate(cocktail.id)}>
                    Deactivate
                  </Button>
                ) : (
                  <Button size="small" onClick={() => activate(cocktail.id)}>
                    Activate
                  </Button>
                )}
                <EditCocktail
                  cocktail={cocktail}
                  products={products}
                ></EditCocktail>
              </CardActions>
            </Card>
          );
        })}
    </div>
  );
}
