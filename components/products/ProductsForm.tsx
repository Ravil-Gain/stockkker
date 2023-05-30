import { useState } from "react";
import { IConsumable } from "@/firebase/firestore/consumable";
import { IWooProduct } from "@/firebase/firestore/wooProduct";
import { FormBody } from "../ui/FormBody";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  Chip,
  Stack,
  Button,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { createProduct } from "@/firebase/functions/product";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/router";
import { IProduct, IProductConsumables } from "@/firebase/firestore/product";
import { NumberField } from "../ui/NumberField";
import { v4 } from "uuid";

interface IProductsForm {
  wooProducts: IWooProduct[];
  products: IProduct[];
  consmables: IConsumable[];
  isLoading?: boolean;
}

export default function ProductsForm(props: IProductsForm) {
  const { wooProducts, isLoading, consmables, products } = props;
  const productsId = products.map((p) => p.wooId);
  const [showModal, setShowModal] = useState(false);
  const [formStage, setFormStage] = useState("init");

  const [name, setName] = useState("");
  const [wooProduct, setWooProduct] = useState<IWooProduct>({
    id: "",
    name: "",
    img: "",
  });
  const [productType, setProductType] = useState("Product");

  const [bundleProducts, setBundleProducts] = useState<IProduct[]>([]);

  const [units, setUnits] = useState<"grams" | "psc">("grams");
  const [autoDispatch, setAutoDispatch] = useState<boolean>(false);
  const [packageSize, setPackageSize] = useState<number>(0);
  const [packagesOnShelf, setPackagesOnShelf] = useState<number>(0);
  const [boxSize, setBoxSize] = useState<number>(0);
  const [boxesOnStock, setBoxesOnStock] = useState<number>(0);

  const [requiredConsmables, setRequiredConsmables] = useState<
    IProductConsumables[]
  >([]);

  const user = useAuth();
  const router = useRouter();

  const userUid: string = user.authUser?.uid || "";
  if (user.loading) return null;
  if (!user.loading && !user.authUser) router.push("/");

  const saveProduct = async () => {
    try {
      if (!wooProduct) return;
      const value = await createProduct(userUid, {
        id: v4(),
        boxesOnStock: boxesOnStock,
        boxSize: boxSize,
        imgUrl: wooProduct.img,
        isBundle: productType === "Bundle",
        name: name,
        packageSize: packageSize,
        packagesOnShelf: packagesOnShelf,
        wooId: wooProduct.id,
        products: bundleProducts.map((p) => p.wooId),
        consumables: requiredConsmables,
        active: true,
        measurementUnits: units,
        autoDispatch: autoDispatch,
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
            {formStage === "init" && (
              <>
                <FormControl>
                  <InputLabel id="wooProduct">WooCommerce</InputLabel>
                  <Select
                    label="WooCommerce"
                    labelId="wooProduct"
                    id="demo-simple-select-autowidth"
                    autoWidth
                    value={wooProduct?.id}
                  >
                    {wooProducts
                      .filter((p) => !productsId.includes(p.id))
                      .map((w, i) => (
                        <MenuItem
                          key={i}
                          value={w.id}
                          onClick={() => setWooProduct(w)}
                        >
                          {w.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
                <br />
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
                <FormControl>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
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
                </FormControl>

                <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
                  <Button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    variant="outlined"
                    disabled={name === "" || wooProduct.id === ""}
                    onClick={() => setFormStage(productType)}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}

            {formStage === "Product" && (
              <FormControl fullWidth>
                <InputLabel id="productConsumables">
                  Product Consumables
                </InputLabel>
                <Select
                  multiple
                  labelId="productConsumables"
                  id="demo-simple-select-autowidth"
                  autoWidth
                  value={[""]}
                  label="Product Consumables"
                >
                  {consmables.map((w, i) => (
                    <MenuItem
                      key={i}
                      value={w.name}
                      onClick={() =>
                        setRequiredConsmables([
                          ...requiredConsmables,
                          { id: w.id, name: w.name, amount: 1 },
                        ])
                      }
                    >
                      {w.name}
                    </MenuItem>
                  ))}
                </Select>
                <br />
                <Stack
                  spacing={{ xs: 1, sm: 2 }}
                  direction="row"
                  useFlexGap
                  flexWrap="wrap"
                >
                  {requiredConsmables.map((rc, i) => (
                    <Chip
                      label={rc.name}
                      key={i}
                      variant="outlined"
                      onDelete={() =>
                        setRequiredConsmables([
                          ...requiredConsmables.slice(0, i),
                          ...requiredConsmables.slice(i + 1),
                        ])
                      }
                    />
                  ))}
                </Stack>

                <ToggleButtonGroup
                  value={units}
                  exclusive
                  onChange={(
                    event: React.MouseEvent<HTMLElement>,
                    newAlignment: string | null
                  ) => {
                    switch (newAlignment) {
                      case "grams":
                        setUnits(newAlignment);
                        setPackageSize(0);
                        setAutoDispatch(false);
                        break;
                      case "psc":
                        setPackageSize(1);
                        setAutoDispatch(true);
                        setUnits(newAlignment);

                        break;
                    }
                  }}
                  className="mx-auto pt-4"
                >
                  <ToggleButton value="grams" aria-label="left aligned">
                    <span> Grams </span>
                  </ToggleButton>
                  <ToggleButton value="psc" aria-label="justified">
                    <span> Psc </span>
                  </ToggleButton>
                </ToggleButtonGroup>

                <br />
                <NumberField
                  required
                  label={"Package Size"}
                  setValue={setPackageSize}
                  value={packageSize}
                  endAdornment={units}
                  disabled={units === "psc"}
                />
                <br />
                <NumberField
                  required
                  label={"Box Size"}
                  setValue={setBoxSize}
                  value={boxSize}
                  endAdornment={units}
                />
                <br />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={autoDispatch}
                      onChange={(event: React.SyntheticEvent) =>
                        setAutoDispatch(event.target.checked)
                      }
                    />
                  }
                  label="Auto-Dispatchable"
                  labelPlacement="start"
                />
                <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
                  <Button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => setFormStage("init")}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => setFormStage("Stock")}
                  >
                    Next
                  </Button>
                </div>
              </FormControl>
            )}

            {formStage === "Bundle" && (
              <>
                <FormControl fullWidth>
                  <InputLabel htmlFor="bundleProducts">
                    Bundle Products
                  </InputLabel>
                  <Select
                    value={[""]}
                    label="Bundle Products"
                    id="bundleProducts"
                  >
                    {products
                      .filter((p) => !p.isBundle)
                      .map((p, i) => (
                        <MenuItem
                          key={i}
                          value={p.wooId}
                          onClick={() =>
                            setBundleProducts([...bundleProducts, p])
                          }
                        >
                          {p.name}
                        </MenuItem>
                      ))}
                  </Select>
                  <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction="row"
                    useFlexGap
                    flexWrap="wrap"
                    className="my-4"
                  >
                    {bundleProducts.map((bp, i) => (
                      <Chip
                        label={bp.name}
                        key={i}
                        variant="outlined"
                        onDelete={() =>
                          setBundleProducts([
                            ...bundleProducts.slice(0, i),
                            ...bundleProducts.slice(i + 1),
                          ])
                        }
                      />
                    ))}
                  </Stack>
                </FormControl>
                <FormControl>
                  <InputLabel htmlFor="bundleConsumables">
                    Bundle Consumables
                  </InputLabel>
                  <Select
                    id="bundleConsumables"
                    value={[""]}
                    label="Bundle Consumables"
                  >
                    {consmables.map((w, i) => (
                      <MenuItem
                        key={i}
                        value={w.name}
                        onClick={() =>
                          setRequiredConsmables([...requiredConsmables, w])
                        }
                      >
                        {w.name}
                      </MenuItem>
                    ))}
                  </Select>

                  <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction="row"
                    useFlexGap
                    flexWrap="wrap"
                    className="my-4"
                  >
                    {requiredConsmables.map((rc, i) => (
                      <Chip
                        label={rc.name}
                        key={i}
                        variant="outlined"
                        onDelete={() =>
                          setRequiredConsmables([
                            ...requiredConsmables.slice(0, i),
                            ...requiredConsmables.slice(i + 1),
                          ])
                        }
                      />
                    ))}
                  </Stack>
                </FormControl>

                <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
                  <Button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => setFormStage("init")}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={saveProduct}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}

            {formStage === "Stock" && (
              <>
                <FormControl>
                  <NumberField
                    label={"Packages on Shelf"}
                    setValue={setPackagesOnShelf}
                    value={packagesOnShelf}
                  />
                </FormControl>
                <br />
                <FormControl>
                  <NumberField
                    label={"Boxes on Stock"}
                    setValue={setBoxesOnStock}
                    value={boxesOnStock}
                  />
                </FormControl>
                <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
                  <Button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => setFormStage("Product")}
                  >
                    Back
                  </Button>
                  <Button
                    className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    onClick={() => saveProduct()}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </FormControl>
        </FormBody>
      ) : null}
    </>
  );
}
