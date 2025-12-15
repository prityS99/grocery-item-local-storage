import { HistoryActionType } from "./hooks/redux/slice/cartSlice";

type GroceryItem = {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
};

type CartAction = {
  type: "ADD" | "REMOVE";
  item: GroceryItem;
};


interface CartHistory {
  type: HistoryActionType;
  item: GroceryItem;
}
