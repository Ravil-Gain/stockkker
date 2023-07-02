import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { ShelfStatusBar } from "@/components/ShelfStatus";
import { ProductDispatch } from "@/components/products/ProductDispatch";
import { IProduct } from "@/firebase/firestore/product";
import { getOrdersSnapshot } from "@/firebase/functions/orders";
import { getProductsSnapshot } from "@/firebase/functions/product";
import { orderReducer } from "@/woocommerce/util";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FiPackage } from "react-icons/fi";
import { ProductDeclaration } from "@/components/products/ProductDeclaration";
import { IOrder } from "@/firebase/firestore/order";
interface IProductStatus extends IProduct {
  onHold: number;
}

export default function Prepare() {
  const [isLoading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState<IProduct[]>([]);
  // const [products, setProducts] = useState<IProductStatus[]>([]);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [dispatchProduct, setDispatchProduct] = useState<IProduct | null>(null);
  const [allOrders, setAllOrders] = useState(false);

  useEffect(() => {
    const q = getProductsSnapshot();
    const unsubscribe = onSnapshot(q, (snap) => {
      const prods = snap.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setProductsData(prods);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("update");
    getOrdersSnapshot().then((q) => {
      const unsubscribe = onSnapshot(
        q,
        (snap) => {
          const orders = snap.docs.map((doc) => ({
            ...doc.data(),
            date: new Date(doc.data().date.toDate().toDateString()),
            id: doc.id,
          }));
          setOrders(orders);
          setLoading(false);
        },
        (error) => console.log(error.message)
      );
      return () => unsubscribe();
    });
  }, [productsData]);

  const arrayProds: string[] = [];
  const usedDate = new Date(Date.now() - 864e5);
  orders
    .filter((o) => {
      if (allOrders) {
        return true;
      } else {
        return new Date(o.date) <= usedDate;
      }
    })
    .map((d) => d.products.map((prod) => arrayProds.push(prod)));

  const reduced = arrayProds.reduce(orderReducer, {});
  const shownProducts: IProductStatus[] = productsData
    .map((p: IProduct) => ({
      onHold: reduced[p.id] || 0,
      ...p,
    }))
    .sort((p1, p2) => p2.onHold - p1.onHold);

  return (
    <>
      {dispatchProduct !== null && (
        <ProductDispatch
          product={dispatchProduct}
          closeFn={() => setDispatchProduct(null)}
        />
      )}
      {isLoading ? (
        <p>Loading</p>
      ) : (
        <TableContainer component={Paper}>
          <div className="h-10 flex flex-row m-4 justify-between">
            <div>
              <FormControlLabel
                control={
                  <Switch
                    value={allOrders}
                    color="primary"
                    onChange={(event) => setAllOrders(event.target.checked)}
                  />
                }
                label="All Days"
                labelPlacement="start"
              />
            </div>
            <ProductDeclaration stockProducts={productsData} />
          </div>
          <Table size={"small"} sx={{ minWidth: 250 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#dbdbdb" }}>
                <TableCell>Name</TableCell>
                <TableCell
                  align="center"
                  sx={{ display: { xs: "none", sm: "table-cell" } }}
                >
                  Status
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 30 }}>
                  onHold
                </TableCell>
                <TableCell align="center" sx={{ maxWidth: 30 }}>
                  onShelf
                </TableCell>
                <TableCell align="right" sx={{ maxWidth: 30 }}>
                  Dispatch
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {shownProducts
                .filter((p) => !p.isBundle)
                .map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ maxWidth: 50 }}>
                      <div className="flex items-center justify-start">
                        {row.name}
                      </div>
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      sx={{ display: { xs: "none", sm: "table-cell" } }}
                    >
                      <ShelfStatusBar
                        onHold={row.onHold}
                        onShelf={row.packagesOnShelf}
                        maxValue={row.boxSize / row.packageSize}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ maxWidth: 30 }}>
                      {row.onHold ? row.onHold : ""}
                    </TableCell>
                    <TableCell align="center" sx={{ maxWidth: 30 }}>
                      {row.packagesOnShelf.toFixed(0)}
                    </TableCell>
                    <TableCell align="right" sx={{ maxWidth: 30 }}>
                      <Button onClick={() => setDispatchProduct(row)}>
                        <FiPackage />
                        {row.boxesOnStock}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
