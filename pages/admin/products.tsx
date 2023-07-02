import { EditProduct } from "@/components/products/EditProduct";
import { ProductDispatch } from "@/components/products/ProductDispatch";
import ProductsForm from "@/components/products/ProductsForm";
import { Loading } from "@/components/ui/Loading";
import { useAuth } from "@/context/authContext";
import { IConsumable } from "@/firebase/firestore/consumable";
import { IProduct } from "@/firebase/firestore/product";
import { IWooProduct } from "@/firebase/firestore/wooProduct";
import { getConsumables } from "@/firebase/functions/consumables";
import { getOrders } from "@/firebase/functions/orders";
import { getProducts } from "@/firebase/functions/product";
import { orderReducer } from "@/woocommerce/util";
import wooCommerce from "@/woocommerce/woocommerce";
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
import { useEffect, useState } from "react";
import { FiBox, FiPackage } from "react-icons/fi";

export default function Products() {
  const user = useAuth();
  const userUid: string = user.authUser?.uid || "";

  const [products, setProducts] = useState<IProduct[]>([]);
  const [wooProducts, setWooProducts] = useState<IWooProduct[]>([]);
  const [consumable, setConsumables] = useState<IConsumable[]>([]);
  const [onHold, setOnHold] = useState<{ [x: string]: any }>();
  const [isLoadingProducts, setLoadingProducts] = useState(true);
  const [isLoadingWoo, setLoadingWoo] = useState(true);
  const [editProduct, setEditProduct] = useState<IProduct | null>(null);
  const [dispatchProduct, setDispatchProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    const wooProducts = wooCommerce.get("products", { per_page: 100 });
    const productsPromise = getProducts().then((data) => {
      setProducts(data);
      setLoadingProducts(false);
    });

    const consumablesPromise = getConsumables().then((data) =>
      setConsumables(data)
    );

    const ordersPromise = getOrders().then((data) => {
      const arrayProds: string[] = [];
      data.map((d) => {
        d.products.map((prod) => arrayProds.push(prod));
      });
      const reduced = arrayProds.reduce(orderReducer, {});
      setOnHold(reduced);
    });

    Promise.all([
      wooProducts,
      productsPromise,
      consumablesPromise,
      ordersPromise,
    ]).then((val) => {
      const productsIds = products.map((p) => p.id);
      const productsToAdd = val[0].data.map((prod: any) => {
        if (!productsIds.includes(prod.id))
          return {
            id: prod.id,
            name: prod.name,
            img: prod.images[0].src || "",
          };
      });
      setWooProducts(productsToAdd);
      setLoadingWoo(false);
    });
  }, []);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xl font-semibold">Products</p>
        <ProductsForm
          wooProducts={wooProducts}
          consmables={consumable}
          isLoading={isLoadingWoo}
          products={products}
        />
      </div>
      {editProduct !== null && userUid !== "" && (
        <EditProduct
          userId={userUid}
          product={editProduct}
          closeFn={() => setEditProduct(null)}
        />
      )}
      {dispatchProduct !== null && (
        <ProductDispatch
          product={dispatchProduct}
          closeFn={() => setDispatchProduct(null)}
        />
      )}
      {isLoadingProducts ? (
        <Loading />
      ) : (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 320 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">WooId</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">on Hold</TableCell>
                  <TableCell align="center">Shelf Packages</TableCell>
                  <TableCell className="hidden" align="center">
                    Stock Boxes
                  </TableCell>
                  <TableCell align="right">Tottal</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .filter((p) => !p.isBundle)
                  .map((row) => {
                    const tottal: number =
                      row.packagesOnShelf +
                      (row.boxesOnStock * row.boxSize) / row.packageSize;
                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">{row.wooId}</TableCell>
                        <TableCell component="th" scope="row">
                          <span
                            className="cursor-pointer"
                            onClick={() => setEditProduct(row)}
                          >
                            {row.name}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          {(onHold && onHold[row.id]) || ""}
                        </TableCell>
                        <TableCell align="center">
                          {row.packagesOnShelf}
                        </TableCell>

                        <TableCell className="hidden">
                          <div className="flex items-center justify-center cursor-pointer">
                            {row.boxesOnStock}
                            <FiBox />
                          </div>
                        </TableCell>
                        <TableCell align="right">{tottal}</TableCell>
                        <TableCell align="right">
                          <Button onClick={() => setDispatchProduct(row)}>
                            <FiPackage />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <p className="text-xl font-semibold my-4">Bundle Products</p>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 320 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="center">WooCommerceID</TableCell>
                  <TableCell align="center">Consumables</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .filter((p) => p.isBundle)
                  .map((row) => {
                    return (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {row.name}
                        </TableCell>
                        <TableCell align="center">{row.wooId}</TableCell>

                        <TableCell className="hidden">
                          <div className="flex items-center justify-center cursor-pointer">
                            {row.consumables.map((c, i) => (
                              <span key={i}> ({c.name}) </span>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}
