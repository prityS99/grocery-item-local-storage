"use client";

import Image from "next/image";
import { useAppDispatch } from "./hooks/hook";
import { addItem } from "./hooks/redux/slice/cartSlice";


export interface GroceryCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

const GroceryCard = ({ id, image, name, price, category }: GroceryCardProps) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    // Dispatch the product to the Redux slice
    dispatch(addItem({ id, name, price, image, category }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col items-center p-6 border border-gray-100">
      <div className="relative w-full h-50 mb-4">
        <Image
          src={image}
          alt={name}
          fill
          className="object-contain rounded-t-lg"
        />
      </div>

      <h3 className="text-lg font-bold text-gray-800 text-center">
        {name}
      </h3>
      <p className="text-sm text-indigo-600 font-semibold mt-1">
        ₹{price}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">
        {category}
      </p>

      {/* Add to Cart Button */}
      <button
        className="mt-4 w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md transform hover:scale-[1.01] active:scale-[0.99]"
        onClick={handleAddToCart}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default GroceryCard;
