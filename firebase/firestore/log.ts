export interface ILog {
  id: string;
  type: 'log' | 'error';
  desc: string;
  userUid: string;
  orders: string[];
  timeStamp: Date;
  relatedProducts: string[];
  relatedConsumables: string[];
}
