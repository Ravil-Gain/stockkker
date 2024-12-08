import { IProduct } from "@/firebase/firestore/product";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { FormBody } from "../ui/FormBody";
import {
  Button,
  Chip,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { NumberField } from "../ui/NumberField";
import { ICocktail, Iingredient } from "@/firebase/firestore/cocktail";
import { editCocktail } from "@/firebase/functions/cocktails";

export interface IEditProductProps {
  cocktail: ICocktail;
  products: IProduct[];
}

export function EditCocktail(props: IEditProductProps) {
  const { cocktail, products } = props;
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(cocktail.name);
  const [ingredients, setIngredients] = useState<Iingredient[]>(cocktail.ingredients);
  const [selectedLiquid, setSelectedLiquid] = useState<IProduct | null>(null);
  const [liquidAmount, setLiquidAmount] = useState<number>(0);

  const addIngredient = () => {
    if (selectedLiquid == null || liquidAmount <= 0) return;
    setIngredients([
      ...ingredients,
      { amount: liquidAmount, product: selectedLiquid.id },
    ]);
    setSelectedLiquid(null);
    setLiquidAmount(0);
  };

  const saveProduct = () => {
    console.log(name, ingredients);
    editCocktail({...cocktail, name, ingredients});
    setShowModal(false);

    // editProduct({...product, name});
  };
  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
      >
        Edit
      </Button>
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
            <Grid container direction={"row"}>
              <Select
                id="liquid"
                label={"Liquid"}
                value={selectedLiquid?.name || ""}
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
              {ingredients.map((rc, i) => (
                <Chip
                  label={`${rc.amount}ml - ${
                    products.find((p) => p.id === rc.product)?.name
                  }  `}
                  key={i}
                  variant="outlined"
                  onDelete={() =>
                    setIngredients([
                      ...ingredients.slice(0, i),
                      ...ingredients.slice(i + 1),
                    ])
                  }
                />
              ))}
            </Stack>
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
