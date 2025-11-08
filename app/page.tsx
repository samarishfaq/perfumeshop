"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, ShoppingCart, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [perfumeProducts, setPerfumeProducts] = useState(0);
  const [otherProducts, setOtherProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resProducts, resOthers, resOrders] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/others"),
          fetch("/api/orders"),
        ]);
        const [products, others, orders] = await Promise.all([
          resProducts.json(),
          resOthers.json(),
          resOrders.json(),
        ]);

        setPerfumeProducts((products.data || products).length || 0);
        setOtherProducts((others.data || others).length || 0);
        setTotalOrders((orders.data || orders).length || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { title: "Perfume Products", value: perfumeProducts, icon: <Package /> },
    { title: "Other Products", value: otherProducts, icon: <Package /> },
    { title: "Total Orders", value: totalOrders, icon: <ShoppingCart /> },
  ];

  const actions = [
    {
      title: "Manage Products",
      description: "Add, edit or remove your products easily.",
      icon: <Package className="h-8 w-8 mx-auto text-teal-500 dark:text-teal-400" />,
      link: "/products",
    },
    {
      title: "View Orders",
      description: "Check your customer orders anytime.",
      icon: <ShoppingCart className="h-8 w-8 mx-auto text-teal-500 dark:text-teal-400" />,
      link: "/orders",
    },
  ];

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-950 min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center p-10 bg-gradient-to-br from-teal-400 via-teal-500 to-teal-600 dark:from-teal-600 dark:via-teal-700 dark:to-teal-800 text-white shadow-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center max-w-xl"
        >
          <Sparkles className="w-10 h-10 mb-3 text-white" />
          <h1 className="text-4xl max-md:text-2xl font-extrabold tracking-tight drop-shadow-md">
            Welcome Back, Shop Owner ✨
          </h1>
          <p className="mt-3 text-base sm:text-lg opacity-90">
            Manage your perfumes, track orders, and keep your business glowing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/products"
              className="px-5 py-2 sm:px-6 sm:py-3 bg-white text-teal-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition dark:bg-gray-900 dark:text-teal-400 dark:hover:bg-gray-800 text-sm sm:text-base"
            >
              Manage Products
            </Link>
            <Link
              href="/orders"
              className="px-5 py-2 sm:px-6 sm:py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/20 transition text-sm sm:text-base"
            >
              View Orders
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-6 px-4 sm:py-12">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">
            Store Overview
          </h2>
          <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            A quick look at your current business stats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mt-2 mx-auto">
          {stats.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-2xl shadow-md text-center border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-center mb-2 text-teal-500 dark:text-teal-400">
                {item.icon}
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-teal-600 dark:text-teal-400">
                {item.value}
              </p>
              <p className="mt-1 sm:mt-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                {item.title}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Actions Section */}
      <section className="py-6 px-4 sm:py-12 bg-gradient-to-t from-teal-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-5xl mx-auto text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-teal-600 dark:text-teal-400">
            Quick Actions
          </h2>
          <p className="mt-1 sm:mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Access important tools instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {actions.map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="p-5 sm:p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md text-center border border-teal-200 dark:border-teal-700"
            >
              {action.icon}
              <h3 className="text-lg sm:text-xl font-semibold mt-3 text-teal-600 dark:text-teal-400">
                {action.title}
              </h3>
              <p className="text-sm sm:text-base mt-1 sm:mt-2 text-gray-600 dark:text-gray-300">
                {action.description}
              </p>
              <Link
                href={action.link}
                className="inline-block mt-3 sm:mt-4 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition text-sm sm:text-base"
              >
                Go →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 sm:py-6 text-center text-gray-600 dark:text-gray-400 border-t border-teal-200 dark:border-teal-700 text-sm sm:text-base">
        <p>
          © {new Date().getFullYear()} Perfume Dashboard — Designed with Elegance 💎
        </p>
      </footer>
    </div>
  );
}
