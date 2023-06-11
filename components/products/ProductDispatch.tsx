import { FormControl, Button, Typography } from "@mui/material";
import * as React from "react";
import { FormBody } from "../ui/FormBody";
import { IProduct } from "@/firebase/firestore/product";
import { dispatchProduct } from "@/firebase/functions/product";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import Image from "next/image";

export interface IProductDispatch {
  product: IProduct;
  closeFn: any;
  dispatchFn?: any;
}

export function ProductDispatch(props: IProductDispatch) {
  const { product, closeFn, dispatchFn } = props;

  const user = useAuth();
  const router = useRouter();

  const userUid: string = user.authUser?.uid || "";
  if (user.loading) return null;
  if (!user.loading && !user.authUser) router.push("/");

  const dispatch = async () => {
    try {
      const result = await dispatchProduct(product.id, userUid);
      if (result) {
        router.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormBody title={product.name}>
      <div className="mx-auto pt-4">
        <Image
          alt={product.name}
          src={product.imgUrl}
          width={200}
          height={200}
          className="mx-auto"
        ></Image>
        {/* <img alt={product.name} src={product.imgUrl} className="object-cover h-20 w-20"></img> */}

        <Typography variant="body2" color="text.secondary">
          <br/>
          {`${(product.boxSize / product.packageSize).toFixed(0)} packages will go to Shelf`}
          <br />
          {`1 box will be removed from stock`}
        </Typography>

        <br />
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
            onClick={dispatch}
          >
            Done
          </Button>
        </div>
      </div>
    </FormBody>
  );
}
