import { useState } from "react";
import { createProduct } from "@/firebase/functions/product";
import { IConsumable } from "@/firebase/firestore/consumable";
import { IWooProduct } from "@/firebase/firestore/wooProduct";
import { FormField } from "../ui/FormField";
import { FormBody } from "../ui/FormBody";
import { Button } from "../ui/Button";
import { DropDown } from "../ui/DropDown";

interface IProductsForm {
  wooProducts: IWooProduct[];
  consmables: IConsumable[];
  isLoading?: boolean;
}
export default function ProductsForm(props: IProductsForm) {
  const { wooProducts, isLoading, consmables } = props;
  const [showModal, setShowModal] = useState(false);
  const [formStage, setFormStage] = useState("init");

  // Form Fields
  const [name, setName] = useState("");
  const [wooProduct, setWooProduct] = useState<IWooProduct>();
  const [isBundle, setIsBundle] = useState(false);

  const [products, setProducts] = useState([]);

  const [packageSize, setPackageSize] = useState(0);
  const [packagesOnShelf, setPackagesOnShelf] = useState(0);
  const [boxSize, setBoxSize] = useState(0);
  const [boxesOnStock, setBoxesOnStock] = useState(0);

  const [requiredConsmables, setRequiredConsmables] = useState([]);
  //   wooId
  //   imgUrl
  //   consumables: string[],

  //   const userUid: string = user.authUser?.uid || "";
  //   if (user.loading) return null;
  //   if (!user.loading && !user.authUser) router.push("/");

  const saveProduct = async () => {
    try {
      //   const value  = await createProduct();
      //   if (!value) return console.log("Error adding consumable");
      //   setShowModal(false);
    } catch (error) {}
  };

  const selectProduct = (id: string) => {
    console.log(id);
  };

  return (
    <>
      <Button
        text="Add Product"
        onClick={() => setShowModal(true)}
        isLoading={isLoading}
      />
      {showModal ? (
        <FormBody title="New Product">
          {/* First comes product selecting from WooCommerce */}
          {formStage === "init" && (
            <>
              <DropDown
                title="WooProduct:"
                options={wooProducts}
                onSelect={selectProduct}
              />
              <br />
              <FormField
                name="name"
                value={name}
                title="Name:"
                type="string"
                onChange={(e) => setName(e.target.value)}
              />
              <br />

              <input
                type="radio"
                name="topping"
                value="false"
                id="regular"
                checked={!isBundle}
                onChange={(e) =>
                  setIsBundle(e.currentTarget.value === "true" ? true : false)
                }
              />
              <label htmlFor="regular">Regular Product</label>
              <br />
              <input
                type="radio"
                name="topping"
                value="true"
                id=""
                checked={isBundle}
                onChange={(e) =>
                  setIsBundle(e.currentTarget.value === "true" ? true : false)
                }
              />
              <label htmlFor="medium">Bundle of products</label>

              <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() =>
                    isBundle ? setFormStage("bundle") : setFormStage("product")
                  }
                >
                  Next
                </button>
              </div>
            </>
          )}

          {formStage === "product" && (
            <>
              <FormField
                name="packageSize"
                value={packageSize}
                type="number"
                title="Package Size"
                pattern="[0-9]*"
                onChange={(e) =>
                  setPackageSize((v) =>
                    e.target.validity.valid ? e.target.value : v
                  )
                }
              />
              <br />

              <FormField
                name="packagesOnShelf"
                value={packagesOnShelf}
                type="number"
                title="Packages on Shelf"
                pattern="[0-9]*"
                onChange={(e) =>
                  setPackageSize((v) =>
                    e.target.validity.valid ? e.target.value : v
                  )
                }
              />
              <br />

              <FormField
                name="packagesOnShelf"
                value={packagesOnShelf}
                type="number"
                title="Packages on Shelf"
                pattern="[0-9]*"
                onChange={(e) =>
                  setPackageSize((v) =>
                    e.target.validity.valid ? e.target.value : v
                  )
                }
              />
              <br />

              <FormField
                name="packagesOnShelf"
                value={packagesOnShelf}
                type="number"
                title="Packages on Shelf"
                pattern="[0-9]*"
                onChange={(e) =>
                  setPackageSize((v) =>
                    e.target.validity.valid ? e.target.value : v
                  )
                }
              />
              <br />
              <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setFormStage("init")}
                >
                  Back
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => (isBundle ? setFormStage(1) : setFormStage(2))}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {formStage === "bundle" && ( // Package Data
            <>
              <FormField
                name="packageSize"
                value={packageSize}
                type="number"
                title="Package Size:"
                pattern="[0-9]*"
                onChange={(e) =>
                  setPackageSize((v) =>
                    e.target.validity.valid ? e.target.value : v
                  )
                }
              />
              <br />
              <FormField
                name="packagesOnShelf"
                value={packagesOnShelf}
                type="number"
                title="Packages on Shelf:"
                pattern="[0-9]*"
                onChange={(e) =>
                  setPackagesOnShelf((v) =>
                    e.target.validity.valid ? e.target.value : v
                  )
                }
              />

              <br />
              <div className="flex items-center justify-end pt-2 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setFormStage("init")}
                >
                  Back
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => (isBundle ? setFormStage(1) : setFormStage(2))}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </FormBody>
      ) : null}
    </>
  );
}
