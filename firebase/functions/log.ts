import {
  collection,
  doc,
  QueryDocumentSnapshot,
  setDoc,
} from "firebase/firestore";
import { database } from "../config";
import { ILog } from "../firestore/log";

const logsCollection = collection(database, "logs").withConverter({
  toFirestore: (data: ILog) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as ILog,
});

export async function createLog(log: ILog) {
  try {
    const docRef = doc(logsCollection, log.id);
    await setDoc(docRef, {
      ...log,
      id: docRef.id,
    });
    console.log("Log written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding Log: ", e);
  }

  return true;
}
