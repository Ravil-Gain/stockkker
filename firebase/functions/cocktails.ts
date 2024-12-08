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
import { ICocktail, Iingredient } from "../firestore/cocktail";
import { v4 } from "uuid";

const cocktailsCollection = collection(database, "cocktails").withConverter({
  toFirestore: (data: ICocktail) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as ICocktail,
});

export async function createCocktail(userUid: string, cocktail: ICocktail) {
  try {
    const docRef = doc(cocktailsCollection, cocktail.id);
    await setDoc(docRef, {
      ...cocktail,
      id: docRef.id,
    });
    console.log("cocktail written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding Cocktail: ", e);
    return false;
  }
}

export async function activateCocktail(
  id: string,
) {
  try {
    const docRef = doc(cocktailsCollection, id);
    updateDoc(docRef, { active: true });
    return docRef.id;
  } catch (error) {
    return false;
  }
}

export async function deactivateCocktail(
  id: string,
) {
  try {
    const docRef = doc(cocktailsCollection, id);
    updateDoc(docRef, { active: false });
    return docRef.id;
  } catch (error) {
    return false;
  }
}

export async function updateCocktail(
  id: string,
  userUid: string,
  name: string,
  ingredients: Iingredient[],
  active: boolean,
  imgUrl?: string,
) {
  if (!userUid || userUid === "") return;
  try {
    const docRef = doc(cocktailsCollection, id);
    updateDoc(docRef, { name, imgUrl, ingredients, active });
    await createLog({
      id: v4(),
      type: "log",
      desc: "Cocktail update",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedProducts: [],
    });
    return docRef.id;
  } catch (error) {
    await createLog({
      id: v4(),
      type: "error",
      desc: "Error updating Cocktail",
      userUid: userUid,
      orders: [],
      timeStamp: new Date(),
      relatedProducts: [],
    });
    return false;
  }
}
export async function editCocktail(cocktail: ICocktail) {
  try {
    const docRef = doc(cocktailsCollection, cocktail.id);
    const cockt = (await getDoc(docRef)).data();
    if (!cockt) throw new Error("No Cocktail");

    const result = await updateDoc(docRef, {
      name: cocktail.name,
      ingredients: cocktail.ingredients
    });
    return result;
  } catch (error) {
    return false;
  }
}

export async function getCocktails() {
  const lists = query(cocktailsCollection);
  // get the products
  const querySnapshot = await getDocs(lists);
  return querySnapshot.docs.map((item) => {
    return { ...item.data(), id: item.id };
  });
}


export async function getCocktailsSnapshot() {
  return query(cocktailsCollection);
}
