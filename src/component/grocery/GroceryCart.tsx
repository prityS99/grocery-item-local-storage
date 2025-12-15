"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { addItem, removeItem, setCartFromStorage, undoLast } from "../hooks/redux/slice/cartSlice";
import { loadCart, saveCart } from "@/utils/localStorage";
import Image from "next/image";

// ------------------ STATIC DATA ------------------
const GROCERY_ITEMS = [
  { id: 1, image: "/apple.jpg", name: "Eat healthy", price: 8869, category: "Fruit" },
  { id: 2, image: "/grapes.jpg", name: "Grapes", price: 1740, category: "Dress" },
  { id: 3, image: "/milk.jpg", name: "Milk", price: 4857, category: "Wearings" },
  { id: 4, image: "/pine.jpg", name: "Umbrella", price: 3580, category: "Things" },
  { id: 5, image: "/chocolate.jpg", name: "Watch", price: 12000, category: "Things" },
    { id: 5, image: "/watermelon.jpg", name: "Headphone", price: 1920, category: "Things" },
];

const COUPONS: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
};

// ------------------ Component Interfaces ------------------
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface GroceryCardProps extends CartItem {}

// ------------------ GroceryCard Component (Modernized) ------------------
const GroceryCard = ({ id, image, name, price, category }: GroceryCardProps) => {
  const dispatch = useAppDispatch();
  
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col items-center p-6 border border-gray-100">
      <div className="relative w-full h-50 mb-4">
        <Image 
          src={image} 
          alt={name} 
          layout="fill"
          objectFit="contain"
          className="rounded-t-lg"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800 text-center">{name}</h3>
      <p className="text-sm text-indigo-600 font-semibold mt-1">₹{price}</p>
      <p className="text-xs text-gray-500 mt-0.5">{category}</p>
      <button
        className="mt-4 w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md transform hover:scale-[1.01] active:scale-[0.99]"
        onClick={() => dispatch(addItem({ id, name, price, image, category }))}
      >
        Add to Cart
      </button>
    </div>
  );
};

// ------------------ Summary Component (Modernized) ------------------
interface SummaryProps {
  subtotal: number;
  thresholdDiscount: number;
  couponDiscount: number;
  total: number;
  coupon: string;
  setCoupon: (v: string) => void;
  isCartEmpty: boolean;
}

const Summary = ({ subtotal, thresholdDiscount, couponDiscount, total, coupon, setCoupon, isCartEmpty }: SummaryProps) => {
  const dispatch = useAppDispatch();
  
  const SummaryLine = ({ label, value, isTotal = false, isDiscount = false }: { label: string, value: number, isTotal?: boolean, isDiscount?: boolean }) => (
    <div className={`flex justify-between items-center ${isTotal ? 'text-xl font-bold border-t pt-2 mt-2' : 'text-gray-600'}`}>
      <span className={isTotal ? 'text-gray-800' : ''}>{label}</span>
      <span className={`${isDiscount ? 'text-red-500' : isTotal ? 'text-indigo-600' : 'text-gray-800'} font-semibold`}>
        {isDiscount ? '-₹' : '₹'}{Math.abs(value).toFixed(2)}
      </span>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
      <h2 className="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">Order Summary</h2>
      
      <div className="space-y-3">
        <SummaryLine label="Subtotal" value={subtotal} />
        <SummaryLine label="Threshold Discount (10%)" value={thresholdDiscount} isDiscount={thresholdDiscount > 0} />
        <SummaryLine label={`Coupon Discount (${COUPONS[coupon] || 0}%)`} value={couponDiscount} isDiscount={couponDiscount > 0} />
        <SummaryLine label="Total" value={total} isTotal={true} />
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex gap-2">
          <input
            className="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            placeholder="Enter Coupon Code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          />
          <button 
            className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-150 active:scale-95"
            onClick={() => setCoupon("")}
            disabled={!coupon}
          >
            Clear
          </button>
        </div>

        <button 
          className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg shadow-red-200 disabled:opacity-50 active:scale-[0.99]"
          onClick={() => dispatch(undoLast())}
          disabled={isCartEmpty}
        >
          ↩️ Undo Last Action
        </button>
        <button 
          className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg shadow-green-200 disabled:opacity-50 active:scale-[0.99]"
          disabled={isCartEmpty}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

// ------------------ Main Component (Modernized Layout) ------------------
export default function GroceryCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);
  const isCartEmpty = cart.length === 0;

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [coupon, setCoupon] = useState("");

  // Load from storage on mount
  useEffect(() => {
    const storedCart = loadCart();
    if (storedCart.length) {
      dispatch(setCartFromStorage(storedCart));
    }
  }, [dispatch]);

  // Save to storage on cart change
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  // Filtered and Sorted Items
  const filteredItems = useMemo(() => {
    let items = [...GROCERY_ITEMS];

    if (search) items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") items = items.filter((i) => i.category === category);

    return items.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  }, [search, category, sort]);

  // Calculation Logic
  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  const thresholdDiscount = subtotal > 200 ? subtotal * 0.1 : 0;
  const couponDiscount = COUPONS[coupon] ? (subtotal * COUPONS[coupon]) / 100 : 0;
  const total = subtotal - thresholdDiscount - couponDiscount;

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
          🛒 Modern E-Commerce Store
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            {/* Controls */}
            <div className="bg-white p-6 rounded-xl shadow-md flex flex-wrap gap-4 items-center justify-between">
              <input
                className="flex-1 min-w-[150px] border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select 
                className="border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                <option value="Fruit">Fruit</option>
                <option value="Dress">Dairy</option>
                <option value="Wearings">Chocolates</option>
        
              </select>
              <select 
                className="border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" 
                value={sort} 
                onChange={(e) => setSort(e.target.value as "asc" | "desc")}
              >
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
              </select>
            </div>

            {/* Item List */}
            <h2 className="text-2xl font-bold text-gray-800">Available Products</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <GroceryCard key={item.id} {...item} />
              ))}
            </div>
          </div>

          {/* Sidebar/Summary Area */}
          <div className="lg:col-span-4 mt-8 lg:mt-0 sticky top-10">
            <Summary
              subtotal={subtotal}
              thresholdDiscount={thresholdDiscount}
              couponDiscount={couponDiscount}
              total={total}
              coupon={coupon}
              setCoupon={setCoupon}
              isCartEmpty={isCartEmpty}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useAppDispatch, useAppSelector } from "../hooks/hook";
