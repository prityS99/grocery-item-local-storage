import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface CartState {
  items: GroceryItem[];
  history: CartAction[];
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
  state.items.push(action.payload);

  state.history.push({
    type: "ADD",
    item: action.payload,
  });
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

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: addItemReducer,
    removeItem: removeItemReducer,
    undoLast: undoLastReducer,
  },
});


export const {
  addItem,
  removeItem,
  undoLast,
} = cartSlice.actions;

export default cartSlice.reducer;




