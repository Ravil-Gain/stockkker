import { useAuth } from "@/context/authContext";
import { createConsumable } from "@/firebase/functions/consumables";
import { useState } from "react";
import { useRouter } from "next/router";

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
      const value  = await createConsumable(userUid, name, desc, amount);
      if (!value) return console.log("Error adding consumable");
      setShowModal(false);
    } catch (error) {
      
    }
  };

  return (
    <>
      <button
        className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
        type="button"
        onClick={() => setShowModal(true)}
      >
        Add Consumables
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Add new Consumable</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×.
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto [&>label]:flex [&>label]:items-center">
                  <label>
                    Name:
                    <input
                      className="w-48 bg-gray-200 shadow-inner rounded-l p-2 ml-5 flex-1"
                      id="name"
                      type="text"
                      aria-label="name"
                      placeholder="Consumable Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <br />
                  <label>
                    Description:
                    <input
                      className="w-48 bg-gray-200 shadow-inner rounded-l p-2 ml-5 flex-1"
                      id="desc"
                      type="text"
                      aria-label="desc"
                      placeholder="Consumable Description"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                    />
                  </label>
                  <br />
                  <label>
                    Initial Amount:
                    <input
                      className="w-48 bg-gray-200 shadow-inner rounded-l p-2 flex-1 ml-5"
                      id="amount"
                      type="number"
                      pattern="[0-9]*"
                      aria-label="amount"
                      value={amount}
                      onKeyPress={(event) => {
                        if (!/[0-9]/.test(event.key)) {
                          event.preventDefault();
                        }
                      }}
                      onChange={(e) => setAmount((v) => e.target.validity.valid ? e.target.value : v)
                      }
                    />
                  </label>
                </div>
                {/*footer*/}
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
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
