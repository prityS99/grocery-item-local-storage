"use client";

import Link from "next/link";
import { Home, Box, User } from "lucide-react";

interface SidebarProps {
  isOpen?: boolean; // optional
}

const Sidebar = ({ isOpen = true }: SidebarProps) => {
  return (
    <aside
      className={`bg-green-50 shadow-md h-screen p-6 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <ul className="flex flex-col gap-6">
        <li>
          <Link
            href="/"
            className="flex items-center gap-3 p-2 hover:bg-green-100 rounded-md"
          >
            <Home />
            {isOpen && <span>Products</span>}
          </Link>
        </li>
        <li>
          <Link
            href="/grocerycart"
            className="flex items-center gap-3 p-2 hover:bg-green-100 rounded-md"
          >
            <Box />
            {isOpen && <span>Products</span>}
          </Link>
        </li>
        <li>
         
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
