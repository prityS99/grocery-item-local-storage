import { GroceryItem } from "@/component/hooks/redux/slice/cartSlice";

const CART_KEY = "cart";

// Load the cart array from localStorage
export const loadCart = (): GroceryItem[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

// Save the cart array to localStorage
export const saveCart = (cart: GroceryItem[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};
