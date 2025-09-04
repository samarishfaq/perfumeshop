"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
  const [perfumeProducts, setPerfumeProducts] = useState(0);
  const [otherProducts, setOtherProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  // Fetch real data from backend
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

  return (
    <div className="font-sans text-gray-900 dark:text-gray-100">
      {/* Hero / Welcome */}
      <section className="relative min-h-[60vh] p-5 flex flex-col justify-center items-center text-center bg-gradient-to-r from-yellow-500 to-yellow-700 dark:from-teal-500 dark:to-teal-700 text-white px-6">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl max-md:text-2xl font-extrabold drop-shadow-lg"
        >
          Welcome Back, Shop Owner
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-4 max-md:text-sm text-lg opacity-90"
        >
          Manage your products, check orders, and track your sales in one place.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/products"
            className="px-6 py-3 bg-white max-md:text-sm text-yellow-700 font-semibold rounded-lg shadow hover:bg-gray-100 transition dark:bg-gray-900 dark:text-teal-400 dark:hover:bg-gray-800"
          >
            View Products
          </Link>
          <Link
            href="/orders"
            className="px-6 py-3 border max-md:text-sm border-white text-white font-semibold rounded-lg hover:bg-yellow-600/30 transition dark:hover:bg-teal-600/30"
          >
            Check Orders
          </Link>
        </motion.div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 px-6 sm:px-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-3xl max-md:text-2xl font-bold text-yellow-600 dark:text-teal-400">
            Shop Overview
          </h2>
          <p className="mt-2 max-md:text-sm text-gray-600 dark:text-gray-300">
            Quick stats about your store.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
          >
            <Package className="h-10 w-10 mx-auto text-yellow-600 dark:text-teal-400" />
            <p className="text-3xl font-bold mt-3 text-yellow-600 dark:text-teal-400">
              {perfumeProducts}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Perfume Products
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
          >
            <Package className="h-10 w-10 mx-auto text-yellow-600 dark:text-teal-400" />
            <p className="text-3xl font-bold mt-3 text-yellow-600 dark:text-teal-400">
              {otherProducts}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Other Products
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg text-center"
          >
            <ShoppingCart className="h-10 w-10 mx-auto text-yellow-600 dark:text-teal-400" />
            <p className="text-3xl font-bold mt-3 text-yellow-600 dark:text-teal-400">
              {totalOrders}
            </p>
            <p className="mt-2 text-gray-700 dark:text-gray-300">
              Total Orders
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-6 sm:px-12 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold text-yellow-600 dark:text-teal-400">
            Quick Actions
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Access important sections instantly.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
          >
            <Package className="h-10 w-10 mx-auto text-yellow-600 dark:text-teal-400" />
            <h3 className="text-lg font-semibold mt-3 text-yellow-600 dark:text-teal-400">
              Manage Products
            </h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Add, edit or remove your products.
            </p>
            <Link
              href="/products"
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition"
            >
              Go →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center"
          >
            <ShoppingCart className="h-10 w-10 mx-auto text-yellow-600 dark:text-teal-400" />
            <h3 className="text-lg font-semibold mt-3 text-yellow-600 dark:text-teal-400">
              View Orders
            </h3>
            <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">
              Check your customer orders easily.
            </p>
            <Link
              href="/orders"
              className="inline-block mt-4 px-4 py-2 rounded-lg bg-yellow-600 text-white font-medium hover:bg-yellow-700 dark:bg-teal-500 dark:hover:bg-teal-600 transition"
            >
              Go →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 bg-gray-100 dark:bg-gray-900 text-center text-gray-600 dark:text-gray-400">
        <p>
          © {new Date().getFullYear()} Shop Owner Dashboard. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  );
}
