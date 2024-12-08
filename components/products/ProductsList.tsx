import { IProduct } from "@/firebase/firestore/product";
import { Card, CardActions, CardContent, Grid, Typography } from "@mui/material";
import { EditProduct } from "./EditProduct";

interface IProductList {
  products: IProduct[];
}

export default function ProductsList(props: IProductList) {
  const { products } = props;
  return (
    <div>
      {products.map((product, index) => {
        return (
          <Card key={index} sx={{ my: "8px" }}>
            <CardContent>
              <Grid container direction={"row"} spacing={2}>
                <Grid item xs={10}>
                  <Typography variant="h5" component="div">
                    {product.name}
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography component="div">{product.price}€/L</Typography>
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <EditProduct product={product}></EditProduct>
            </CardActions>
          </Card>
        );
      })}
    </div>
  );
}