// import { addItem, removeItem, setCartFromStorage, undoLast } from "../hooks/redux/slice/cartSlice";
// import { loadCart, saveCart  } from "@/utils/localStorage";
// import Image from "next/image";


// interface GroceryCardProps {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   category: string; // this is important
// }

// // ------------------ STATIC DATA ------------------
// const GROCERY_ITEMS = [
//   { id: 1, image: "/apple.jpg", name: "Apple", price: 89, category: "Fruit" },
//   { id: 2, image: "/dress.webp", name: "Dress", price: 1740, category: "Dress" },
//   { id: 3, image: "/dress-2.jpg", name: "Dress - Modern", price: 4857, category: "Wearings" },
//   { id: 4, image: "/umbrella.jpg", name: "Umbrella", price: 3580, category: "Things" },
//   { id: 5, image: "/watch.jpg", name: "Watch", price: 12000, category: "Things" },
// ];

// const COUPONS: Record<string, number> = {
//   SAVE10: 10,
//   SAVE20: 20,
// };

// const GroceryCard = ({ id, image, name, price, category }: GroceryCardProps) => {
//   const dispatch = useAppDispatch();

//   return (
//     <div className="border p-4 rounded flex flex-col items-center">
//       <Image src={image} alt={name} width={100} height={100} />
//       <h3 className="mt-2 font-semibold">{name}</h3>
//       <p>₹{price}</p>
//       <button
//         className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
//         onClick={() =>
//           dispatch(addItem({ id, name, price, image, category }))
//         }
//       >
//         Add
//       </button>
//     </div>
//   );
// };


// // ------------------ Main Component ------------------
// export default function GroceryCart() {
//   const dispatch = useAppDispatch();
//   const cart = useAppSelector((state) => state.cart.items);

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [sort, setSort] = useState<"asc" | "desc">("asc");
//   const [coupon, setCoupon] = useState("");

// useEffect(() => {
//   const storedCart = loadCart();
//   if (storedCart.length) {
//     dispatch(setCartFromStorage(storedCart));
//   }
// }, [dispatch]);

// useEffect(() => {
//   saveCart(cart);
// }, [cart]);

//   // ------------------ FILTER & SORT ------------------
//   const filteredItems = useMemo(() => {
//     let items = [...GROCERY_ITEMS];

//     if (search) {
//       items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
//     }

//     if (category !== "All") {
//       items = items.filter((i) => i.category === category);
//     }

//     return items.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
//   }, [search, category, sort]);

//   // ------------------ PRICE ------------------
//   const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
//   const thresholdDiscount = subtotal > 200 ? subtotal * 0.1 : 0;
//   const couponDiscount = COUPONS[coupon] ? (subtotal * COUPONS[coupon]) / 100 : 0;
//   const total = subtotal - thresholdDiscount - couponDiscount;

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-6">
//       <h1 className="text-3xl font-bold">🛒 Grocery Cart</h1>

//       {/* Controls */}
//       <div className="flex gap-3 flex-wrap">
//         <input
//           className="border px-3 py-2 rounded"
//           placeholder="Search"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />

//         <select className="border px-3 py-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
//           <option>All</option>
//           <option>Fruit</option>
//           <option>Dress</option>
//           <option>Wearings</option>
//           <option>Things</option>
//         </select>

//         <select className="border px-3 py-2 rounded" value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")}>
//           <option value="asc">Price ↑</option>
//           <option value="desc">Price ↓</option>
//         </select>
//       </div>

//       {/* Item List */}
//       <div className="grid md:grid-cols-2 gap-4">
//         {filteredItems.map((item) => (
//           <GroceryCard key={item.id} {...item} />
//         ))}
//       </div>

//       {/* Cart */}
//       <div className="border-t pt-4">
//         <h2 className="text-xl font-semibold">Cart</h2>

//         {cart.map((item, i) => (
//           <div key={i} className="flex justify-between items-center">
//             <span>{item.name}</span>
//             <button className="text-red-500" onClick={() => dispatch(removeItem(item))}>
//               Remove
//             </button>
//           </div>
//         ))}

//         <div className="mt-4 space-y-1">
//           <p>Subtotal: ₹{subtotal}</p>
//           <p>Threshold Discount: -₹{thresholdDiscount.toFixed(2)}</p>
//           <p>Coupon Discount: -₹{couponDiscount.toFixed(2)}</p>
//           <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
//         </div>

//         <div className="flex gap-2 mt-3">
//           <input
//             className="border px-3 py-2 rounded"
//             placeholder="Coupon"
//             value={coupon}
//             onChange={(e) => setCoupon(e.target.value.toUpperCase())}
//           />
//           <button className="border px-3 py-2 rounded" onClick={() => dispatch(undoLast())}>
//             Undo Last
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
