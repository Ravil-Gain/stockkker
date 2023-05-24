import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { database } from "../config";
import { useAuth } from "@/context/authContext";

const productsCollection = collection(database, "products");

export async function createProduct(
  wooId: string,
  name: string,
  imgUrl: string,
  consumables: string[],
  isBundle: boolean,
  products: string[],
  packageSize: number,
  packagesOnShelf: number,
  boxSize: number,
  boxesOnStock: number
) {
  try {
    const user = useAuth();
    const userUid: string = user.authUser!.uid || "";
    if (!userUid) throw new Error("No User");

    const docRef = await addDoc(productsCollection, {
      wooId,
      name,
      imgUrl,
      consumables,
      isBundle,
      products,
      packageSize,
      packagesOnShelf,
      boxSize,
      boxesOnStock,
      active: true,
    });
    console.log("Product written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding Product: ", e);
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
