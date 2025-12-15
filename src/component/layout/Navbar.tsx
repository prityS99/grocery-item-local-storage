"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      {/* Logo */}
      <Link href="/">
        <h1 className="text-2xl font-bold">GroceryCart</h1>
      </Link>

      {/* Search Bar */}
      {/* <div className="flex items-center text-white flex-1 mx-6 max-w-lg">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full px-4 py-2 rounded-l-md focus:outline-none text-gray-700"
        />
        <button className="bg-green-700 px-4 py-2 rounded-r-md hover:bg-green-800">
          Search
        </button>
      </div> */}

      {/* Cart */}
      <Link href="/cart" className="relative">
        <ShoppingCart size={28} />
        <span className="absolute -top-2 -right-2 bg-red-500 rounded-full text-xs px-2">
          3
        </span>
      </Link>
    </nav>
  );
};

export default Navbar;
