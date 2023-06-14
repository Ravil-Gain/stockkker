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
  getDoc,
} from "firebase/firestore";

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
    return true;
  } catch (error: any) {
    return `Error adding Order, ${error.message.toString() || ""}`;
  }
}

export async function getOrder(id: string) {
  try {
    const snap = await getDoc(doc(ordersCollection, id));
    if (!snap.exists()) {
      console.log("No such document");
      return false;
    }
    return snap.data();
  } catch (error) {
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

export async function getOrdersSnapshot() {
  const lists = query(ordersCollection);
  return lists;
}

export async function deleteOrder(userUid: string, orderId: string) {
  try {
    const docRef = doc(ordersCollection, orderId);
    await deleteDoc(docRef);
    console.log("Order Deleted:", docRef.id);
    return true;
  } catch (error) {
    return `Error deleting Order, ${orderId}`;
  }
}
