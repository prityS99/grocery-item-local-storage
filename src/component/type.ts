type GroceryItem = {
  id: number;
  name: string;
  price: number;
  category: string;
};

type CartAction = {
  type: "ADD" | "REMOVE";
  item: GroceryItem;
};
