export interface IRaportItem {
  type: "product" | "consumable";
  id: string;
  amount: number;
}

export interface IRaport {
  id: string;
  date: Date;
  userId: string;
  description: string;
  raportSubjects: IRaportItem[];
}
