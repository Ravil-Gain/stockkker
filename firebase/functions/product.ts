import {
  collection,
  doc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  setDoc,
  where,
} from "firebase/firestore";
import { database } from "../config";
import { createLog } from "./log";
import { IProduct } from "../firestore/product";
import { v4 } from "uuid";

const productsCollection = collection(database, "products").withConverter({
  toFirestore: (data: IProduct) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as IProduct,
});

export async function createProduct(userUid: string, product: IProduct) {
  try {
    const docRef = doc(productsCollection, product.id);
    await setDoc(docRef, {
      ...product,
      id: docRef.id,
    });

    console.log("Product written with ID: ", docRef.id);
    await createLog({
      id: v4(),
      type: "log",
      desc: "Created new Product",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [docRef.id],
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding Product: ", e);
    await createLog({
      id: v4(),
      type: "error",
      desc: `Error Creating new Product, ${name}, wooId:${product.wooId}`,
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: product.consumables.map((c) => c.id),
      relatedProducts: [],
    });
    return false;
  }
}

export async function getProducts() {
  const lists = query(productsCollection, where("active", "==", true));
  // get the products
  const querySnapshot = await getDocs(lists);
  return querySnapshot.docs.map((item) => {
    return { ...item.data(), id: item.id };
  });
}
