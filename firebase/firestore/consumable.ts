// import { Timestamp } from "firebase/firestore";

export interface ListDocument {
  id: string;
  name: string;
  userId: string;
//   created: Timestamp;
  products: string[];
}
