import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../config";
import { createLog } from "./log";
import { IProduct } from "../firestore/product";
import { v4 } from "uuid";

const productsCollection = collection(database, "liquids").withConverter({
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
      relatedProducts: [docRef.id],
    });
    return docRef.id;
  } catch (e) {
    console.error("Error adding Product: ", e);
    await createLog({
      id: v4(),
      type: "error",
      desc: `Error Creating new Product, ${product}`,
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedProducts: [],
    });
    return false;
  }
}

export async function editProduct(product: IProduct) {
  try {
    const docRef = doc(productsCollection, product.id);
    const prod = (await getDoc(docRef)).data();
    if (!prod) throw new Error("No Product");

    const result = await updateDoc(docRef, {
      name: product.name,
      price: product.price,
    });
    return result;
  } catch (error) {
    return false;
  }
}

export async function getProducts() {
  // const lists = query(productsCollection, where("active", "==", true));
  const lists = query(productsCollection);
  // get the products
  const querySnapshot = await getDocs(lists);
  return querySnapshot.docs.map((item) => {
    return { ...item.data(), id: item.id };
  });
}

export async function getProductsSnapshot() {
  return query(productsCollection);
}
