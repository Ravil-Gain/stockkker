import {
  FormControl,
  InputLabel,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from "@mui/material";
import * as React from "react";
import { FormBody } from "../ui/FormBody";
import { IProduct } from "@/firebase/firestore/product";

export interface IEditProductProps {
  product: IProduct;
  closeFn: any;
}

export function EditProduct(props: IEditProductProps) {
  const { product, closeFn } = props;

  return (
    <FormBody title={product.name}>
      <FormControl fullWidth>
        <>
          <InputLabel id="wooProduct">WooCommerce</InputLabel>
          <br />
          <TextField
            required
            id="outlined-basic"
            label={"Name"}
            variant="outlined"
            value={name}
            // onChange={(e) => setName(e.target.value)}
          />
          <br />
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            name="radio-buttons-group"
            // value={productType}
            // onChange={(e) => setProductType(e.target.value)}
            row
          >
            <FormControlLabel
              value="Product"
              control={<Radio />}
              label="Product"
            />
            <FormControlLabel
              value="Bundle"
              control={<Radio />}
              label="Bundle"
            />
          </RadioGroup>
          <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
            <Button
              className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={()=>closeFn()}
            >
              Close
            </Button>
            <Button
              className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              variant="outlined"
            //   disabled={name === "" || wooProduct.id === ""}
            //   onClick={() => setFormStage(productType)}
            >
              Save
            </Button>
          </div>
        </>
      </FormControl>
    </FormBody>
  );
}
