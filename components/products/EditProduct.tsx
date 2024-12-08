import { IProduct } from "@/firebase/firestore/product";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { FormBody } from "../ui/FormBody";
import { Button, FormControl, TextField } from "@mui/material";
import { NumberField } from "../ui/NumberField";
import { editProduct } from "@/firebase/functions/product";

export interface IEditProductProps {
  product: IProduct;
  isLoading?: boolean;
}

export function EditProduct(props: IEditProductProps) {
  const { isLoading, product } = props;
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState<number>(product.price);

  const saveProduct = () =>{
    editProduct({...product, price, name});
    setShowModal(false);
  };
  return (
    <>
      <LoadingButton
        loading={isLoading}
        onClick={() => setShowModal(true)}
      >
        Edit
      </LoadingButton>
      {showModal ? (
        <FormBody title={name === "" ? "New Product" : name}>
          <FormControl fullWidth>
            <FormControl className="py-4">
              <TextField
                required
                id="outlined-basic"
                label={"Name"}
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <br />
            <NumberField
              required
              label={"Price per litre"}
              setValue={setPrice}
              value={price}
            />
            <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
              <Button
                className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => saveProduct()}
              >
                Save
              </Button>
            </div>
          </FormControl>
        </FormBody>
      ) : null}
    </>
  );
}