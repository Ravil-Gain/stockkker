import { IProduct } from "@/firebase/firestore/product";
import { IRaportItem } from "@/firebase/firestore/raport";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { FormBody } from "../ui/FormBody";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  TextField,
} from "@mui/material";
import { NumberField } from "../ui/NumberField";
import { FiMinus, FiPlus, FiXCircle } from "react-icons/fi";
import { createRaport } from "@/firebase/functions/raports";
import { v4 } from "uuid";
import { useAuth } from "@/context/authContext";

interface IProductDeclarationProps {
  stockProducts: IProduct[];
  isLoading?: boolean;
}

export function ProductDeclaration(props: IProductDeclarationProps) {
  const user = useAuth();

  const { stockProducts, isLoading } = props;
  const [amount, setAmount] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState<IProduct | null>(null);
  const [prodsToChange, setProdsToChange] = useState<IRaportItem[]>([]);

  const userUid: string = user.authUser?.uid || "";
  if (user.loading) return null;

  const removeItem = (id: string) =>
    setProdsToChange(prodsToChange.filter((p) => p.id !== id));

  const addItem = (amount: number) => {
    const object: IRaportItem = {
      type: "product",
      id: product?.id || "",
      amount: amount,
    };
    setProdsToChange((current) => [...current, object]);
    setProduct(null);
    setAmount(0);
  };
  const closeDialog = () => {
    setAmount(0);
    setProduct(null);
    setDescription("");
    setShowModal(false);
    setProdsToChange([]);
  };
  const saveRaport = async () => {
    await createRaport({
      id: v4(),
      userId: userUid,
      date: new Date(),
      description: description,
      raportSubjects: prodsToChange,
    });
    closeDialog();
  };
  return (
    <>
      <LoadingButton
        variant="contained"
        color="success"
        loading={isLoading}
        onClick={() => setShowModal(true)}
      >
        Report
      </LoadingButton>
      {showModal ? (
        <div>
          <FormBody title="Report an issue">
            <FormControl fullWidth>
              <div className="w-min-[160px] flex md:justify-between flex-col md:flex-row md:w-[450px]">
                <Autocomplete
                  onChange={(event, newInputValue) => setProduct(newInputValue)}
                  value={product}
                  options={stockProducts.filter(
                    (p) => !prodsToChange.map((o) => o.id).includes(p.id)
                  )}
                  getOptionLabel={(option) => option.name}
                  sx={{ py: 2, width: 1, mr: 2 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Pick Product" />
                  )}
                />

                <Box sx={{ py: 2, width: 200, display: "flex" }}>
                  <NumberField
                    sx={{ width: 100, mr: 2 }}
                    required
                    label={"Amount"}
                    setValue={setAmount}
                    value={amount}
                  />
                  <IconButton
                    aria-label="fingerprint"
                    color="secondary"
                    disabled={product === null || amount === 0}
                    onClick={() => addItem(amount)}
                  >
                    <FiPlus />
                  </IconButton>
                  <IconButton
                    aria-label="fingerprint"
                    color="secondary"
                    disabled={product === null || amount === 0}
                    onClick={() => addItem(amount * -1)}
                  >
                    <FiMinus />
                  </IconButton>
                </Box>
              </div>
              <div className="md:grid gap-4 grid-cols-2">
                <div className="pb-2">
                  {prodsToChange &&
                    prodsToChange
                      .filter((p) => p.amount > 0)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`rounded-lg flex w-full bg-green-200 my-2 p-2 justify-between`}
                        >
                          +{item.amount}{" "}
                          {stockProducts.find((p) => p.id === item.id)?.name}
                          <IconButton
                            sx={{ p: 0 }}
                            onClick={() => removeItem(item.id)}
                          >
                            <FiXCircle />
                          </IconButton>
                        </div>
                      ))}
                </div>
                <div className="pb-4">
                  {prodsToChange &&
                    prodsToChange
                      .filter((p) => p.amount < 0)
                      .map((item, index) => (
                        <div
                          key={index}
                          className={`rounded-lg flex w-full bg-red-200 my-2 p-2 justify-between`}
                        >
                          {item.amount}{" "}
                          {stockProducts.find((p) => p.id === item.id)?.name}
                          <IconButton
                            sx={{ p: 0 }}
                            onClick={() => removeItem(item.id)}
                          >
                            <FiXCircle />
                          </IconButton>
                        </div>
                      ))}
                </div>
              </div>

              <Divider />
              <TextField
                id="outlined-textarea"
                label="Explanation"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                required
              />
            </FormControl>
            <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
              <Button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={closeDialog}
              >
                Close
              </Button>
              <Button
                className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                variant="outlined"
                disabled={prodsToChange.length === 0 || description === ""}
                onClick={saveRaport}
              >
                Send
              </Button>
            </div>
          </FormBody>
        </div>
      ) : null}
    </>
  );
}
