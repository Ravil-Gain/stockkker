import {
  QueryDocumentSnapshot,
  collection,
  doc,
  setDoc,
} from "firebase/firestore";
import { IRaport } from "../firestore/raport";
import { database } from "../config";

const raportCollection = collection(database, "raport").withConverter({
  toFirestore: (data: IRaport) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as IRaport,
});

export async function createRaport(raport: IRaport) {
  try {
    const docRef = doc(raportCollection, raport.id);
    await setDoc(docRef, {
      ...raport,
      id: docRef.id,
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding Product: ", e);
    return false;
  }
}
