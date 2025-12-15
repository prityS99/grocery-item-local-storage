
import { useAppDispatch } from "../hooks/hook";
import { removeItem } from "../hooks/redux/slice/cartSlice";

interface CartProps {
  cart: GroceryItem[];
}

export default function Cart({ cart }: CartProps) {
  const dispatch = useAppDispatch();

  return (
    <>
      {cart.map((item, i) => (
        <div key={i} className="flex justify-between">
          <span>{item.name}</span>
          <button
            className="text-red-500"
            onClick={() => dispatch(removeItem(item))}
          >
            Remove
          </button>
        </div>
      ))}
    </>
  );
}
