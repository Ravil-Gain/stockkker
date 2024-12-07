import { useState } from "react";
import { FormBody } from "../ui/FormBody";
import {
  TextField,
  FormControl,
  Button,
  Stack,
  Chip,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { IProduct } from "@/firebase/firestore/product";
import { v4 } from "uuid";
import { createCocktail } from "@/firebase/functions/cocktails";
import { ICocktail, Iingredient } from "@/firebase/firestore/cocktail";
import { NumberField } from "../ui/NumberField";

interface IProductsForm {
  cocktails: ICocktail[];
  products: IProduct[];
  isLoading?: boolean;
}

export default function CocktailForm(props: IProductsForm) {
  const { isLoading, products, cocktails } = props;
  const [showModal, setShowModal] = useState(false);
  const [liquids, setLiquids] = useState<Iingredient[]>([]);

  const [name, setName] = useState("");
  const [selectedLiquid, setSelectedLiquid] = useState<IProduct | null>(null);
  const [liquidAmount, setLiquidAmount] = useState<number>(0);

  const user = useAuth();
  const router = useRouter();

  const userUid: string = user.authUser?.uid || "";
  if (user.loading) return null;
  if (!user.loading && !user.authUser) router.push("/");

  const addIngredient = () => {
    if(selectedLiquid == null || liquidAmount <= 0) return;
      setLiquids([
        ...liquids,
        { amount: liquidAmount, product: selectedLiquid.id },
      ]);
      setSelectedLiquid(null);
      setLiquidAmount(0);

  };
  const saveCocktail = async () => {
    if(name.length < 4 || cocktails.map(c=>c.name).includes(name)){
        console.log(name.length < 4 && "short name");
        return;
    }
    try {
      await createCocktail(userUid, {
        id: v4(),
        active: true,
        ingredients: liquids,
        name: name,
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
        Add Cocktail
      </LoadingButton>
      {showModal ? (
        <FormBody title={name === "" ? "New Cocktail" : name}>
          <FormControl sx={{ width: 300 }}>
            {/* <FormControl className="py-4"> */}
            <TextField
              required
              id="outlined-basic"
              label={"Name"}
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <br />

            <Grid container direction={"row"}>
              <Select
                id="liquid"
                label={"Liquid"}
                value={selectedLiquid?.name || ''}
                sx={{ width: 150 }}
              >
                {products.map((p, i) => (
                  <MenuItem
                    key={i}
                    value={p.name}
                    onClick={() => setSelectedLiquid(p)}
                  >
                    {p.name}
                  </MenuItem>
                ))}
              </Select>

              <NumberField
                sx={{ width: 80 }}
                label={"ml"}
                setValue={setLiquidAmount}
                value={liquidAmount}
              />
              <Button onClick={() => addIngredient()}>+</Button>
            </Grid>
            <br />
            <Stack
              spacing={{ xs: 1, sm: 2 }}
              direction="row"
              useFlexGap
              flexWrap="wrap"
            >
              {liquids.map((rc, i) => (
                <Chip
                  label={`${rc.amount}ml - ${products.find(p=>p.id ===rc.product)?.name}  `}
                  key={i}
                  variant="outlined"
                  onDelete={() =>
                    setLiquids([
                      ...liquids.slice(0, i),
                      ...liquids.slice(i + 1),
                    ])
                  }
                />
              ))}
            </Stack>
            <br />
            {/* </FormControl> */}
            <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
            <Button
                className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => saveCocktail()}
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
