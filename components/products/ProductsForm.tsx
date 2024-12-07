import { useState } from "react";
import { FormBody } from "../ui/FormBody";
import { TextField, FormControl, Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { createProduct } from "@/firebase/functions/product";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { IProduct } from "@/firebase/firestore/product";
import { v4 } from "uuid";
import { NumberField } from "../ui/NumberField";

interface IProductsForm {
  products: IProduct[];
  isLoading?: boolean;
}

export default function ProductsForm(props: IProductsForm) {
  const { isLoading, products } = props;
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);

  const user = useAuth();
  const router = useRouter();

  const userUid: string = user.authUser?.uid || "";
  if (user.loading) return null;
  if (!user.loading && !user.authUser) router.push("/");

  const saveProduct = async () => {
    if (
      name.length < 4 ||
      products.map((p) => p.name).includes(name) ||
      price <= 0
    ) {
      console.log(name.length < 3 && "short name", price && "price <= 0");
      return;
    }
    try {
      await createProduct(userUid, {
        id: v4(),
        name: name,
        price: price,
      });
      setShowModal(false);
      router.reload();
    } catch (error) {}
  };
  return (
    <>
      <LoadingButton
        variant="contained"
        color="success"
        loading={isLoading}
        onClick={() => setShowModal(true)}
      >
        Add product
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
