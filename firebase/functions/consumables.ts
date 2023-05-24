import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  where,
} from "firebase/firestore";
import { database } from "../config";
import { useAuth } from "@/context/authContext";
import { createLog } from "./log";

const consumablessCollection = collection(database, "consumables");

export async function createConsumable(
  userUid: string,
  name: string,
  description: string,
  amount: number
) {
  try {
    const docRef = await addDoc(consumablessCollection, {
      name: name,
      description: description,
      amount: amount,
      created: Timestamp.now(),
    });
    console.log("Consumables written with ID: ", docRef.id);
    await createLog(
      "log",
      userUid,
      "Created new Consumable",
      [],
      [],
      [docRef.id]
    );
    return docRef.id;
  } catch (e) {
    console.error("Error adding Consumables: ", e);
    await createLog("error", userUid, "Error adding Consumables", [], [], []);
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
