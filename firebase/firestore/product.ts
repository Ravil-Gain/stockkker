export interface ConsumablesDocument {
  amount: number;
  consumableId: string;
}

declare enum UnitsEmun {
  "gram",
  "liter",
  "unit",
}

export interface ListDocument {
  id: string;
  // Id from wordPress
  productId:string;
  name: string;
  imgUrl: string;

  // Custom object of consumables required
  consumables: string[];

  // if bundle, set relative products
  isBundle: boolean;
  products: string[];

  // measurementUnits: UnitsEmun;

  // what about bundles?
  packageSize: number;
  packagesOnShelf: number;

  boxSize: number;
  boxesOnStock:number;

  active: boolean;
}
