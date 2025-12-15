import { GroceryItem } from "@/component/hooks/redux/slice/cartSlice";

const CART_KEY = "cart";

export const loadCart = (): GroceryItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: GroceryItem) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};
