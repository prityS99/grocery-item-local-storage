import Image from "next/image";

export interface CartItem {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
}

interface GroceryCardProps {
  id: number;
  image: string;
  name: string;
  price: number;
  category: string;
}


const GroceryCard = ({
  id,
  image,
  name,
  price,
  category,
}: GroceryCardProps) => {
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
    </div>
  );
};

export default GroceryCard;
