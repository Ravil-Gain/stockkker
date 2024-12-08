import { IOrder, IOrderElement, orderStatus } from "../firestore/order";
import { database } from "../config";
import {
  collection,
  query,
  getDocs,
  QueryDocumentSnapshot,
  doc,
  setDoc,
  getDoc,
  Timestamp,
  where,
  arrayUnion,
  updateDoc,
} from "firebase/firestore";
import { v4 } from "uuid";
import { AuthUserState } from "../authUser";
import { ICocktail } from "../firestore/cocktail";

const ordersCollection = collection(database, "check").withConverter({
  toFirestore: (data: IOrder) => data,
  fromFirestore: (snap: QueryDocumentSnapshot) => snap.data() as IOrder,
});

export async function orderCocktail(customer: AuthUserState, orderId: string|undefined, cocktail: IOrderElement) {
  try {
    if (orderId) {
      const docRef = doc(ordersCollection, orderId);
      await setDoc(
        docRef,
        {
          cocktails: arrayUnion(cocktail),
        },
        { merge: true }
      );
    } else {
      const docRef = doc(ordersCollection, v4());
      await setDoc(
        docRef,
        {
          customer,
          cocktails: [cocktail],
          start_date: Timestamp.fromDate(new Date()),
          id: docRef.id,
        }
      );
    }
  } catch (error) {}
}

export async function getCocktail(orderId: string|undefined, cocktail: ICocktail) {
  try {
    const snap = await getDoc(doc(ordersCollection, orderId));
    if (!snap.exists()) {
      console.log("No such order");
      return false;
    }
    const coctailsArray = snap.data().cocktails;
    const currentCocktailIndex = coctailsArray.findIndex(
      (c) => c.cocktail === cocktail.id && c.status === 'ready'
    );

    if (currentCocktailIndex < 0) {
      console.log("No such cocktail ordered, ", cocktail.id);
      return false;
    }

    coctailsArray[currentCocktailIndex].status = 'done';

    const docRef = doc(ordersCollection, orderId);

    await updateDoc(docRef, { cocktails:coctailsArray });
  } catch (error) {}
}
export async function cancelCocktail(orderId: string|undefined, cocktailId: string) {
  try {
    const snap = await getDoc(doc(ordersCollection, orderId));
    if (!snap.exists()) {
      console.log("No such order");
      return false;
    }
    const coctailsArray = snap.data().cocktails;
    const currentCocktailIndex = coctailsArray.findIndex(
      (c) => c.cocktail === cocktailId && c.status === 'order'
    );

    if (currentCocktailIndex < 0) {
      console.log("No such cocktail ordered or wrong status ", cocktailId);
      return false;
    }

    // coctailsArray[currentCocktailIndex].status = 'done';
    coctailsArray.splice(currentCocktailIndex, 1);

    const docRef = doc(ordersCollection, orderId);

    await updateDoc(docRef, { cocktails:coctailsArray });
  } catch (error) {}
}

export async function changeOrderCocktailStatus(
  orderId: string,
  cocktail: IOrderElement,
  newStatus: orderStatus
) {
  try {
    const snap = await getDoc(doc(ordersCollection, orderId));
    if (!snap.exists()) {
      console.log("No such order");
      return false;
    }
    const coctailsArray = snap.data().cocktails;
    console.log(coctailsArray, cocktail.cocktail);
    
    const currentCocktailIndex = coctailsArray.findIndex(
      (c) => c.id === cocktail.id
    );

    if (currentCocktailIndex < 0) {
      console.log("No such cocktail ordered, ", cocktail.cocktail);
      return false;
    }

    coctailsArray[currentCocktailIndex].status = newStatus;

    const docRef = doc(ordersCollection, orderId);

    await updateDoc(docRef, { cocktails:coctailsArray });
  } catch (error) {}
}

export async function getMyOrder(userUid: string) {
  try {
    const list = query(ordersCollection, where("customer.uid", "==", userUid));
    const querySnapshot = await getDocs(list);
    return querySnapshot.docs
      .filter((d) => !d.data().end_date)
      .map((item) => {
        return { ...item.data(), id: item.id };
      })[0];
  } catch (error) {
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

export async function getActiveOrders() {
  const lists = query(ordersCollection);
  const querySnapshot = await getDocs(lists);
  return querySnapshot.docs.filter(d=>!d.data().end_date).map((item) => {
    return { ...item.data(), id: item.id };
  });
}

export async function getOrdersSnapshot() {
  const lists = query(ordersCollection);
  return lists;
}

export async function completeOrder(orderId: string) {
  try {
    const docRef = doc(ordersCollection, orderId);
    await setDoc(
      docRef,
      {
        end_date: Timestamp.fromDate(new Date()),
      },
      { merge: true }
    );
    console.log("Order Completed:", docRef.id);
    return true;
  } catch (error) {
    return `Error completing Order, ${orderId}`;
  }
}
