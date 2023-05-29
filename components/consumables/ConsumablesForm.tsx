import { useAuth } from "@/context/authContext";
import { createConsumable } from "@/firebase/functions/consumables";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button, FormControl, TextField } from "@mui/material";
import { NumberField } from "../ui/NumberField";
import { FormBody } from "../ui/FormBody";
import { IConsumable } from "@/firebase/firestore/consumable";
import { v4 } from "uuid"

export default function ConsumablesForm() {
  const user = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const userUid: string = user.authUser?.uid || "";
  if (user.loading) return null;
  if (!user.loading && !user.authUser) router.push("/");

  const saveConsumable = async () => {
    try {
      const consumable: IConsumable = {
        id: v4(),
        name: name,
        description: desc,
        amount: amount,
        created: new Date()
      };
      const value = await createConsumable(userUid, consumable);
      if (!value) return console.log("Error adding consumable");
      router.reload();
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="success"
        onClick={() => setShowModal(true)}
      >
        Add Consumables
      </Button>
      {showModal ? (
        <>
          <FormBody title="New Consumable">
            <FormControl>
              <TextField
                required
                id="outlined-basic"
                label={"Name"}
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <TextField
                required
                id="outlined-basic"
                label={"Description"}
                variant="outlined"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <br />
              <NumberField
                label={"Initial Amount"}
                setValue={setAmount}
                value={amount}
              />
              <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
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
                  onClick={() => saveConsumable()}
                >
                  Save
                </button>
              </div>
            </FormControl>
          </FormBody>
        </>
      ) : null}
    </>
  );
}
