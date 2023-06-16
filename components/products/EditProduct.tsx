import { FormControl, Button } from "@mui/material";
import * as React from "react";
import { FormBody } from "../ui/FormBody";
import { IProduct } from "@/firebase/firestore/product";
import { NumberField } from "../ui/NumberField";
import { useState } from "react";
import { editProduct } from "@/firebase/functions/product";
import { useRouter } from "next/router";

export interface IEditProductProps {
  userId: string;
  product: IProduct;
  closeFn: any;
}

export function EditProduct(props: IEditProductProps) {
  const router = useRouter();
  const { product, closeFn, userId } = props;
  const [packageSize, setPackageSize] = useState(product.packageSize);
  const [onShelf, setOnShelf] = useState(product.packagesOnShelf);
  const [onStock, setOnStock] = useState(product.boxesOnStock);
  const [boxSize, setBoxSize] = useState(product.boxSize);
  const saveChanges = async () => {
    const newProd: IProduct = {
      ...product,
      boxSize,
      packageSize,
      packagesOnShelf: onShelf,
      boxesOnStock: onStock,
    };

    console.log(userId, newProd);
    const result = await editProduct(userId, newProd);
    router.reload();

  };
  return (
    <FormBody title={`${product.name} (${product.wooId})`}>
      <FormControl fullWidth>
        <div className="w-min-[160px] flex flex-col">
          <NumberField
            sx={{ width: 250, mr: 2 }}
            required
            label={"packagesOnShelf"}
            setValue={setOnShelf}
            value={onShelf}
          />
          <br />

          <NumberField
            sx={{ width: 250, mr: 2 }}
            required
            label={"boxesOnStock"}
            setValue={setOnStock}
            value={onStock}
          />
          <br />

          <NumberField
            sx={{ width: 250, mr: 2 }}
            required
            label={"packageSize"}
            setValue={setPackageSize}
            endAdornment={product.measurementUnits}
            value={packageSize}
          />
          <br />

          <NumberField
            sx={{ width: 250, mr: 2 }}
            required
            label={"boxSize"}
            setValue={setBoxSize}
            endAdornment={product.measurementUnits}
            value={boxSize}
          />
          <br />
        </div>
        <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
          <Button
            className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            onClick={() => closeFn()}
          >
            Close
          </Button>
          <Button
            className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            variant="outlined"
            //   disabled={name === "" || wooProduct.id === ""}
            onClick={saveChanges}
          >
            Save
          </Button>
        </div>
      </FormControl>
    </FormBody>
  );
}
