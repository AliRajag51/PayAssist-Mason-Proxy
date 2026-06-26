export type Product = {
  id: string;
  name: string;
  cat: string;
  price: number;
  badge?: string;
  img: string;
  desc: string;
};

export type CartLine = {
  uid: string;
  id: string;
  name: string;
  finish: string;
  price: number;
  qty: number;
  img: string;
};

export const money = (n: number) => "$" + n.toLocaleString();
