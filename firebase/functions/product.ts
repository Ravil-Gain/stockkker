import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  QueryDocumentSnapshot,
  setDoc,
  updateDoc,
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

export async function editProduct(userUid: string, product: IProduct) {
  try {
    const docRef = doc(productsCollection, product.id);

    const prod = (await getDoc(docRef)).data();
    if (!prod) throw new Error("No Product");

    const result = await updateDoc(docRef, {
      packageSize: product.packageSize,
      packagesOnShelf: product.packagesOnShelf,
      boxSize: product.boxSize,
      boxesOnStock: product.boxesOnStock,
    });
    await createLog({
      id: v4(),
      type: "log",
      desc: "Product Updated",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [docRef.id],
    });
    return result;
  } catch (error) {
    await createLog({
      id: v4(),
      type: "error",
      desc: "Error Product Updating",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [product.id],
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

export function getProductsSnapshot() {
  return query(productsCollection);
}

export async function changeShelfProductAmounts(
  id: string,
  amount: number,
  userUid: string
) {
  if (!userUid || userUid === "") return;
  try {
    const docRef = doc(productsCollection, id);
    updateDoc(docRef, { packagesOnShelf: increment(amount) });
    await createLog({
      id: v4(),
      type: "log",
      desc: `Product amounts changed ${amount}`,
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [docRef.id],
    });

    return docRef.id;
  } catch (error) {
    await createLog({
      id: v4(),
      type: "error",
      desc: "Error with Product amounts",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
    });

    return false;
  }
}

export async function dispatchProduct(id: string, userUid: string) {
  try {
    const docRef = doc(productsCollection, id);

    const product = (await getDoc(docRef)).data();
    if (!product) throw new Error("No Product");

    const toShelf = product.boxSize / product.packageSize;
    await updateDoc(docRef, {
      packagesOnShelf: increment(toShelf),
      boxesOnStock: increment(-1),
    });
    await createLog({
      id: v4(),
      type: "log",
      desc: `Product dispatched, to shelf ${toShelf}`,
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [product.id],
    });
    return true;
  } catch (error: any) {
    await createLog({
      id: v4(),
      type: "error",
      desc: `Error with Product dispatching ${error.message.toString() || ""}`,
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
    });
    return false;
  }
}
