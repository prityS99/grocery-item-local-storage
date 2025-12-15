"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { addItem, removeItem, setCartFromStorage, undoLast } from "../hooks/redux/slice/cartSlice";
import { loadCart, saveCart } from "@/utils/localStorage";
import Image from "next/image";

// ------------------ STATIC DATA & TYPES ------------------
const GROCERY_ITEMS = [
  { id: 1, image: "/apple.jpg", name: "Apple", price: 89, category: "Fruit" },
  { id: 2, image: "/chocolate.jpg", name: "Chocolate", price: 1740, category: "Chololate" },
  { id: 3, image: "/watermelon.jpg", name: "Watermelon", price: 4857, category: "Fruit" },
  { id: 4, image: "/grapes.jpg", name: "Grapes", price: 3580, category: "Fruit" },
  { id: 5, image: "/pine.jpg", name: "Pineapple", price: 12000, category: "Things" },
    { id: 5, image: "/milk.jpg", name: "Dairy", price: 12000, category: "Milk" },
];

const COUPONS: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
};

// Interface for a single grocery item (used for both product and cart item)
interface GroceryItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

// ------------------ Product Card Component ------------------
const GroceryCard = ({ id, image, name, price, category }: GroceryItem) => {
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

// ------------------ Cart Item Component (New/Fixed) ------------------
const CartItem = (item: GroceryItem) => {
    const dispatch = useAppDispatch();
    return (
        <div className="flex justify-between items-center p-3 border-b border-gray-100 last:border-b-0 bg-white hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
                <Image src={item.image} alt={item.name} width={40} height={40} className="rounded object-cover" />
                <div>
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-indigo-600">₹{item.price}</p>
                </div>
            </div>
            <button
                className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
                // FIX: Passing the single item object to removeItem
                onClick={() => dispatch(removeItem(item))} 
            >
                Remove
            </button>
        </div>
    );
};


// ------------------ Summary Component ------------------
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

// ------------------ Main Component ------------------
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
         Modern Grocery Store
        </h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
         
          <div className="lg:col-span-8 space-y-8">
          
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
                <option value="Dairy">Dairy</option>
                <option value="Chocolate">Chocolate</option>
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

           
            <h2 className="text-2xl font-bold text-gray-800">Available Products</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <GroceryCard key={item.id} {...item} />
              ))}
            </div>
          </div>

          
          <div className="lg:col-span-4 mt-8 lg:mt-0 space-y-8 sticky top-10">
            
            {/* Display Cart Items */}
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-gray-800 mb-4">Your Cart ({cart.length})</h2>
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  {cart.length === 0 ? (
                      <p className="p-4 text-gray-500 text-center">Your cart is empty. Add some items!</p>
                  ) : (
                     
                      cart.map((item, index) => (
                
                          <CartItem key={index} {...item} /> 
                      ))
                  )}
              </div>
            </div>

            {/* Summary */}
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
// import { addItem, GroceryItem, removeItem, setCartFromStorage, undoLast } from "../hooks/redux/slice/cartSlice";
// import { loadCart, saveCart } from "@/utils/localStorage";
// import Image from "next/image";

// const GROCERY_ITEMS = [
//   { id: 1, image: "/apple.jpg", name: "Eat healthy", price: 8869, category: "Fruit" },
//   { id: 2, image: "/grapes.jpg", name: "Grapes", price: 1740, category: "Dress" },
//   { id: 3, image: "/milk.jpg", name: "Milk", price: 4857, category: "Wearings" },
//   { id: 4, image: "/pine.jpg", name: "Pineapples", price: 3580, category: "Things" },
//   { id: 5, image: "/chocolate.jpg", name: "Chocolates", price: 12000, category: "Things" },
//   { id: 6, image: "/watermelon.jpg", name: "Watermelon", price: 1920, category: "Things" },
// ];

// const COUPONS: Record<string, number> = {
//   SAVE10: 10,
//   SAVE20: 20,
// };

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   image: string;
//   category: string;

// }

// export interface Product {
//   id: number;
//   image: string;
//   name: string;
//   price: number;
//   category: string;
// }

// interface GroceryCardProps extends CartItem {
//   onAdd: (item: CartItem) => void;
// }

// const GroceryCard = ({ id, image, name, price, category, onAdd }: GroceryCardProps) => {
//   return (
//     <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col items-center p-6 border border-gray-100">
//       <div className="relative w-full h-50 mb-4">
//         <Image 
//           src={image} 
//           alt={name} 
//           layout="fill"
//           objectFit="contain"
//           className="rounded-t-lg"
//         />
//       </div>
//       <h3 className="text-lg font-bold text-gray-800 text-center">{name}</h3>
//       <p className="text-sm text-indigo-600 font-semibold mt-1">₹{price}</p>
//       <p className="text-xs text-gray-500 mt-0.5">{category}</p>
//       <button
//         className="mt-4 w-full bg-indigo-600 text-white font-medium py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md transform hover:scale-[1.01] active:scale-[0.99]"
//         onClick={() => onAdd({ id, name, price, image, category })}
//       >
//         Add to Cart
//       </button>
//     </div>
//   );
// };

