import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
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
interface IProductStatus extends IProduct {
  onHold: number;
}

export default function Prepare() {
  const [isLoading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState<IProduct[]>([]);
  const [products, setProducts] = useState<IProductStatus[]>([]);
  const [dispatchProduct, setDispatchProduct] = useState<IProduct | null>(null);

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
          const arrayProds: string[] = [];
          const orders = snap.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          orders.map((d) => d.products.map((prod) => arrayProds.push(prod)));
          const reduced = arrayProds.reduce(orderReducer, {});

          const prods: IProductStatus[] = productsData
            .map((p: IProduct) => ({
              onHold: reduced[p.id] || 0,
              ...p,
            }))
            .sort((p1, p2) => p2.onHold - p1.onHold);
          setProducts(prods);
          setLoading(false);
        },
        (error) => console.log(error.message)
      );
      return () => unsubscribe();
    });
  }, [productsData]);
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
          <div className="w-full h-20 flex flex-row">
            <ProductDeclaration stockProducts={productsData}/>
          </div>
          <Table size={"small"} sx={{ minWidth: 250 }}>
            <TableHead>
              <TableRow>
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
              {products
                .filter((p) => !p.isBundle)
                .map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ maxWidth: 50 }}>
                      <div className="flex items-center justify-start cursor-pointer">
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
