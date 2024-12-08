import { ICocktail } from "@/firebase/firestore/cocktail";
import { IProduct } from "@/firebase/firestore/product";

export function calculatePrice(
  cocktail: ICocktail,
  products: IProduct[]
): number {
  const tottal =
    cocktail.ingredients
      .map(
        (i) =>
          ((products.find((p) => p.id === i.product)?.price || 1) * i.amount) /
          1000
      )
      .reduce((partialSum, a) => partialSum + a, 0) || 0;
  return Math.round(tottal * 100) / 100;
}