// export default function GroceryCart() {
//   const dispatch = useAppDispatch();
//   const cart = useAppSelector((state) => state.cart.items);
//   const isCartEmpty = cart.length === 0;

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const [sort, setSort] = useState<"asc" | "desc">("asc");
//   const [coupon, setCoupon] = useState("");

//   useEffect(() => {
//     const storedCart = loadCart();
//     if (storedCart.length) dispatch(setCartFromStorage(storedCart));
//   }, [dispatch]);

//   useEffect(() => {
//     saveCart(cart);
//   }, [cart]);


// const handleAddItem = (item: GroceryItem) => {
//   dispatch(addItem(item)); // item must be a single GroceryItem
// };


//   const filteredItems = useMemo(() => {
//     let items = [...GROCERY_ITEMS];
//     if (search) items = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
//     if (category !== "All") items = items.filter(i => i.category === category);
//     return items.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
//   }, [search, category, sort]);


//   const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
//   const thresholdDiscount = subtotal > 200 ? subtotal * 0.1 : 0;
//   const couponDiscount = COUPONS[coupon] ? (subtotal * COUPONS[coupon]) / 100 : 0;
//   const total = subtotal - thresholdDiscount - couponDiscount;

//   const handleAddItem = (item: GroceryItem) => {
//     dispatch(addItem(item));
//   };

//   const handleRemoveItem = (item: GroceryItem) => {
//     dispatch(removeItem(item));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-10">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center">
//           🛒 Modern E-Commerce Store
//         </h1>

//         <div className="lg:grid lg:grid-cols-12 lg:gap-8">
//           <div className="lg:col-span-8 space-y-8">
//             <div className="bg-white p-6 rounded-xl shadow-md flex flex-wrap gap-4 items-center justify-between">
//               <input
//                 className="flex-1 min-w-[150px] border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                 placeholder="Search products..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//               />
//               <select
//                 className="border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//               >
//                 <option value="All">All Categories</option>
//                 <option value="Fruit">Fruit</option>
//                 <option value="Dress">Dairy</option>
//                 <option value="Wearings">Chocolates</option>
//               </select>
//               <select
//                 className="border border-gray-300 px-4 py-2 rounded-lg bg-white focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                 value={sort}
//                 onChange={(e) => setSort(e.target.value as "asc" | "desc")}
//               >
//                 <option value="asc">Price: Low to High</option>
//                 <option value="desc">Price: High to Low</option>
//               </select>
//             </div>

//             <h2 className="text-2xl font-bold text-gray-800">Available Products</h2>
//             <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
//               {filteredItems.map((item) => (
//                 <GroceryCard key={item.id} {...item} onAdd={handleAddItem} />
//               ))}
//             </div>
//           </div>

//           <div className="lg:col-span-4 mt-8 lg:mt-0 sticky top-10">
//             <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
//               <h2 className="text-2xl font-extrabold text-gray-800 mb-4 border-b pb-2">
//                 Order Summary ({cart.length} items)
//               </h2>

//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span>₹{subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-red-500">
//                   <span>Threshold Discount (10%)</span>
//                   <span>-₹{thresholdDiscount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-red-500">
//                   <span>Coupon Discount ({COUPONS[coupon] || 0}%)</span>
//                   <span>-₹{couponDiscount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2 text-indigo-600">
//                   <span>Total</span>
//                   <span>₹{total.toFixed(2)}</span>
//                 </div>
//               </div>

//               <div className="mt-6 space-y-3">
//                 <div className="flex gap-2">
//                   <input
//                     className="flex-grow border border-gray-300 px-4 py-2 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
//                     placeholder="Enter Coupon Code"
//                     value={coupon}
//                     onChange={(e) => setCoupon(e.target.value.toUpperCase())}
//                   />
//                   <button
//                     className="bg-gray-200 text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-150 active:scale-95"
//                     onClick={() => setCoupon("")}
//                     disabled={!coupon}
//                   >
//                     Clear
//                   </button>
//                 </div>

//                 {cart.map((item) => (
//                   <button
//                     key={item.id}
//                     className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
//                     onClick={() => handleRemoveItem(item)}
//                   >
//                     Remove {item.name}
//                   </button>
//                 ))}

//                 <button
//                   className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg disabled:opacity-50 active:scale-[0.99]"
//                   onClick={() => dispatch(undoLast())}
//                   disabled={isCartEmpty}
//                 >
//                   ↩️ Undo Last Action
//                 </button>
//                 <button
//                   className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg disabled:opacity-50 active:scale-[0.99]"
//                   disabled={isCartEmpty}
//                 >
//                   Proceed to Checkout
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
