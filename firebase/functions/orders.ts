import { createLog } from "./log";
import { IOrder } from "../firestore/order";
import { database } from "../config";
import {
  collection,
  query,
  getDocs,
  deleteDoc,
  QueryDocumentSnapshot,
  doc,
  setDoc,
} from "firebase/firestore";
import { v4 } from "uuid"

const ordersCollection = collection(database, "orders").withConverter({
  toFirestore: (data: IOrder) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as IOrder,
});

export async function createOrder(userUid: string, order: IOrder) {
  try {
    const docRef = doc(ordersCollection, order.id);
    await setDoc(docRef, {
      ...order,
      id: docRef.id,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding Order: ", error);
    await createLog({
      id: v4(),
      type: "error",
      desc: "Error adding Order",
      userUid: userUid,
      orders: [order.id],
      timeStamp: new Date(),
      relatedConsumables: order.products,
      relatedProducts: order.consumables,
    });
    return false;
  }
}

export async function getOrders() {
  const lists = query(ordersCollection);
  const querySnapshot = await getDocs(lists);
  return querySnapshot.docs.map((item) => {
    return { ...item.data(), id: item.id };
  });
}

export async function deleteOrder(userUid: string, orderId: string) {
  try {
    const docRef = doc(ordersCollection, orderId);
    await deleteDoc(docRef);

    console.log("Order Deleted:", docRef.id);
    await createLog({
      id: v4(),
      type: "log",
      desc: "Order Deleted",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [docRef.id],
    });
    return true;
  } catch (error) {
    await createLog({
      id: v4(),
      type: "error",
      desc: `Error deleting Order, ${orderId}`,
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
    });
    return false;
  }
}
