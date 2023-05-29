export interface IProductConsumables {
  id: string;
  name:string;
  amount: number;
}


export interface IProduct {
  id: string;
  wooId: string;
  name: string;
  imgUrl: string;

  // Custom object of consumables required
  consumables: IProductConsumables[];

  // if bundle, set relative products
  isBundle: boolean;
  products: string[];

  // measurementUnits: UnitsEmun;

  // what about bundles?
  packageSize: number;
  packagesOnShelf: number;

  boxSize: number;
  boxesOnStock: number;

  active: boolean;
}
