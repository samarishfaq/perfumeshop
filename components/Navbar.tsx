"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import Image from "next/image";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const links = ["Home", "Products", "Orders", "Others"];

  return (
    <nav className="w-full sticky top-0 z-50 shadow-md transition-all duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-50 via-white to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 animate-gradient bg-size-200 rounded-b-lg" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/elevated-logo.png"
              alt="PerfumeShop Logo"
              width={112}
              height={112}
              className="mr-2 dark:invert"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-8 text-base font-medium">
            {links.map((item, i) => (
              <Link
                key={i}
                href={`/${item === "Home" ? "" : item.toLowerCase()}`}
                className="relative group transition-all duration-300"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-teal-600 dark:bg-teal-400 transition-all duration-300 ease-in-out group-hover:w-full group-hover:shadow-[0_0_8px] group-hover:shadow-teal-400"></span>
              </Link>
            ))}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Theme toggle */}
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="relative overflow-hidden border-teal-600 dark:border-teal-400 hover:bg-teal-200 dark:hover:bg-teal-900/40 transition-all duration-500 rounded-full"
            >
              <Sun className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all text-teal-600 dark:text-gray-400 dark:scale-0 dark:-rotate-90" />
              <Moon className="absolute h-[1.3rem] w-[1.3rem] rotate-90 scale-0 transition-all text-gray-600 dark:text-teal-400 dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Hamburger for mobile */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-teal-200 dark:hover:bg-teal-900/40 transition"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X size={26} className="text-teal-600 dark:text-teal-400 transition-all" />
              ) : (
                <Menu size={26} className="text-teal-600 dark:text-teal-400 transition-all" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`md:hidden absolute w-full left-0 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-xl rounded-b-2xl px-6 py-4 space-y-4">
          {links.map((item, i) => (
            <Link
              key={i}
              href={`/${item === "Home" ? "" : item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="block w-full font-medium transition-all hover:text-teal-600 dark:hover:text-teal-400"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
