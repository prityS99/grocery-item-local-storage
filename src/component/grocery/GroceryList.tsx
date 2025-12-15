import { useAppDispatch } from "../hooks/hook";
import { addItem } from "../hooks/redux/slice/cartSlice";


interface GroceryListProps {
  items: GroceryItem[];
}

export default function GroceryList({ items }: GroceryListProps) {
  const dispatch = useAppDispatch();

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="border p-4 rounded flex justify-between"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm">₹{item.price}</p>
          </div>

          <button
            onClick={() => dispatch(addItem(item))}
            className="bg-green-600 text-white px-3 rounded"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}
