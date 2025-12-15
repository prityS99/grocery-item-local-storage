"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/hook";
import { addItem, removeItem, setCartFromStorage, undoLast } from "../hooks/redux/slice/cartSlice";
import { loadCart, saveCart  } from "@/utils/localStorage";
import Image from "next/image";


interface GroceryCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string; // this is important
}

// ------------------ STATIC DATA ------------------
const GROCERY_ITEMS = [
  { id: 1, image: "/apple.jpg", name: "Apple", price: 89, category: "Fruit" },
  { id: 2, image: "/dress.webp", name: "Dress", price: 1740, category: "Dress" },
  { id: 3, image: "/dress-2.jpg", name: "Dress - Modern", price: 4857, category: "Wearings" },
  { id: 4, image: "/umbrella.jpg", name: "Umbrella", price: 3580, category: "Things" },
  { id: 5, image: "/watch.jpg", name: "Watch", price: 12000, category: "Things" },
];

const COUPONS: Record<string, number> = {
  SAVE10: 10,
  SAVE20: 20,
};

const GroceryCard = ({ id, image, name, price, category }: GroceryCardProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="border p-4 rounded flex flex-col items-center">
      <Image src={image} alt={name} width={100} height={100} />
      <h3 className="mt-2 font-semibold">{name}</h3>
      <p>₹{price}</p>
      <button
        className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
        onClick={() =>
          dispatch(addItem({ id, name, price, image, category }))
        }
      >
        Add
      </button>
    </div>
  );
};


// ------------------ Main Component ------------------
export default function GroceryCart() {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [coupon, setCoupon] = useState("");

useEffect(() => {
  const storedCart = loadCart();
  if (storedCart.length) {
    dispatch(setCartFromStorage(storedCart));
  }
}, [dispatch]);

useEffect(() => {
  saveCart(cart);
}, [cart]);

  // ------------------ FILTER & SORT ------------------
  const filteredItems = useMemo(() => {
    let items = [...GROCERY_ITEMS];

    if (search) {
      items = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (category !== "All") {
      items = items.filter((i) => i.category === category);
    }

    return items.sort((a, b) => (sort === "asc" ? a.price - b.price : b.price - a.price));
  }, [search, category, sort]);

  // ------------------ PRICE ------------------
  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  const thresholdDiscount = subtotal > 200 ? subtotal * 0.1 : 0;
  const couponDiscount = COUPONS[coupon] ? (subtotal * COUPONS[coupon]) / 100 : 0;
  const total = subtotal - thresholdDiscount - couponDiscount;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">🛒 Grocery Cart</h1>

      {/* Controls */}
      <div className="flex gap-3 flex-wrap">
        <input
          className="border px-3 py-2 rounded"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="border px-3 py-2 rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option>All</option>
          <option>Fruit</option>
          <option>Dress</option>
          <option>Wearings</option>
          <option>Things</option>
        </select>

        <select className="border px-3 py-2 rounded" value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")}>
          <option value="asc">Price ↑</option>
          <option value="desc">Price ↓</option>
        </select>
      </div>

      {/* Item List */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <GroceryCard key={item.id} {...item} />
        ))}
      </div>

      {/* Cart */}
      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold">Cart</h2>

        {cart.map((item, i) => (
          <div key={i} className="flex justify-between items-center">
            <span>{item.name}</span>
            <button className="text-red-500" onClick={() => dispatch(removeItem(item))}>
              Remove
            </button>
          </div>
        ))}

        <div className="mt-4 space-y-1">
          <p>Subtotal: ₹{subtotal}</p>
          <p>Threshold Discount: -₹{thresholdDiscount.toFixed(2)}</p>
          <p>Coupon Discount: -₹{couponDiscount.toFixed(2)}</p>
          <p className="font-bold">Total: ₹{total.toFixed(2)}</p>
        </div>

        <div className="flex gap-2 mt-3">
          <input
            className="border px-3 py-2 rounded"
            placeholder="Coupon"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value.toUpperCase())}
          />
          <button className="border px-3 py-2 rounded" onClick={() => dispatch(undoLast())}>
            Undo Last
          </button>
        </div>
      </div>
    </div>
  );
}
