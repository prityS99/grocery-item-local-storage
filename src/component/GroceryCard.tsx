import Image from "next/image";
import { useAppDispatch } from "./hooks/hook";
import { addItem } from "./hooks/redux/slice/cartSlice";

interface Props {
  id: number;
  image: string;
  name: string;
  price: number;
}

export const GroceryCard = ({ id, image, name, price, category }: { id: number; image: string; name: string; price: number; category: string }) => {
  const dispatch = useAppDispatch();
  return (
    <div className="border p-4 rounded flex flex-col items-center">
      <Image src={image} alt={name} width={100} height={100} />
      <h3 className="mt-2 font-semibold">{name}</h3>
      <p>₹{price}</p>
      <button
        className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
        onClick={() => dispatch(addItem({ id, name, price, category, image }))}
      >
        Add
      </button>
    </div>
  );
};
