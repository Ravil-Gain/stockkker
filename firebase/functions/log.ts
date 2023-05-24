import { addDoc, collection, Timestamp } from "firebase/firestore";
import { database } from "../config";

export async function createLog(
  type: string,
  userUid: string,
  desc: string,
  orders: string[],
  relatedProducts: string[],
  relatedConsumables: string[]
) {
  try {
    const docRef = await addDoc(collection(database, "logs"), {
      type: type,
      desc: desc,
      userId: userUid,
      timeStamp: Timestamp.now(),
      orders: orders,
      relatedProducts: relatedProducts,
      relatedConsumables: relatedConsumables,
    });
    console.log("Log written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding Log: ", e);
  }

  return true;
}
