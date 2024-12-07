import { AuthUserState } from "../authUser";

export type orderStatus = 'order'| 'process' | 'ready' | 'done';

export interface IOrderElement {
  id:string;
  cocktail: string;
  status: orderStatus;
  price?: number;
}

export interface IOrder {
  id: string;
  customer: AuthUserState;
  start_date: any;
  end_date?: any;
  cocktails: IOrderElement[];
}
