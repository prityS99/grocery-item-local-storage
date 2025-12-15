import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GroceryItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export type HistoryActionType = "ADD" | "REMOVE" | "INCREMENT";

export interface CartHistory {
  type: HistoryActionType;
  item: GroceryItem;
}

export interface CartState {
  items: GroceryItem[];
  history: CartHistory[];
}

export const initialState: CartState = {
  items: [],
  history: [],
};

//-- ADD -- //
const addItemReducer = (
  state: CartState,
  action: PayloadAction<GroceryItem>
) => {
  const existingItem = state.items.find(
    (item) => item.id === action.payload.id
  );

  if (existingItem) {
    existingItem.quantity += 1;

    state.history.push({
      type: "INCREMENT",
      item: { ...existingItem },
    });
  } else {
    state.items.push({ ...action.payload, quantity: 1 });

    state.history.push({
      type: "ADD",
      item: { ...action.payload, quantity: 1 },
    });
  }
};


//-- REMOVE -- //
const removeItemReducer = (
  state: CartState,
  action: PayloadAction<GroceryItem>
) => {
  const index = state.items.findIndex(
    (item) => item.id === action.payload.id
  );

  if (index === -1) return;

  const removedItem = state.items[index];
  state.items.splice(index, 1);

  state.history.push({
    type: "REMOVE",
    item: removedItem,
  });
};


//--UNDO --//
const undoLastReducer = (state: CartState) => {
  const lastAction = state.history.pop();
  if (!lastAction) return;

  if (lastAction.type === "ADD") {
    state.items.pop();
  } else {
    state.items.push(lastAction.item);
  }
 
};

const setCartFromStorageReducer = (state: CartState, action: PayloadAction<GroceryItem[]>) => {
  state.items = action.payload;
  // optional: clear history when loading from storage
  state.history = [];
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: addItemReducer,
    removeItem: removeItemReducer,
    undoLast: undoLastReducer,
    setCartFromStorage: setCartFromStorageReducer
  },
});


export const {
  addItem,
  removeItem,
  undoLast,
  setCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;




