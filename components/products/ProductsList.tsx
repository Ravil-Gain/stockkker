import { IProduct } from "@/firebase/firestore/product";
import { Card, CardContent, Grid, Typography } from "@mui/material";

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
                <Grid item xs={16}>
                  <Typography variant="h5" component="div">
                    {product.name}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography component="div">{product.price}€/L</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
