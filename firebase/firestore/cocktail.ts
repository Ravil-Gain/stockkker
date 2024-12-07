export interface Iingredient {
    product: string;
    amount: number;
}

export interface ICocktail {
    id: string;
    name: string;
    imgUrl?: string;
    active: boolean;
    ingredients: Iingredient[];
}