import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GroceryItem extends BaseProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}


export interface BaseProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
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
  action: PayloadAction<BaseProduct>
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

  const undoItem = lastAction.item;
  const existingItem = state.items.find(item => item.id === undoItem.id);

  switch (lastAction.type) {
    case "ADD":
      // Reverses an ADD: Removes the item that was just added.
      // Note: We should filter/splice, not just pop, in case another action occurred later.
      state.items = state.items.filter(item => item.id !== undoItem.id);
      break;

    case "REMOVE":
      // Reverses a REMOVE: Adds the removed item back to the cart.
      state.items.push(undoItem);
      break;

    case "INCREMENT":
      // Reverses an INCREMENT: Decreases the quantity of the existing item.
      if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
      }
      break;
      
    default:
      // Handle any unexpected action types
      console.warn(`Unknown action type for undo: ${lastAction.type}`);
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




