import { IProduct } from "@/firebase/firestore/product";
import { getOrdersSnapshot } from "@/firebase/functions/orders";
import { getProducts } from "@/firebase/functions/product";
import { orderReducer } from "@/woocommerce/util";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

interface IRaportProduct extends IProduct {
  onHold: number;
}

export default function Admin() {
  const [isLoading, setLoading] = useState(true);
  const [products, setProducts] = useState<IRaportProduct[]>([]);

  useEffect(() => {
    console.log("update");
    getProducts().then((products) => {
      getOrdersSnapshot().then((q) => {
        const unsubscribe = onSnapshot(
          q,
          (snap) => {
            const arrayProds: string[] = [];
            const orders = snap.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            orders.map((d) => {
              d.products.map((prod) => arrayProds.push(prod));
            });
            const reduced = arrayProds.reduce(orderReducer, {});
            console.log(reduced);

            //@ts-ignore
            const prods: IRaportProduct = products
            .map((p: IProduct) => ({
              onHold: reduced[p.id] || 0,
              ...p,
            }))
            .sort((p1, p2) => p2.onHold - p1.onHold);
            
            //@ts-ignore
            setProducts(prods);
            setLoading(false);
          },
          (error) => console.log(error.message)
        );
        return () => unsubscribe();
      });
    });
  }, []);

  return (
    <>
      <h1 className="mx-auto mt-10 text-xl font-semibold capitalize ">Raport</h1>
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 320 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">onHold</TableCell>
                <TableCell align="right">Tottal</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <div className="flex items-center justify-start cursor-pointer">
                      {row.name}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {row.onHold ? row.onHold : ""}
                  </TableCell>
                  <TableCell align="right">{row.packagesOnShelf}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
