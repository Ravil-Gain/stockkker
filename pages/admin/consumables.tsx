import ConsumablesForm from "@/components/consumables/ConsumablesForm";
import { Loading } from "@/components/ui/Loading";
import { getConsumables } from "@/firebase/functions/consumables";
import { getOrders } from "@/firebase/functions/orders";
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
import { useEffect, useState } from "react";
import { FiEdit } from "react-icons/fi";

export default function Home() {
  const [consumables, setConsumables] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [onHold, setOnHold] = useState<{ [x: string]: any }>();

  useEffect(() => {
    getConsumables().then((data) => {
      setConsumables(data);
      setLoading(false);

    
      getOrders().then((data) => {
        const arrayProds: string[] = [];
        data.map((d) => {
          d.consumables.map((prod) => arrayProds.push(prod));
        });
        const reduced = arrayProds.reduce(orderReducer, {});
        setOnHold(reduced);
      });

    });

  }, []);

  return (
    <>
      <div className="flex items-center justify-between my-10">
        <p className="text-xl font-semibold">Consumables</p>
        <ConsumablesForm />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 320 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">onHold</TableCell>
                <TableCell align="right">Tottal</TableCell>
                <TableCell align="right">Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consumables.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <div className="flex items-center justify-start cursor-pointer">
                      <FiEdit />
                      {row.name}
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    {(onHold && onHold[row.id]) || ""}
                  </TableCell>
                  <TableCell align="right">{row.amount}</TableCell>
                  <TableCell align="right">{row.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
