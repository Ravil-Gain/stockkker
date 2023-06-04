import {
  collection,
  doc,
  getDocs,
  increment,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../config";
import { createLog } from "./log";
import { IConsumable } from "../firestore/consumable";
import { v4 } from "uuid"

const consumablessCollection = collection(
  database,
  "consumables"
).withConverter({
  toFirestore: (data: IConsumable) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as IConsumable,
});

export async function createConsumable(
  userUid: string,
  consumable: IConsumable
) {
  console.log(consumable);
  
  try {
    const docRef = doc(consumablessCollection, consumable.id);
    await setDoc(docRef, {
      ...consumable,
      id: docRef.id,
    });
    console.log("Consumables written with ID: ", docRef.id);
    await createLog({
      id: v4(),
      type: "log",
      desc: "Created new Consumable",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [docRef.id],
      relatedProducts: [],
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding Consumables: ", e);
    await createLog({
      id: v4(),
      type: "error",
      desc: "Error adding Consumables",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
      error: e,
    });
    return false;
  }
}

export async function changeAmounts(
  id: string,
  amount: number,
  userUid: string
) {
  if (!userUid || userUid === "") return;
  try {
    const docRef = doc(consumablessCollection, id);
    updateDoc(docRef, { amount: increment(amount) });
    await createLog({
      id: v4(),
      type: "log",
      desc: "Consumable amounts",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [docRef.id],
      relatedProducts: [],
    });

    return docRef.id;
  } catch (error) {
    await createLog({
      id: v4(),
      type: "error",
      desc:  "Error with Consumable amounts",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
      error: error,
    });

    return false;
  }
}

export async function getConsumables() {
  const lists = query(consumablessCollection);
  const querySnapshot = await getDocs(lists);
  return querySnapshot.docs.map((item) => {
    return { ...item.data(), id: item.id };
  });
}

export async function updateConsumable(
  id: string,
  userUid: string,
  name: string,
  description: string,
  amount: number
) {
  if (!userUid || userUid === "") return;
  try {
    const docRef = doc(consumablessCollection, id);
    updateDoc(docRef, { name, description, amount });
    await createLog({
      id: v4(),
      type: "log",
      desc: "Consumable update",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [docRef.id],
      relatedProducts: [],
    });
    return docRef.id;
  } catch (error) {
    await createLog({
      id: v4(),
      type: "error",
      desc:  "Error updating Consumable",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
      error: error,
    });
    return false;
  }
}
