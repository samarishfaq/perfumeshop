"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, Search, Printer } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type OrderType = {
  _id?: string;
  productName: string;
  productPrice: number | string;
  remainingPayment?: number | string;
  paymentMethod?: string;
  description?: string;
  createdAt?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<OrderType>({
    productName: "",
    productPrice: "",
    remainingPayment: "",
    paymentMethod: "",
    description: "",
  });
  const [receipt, setReceipt] = useState<OrderType | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (res.ok) setOrders(json);
      else toast.error("Failed to fetch orders");
    } catch {
      toast.error("Error fetching orders");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Add Order
  async function handleAddOrder() {
    if (!form.productName || !form.productPrice) {
      toast.error("Please fill required fields!");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: form.productName,
          productPrice: Number(form.productPrice),
          remainingPayment: form.remainingPayment
            ? Number(form.remainingPayment)
            : undefined,
          paymentMethod: form.paymentMethod,
          description: form.description,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setOrders((prev) => [json, ...prev]);
        setForm({
          productName: "",
          productPrice: "",
          remainingPayment: "",
          paymentMethod: "",
          description: "",
        });
        setReceipt(json);
        toast.success("Order saved successfully!");
      } else {
        toast.error(json.message || "Failed to save order");
      }
    } catch {
      toast.error("Error saving order");
    } finally {
      setLoading(false);
    }
  }

  // ✅ Delete Order
  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== id));
        toast.success("Order deleted");
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch {
      toast.error("Error deleting order");
    }
  }

  // ✅ Print Receipt (centered small page)
  const handlePrint = () => {
    if (receipt) {
      const printContent =
        document.getElementById("receipt-content")?.innerHTML;
      const printWindow = window.open("", "", "width=400,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { display: flex; align-items: center; justify-content: center; height: 100vh; }
                .receipt-box { border: 1px dashed #000; padding: 20px; width: 250px; text-align: center; }
                h2 { margin-bottom: 10px; }
                p { margin: 4px 0; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="receipt-box">
                ${printContent}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // ✅ Filter Orders
  const filteredOrders = orders.filter(
    (o) =>
      o.productName.toLowerCase().includes(search.toLowerCase()) ||
      (o.paymentMethod || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 font-sans text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-950">
      <Toaster position="top-right" />

      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-3xl max-md:text-2xl font-bold text-center mb-8 text-yellow-500 dark:text-teal-500"
      >
        🛒 Manage Orders
      </motion.h1>

      {/* Order Form */}
      <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">➕ Add New Order</h2>

        <div className="max-md:flex max-md:flex-col grid grid-cols-2 gap-4">
          {[
            { name: "productName", type: "text", placeholder: "Product Name" },
            {
              name: "productPrice",
              type: "number",
              placeholder: "Product Price",
            },
            {
              name: "remainingPayment",
              type: "number",
              placeholder: "Remaining Payment (Optional)",
            },
            {
              name: "paymentMethod",
              type: "text",
              placeholder: "Payment Method (Optional)",
            },
          ].map((field) => (
            <div key={field.name} className="flex flex-col">
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={(form as any)[field.name]}
                onChange={handleChange}
                className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
              />
            </div>
          ))}

          <div className="flex flex-col col-span-2">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Product Description"
              className="p-3 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            />
          </div>
        </div>

        <button
          onClick={handleAddOrder}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-yellow-500 text-black hover:opacity-90 cursor-pointer dark:bg-teal-500 dark:text-white"
          }`}
        >
          {loading ? "Saving..." : "Save Order"}
        </button>
      </div>

      {/* Search Bar */}
      <div className=" mt-10 relative">
        <input
          type="text"
          placeholder="🔍 Search by product or payment method..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 pr-12"
        />
        <Search className="absolute right-3 top-3 text-gray-500 dark:text-gray-400" />
      </div>

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg relative">
            <div id="receipt-content">
              <h2 className="text-center text-2xl font-bold mb-4">
                Perfume Shop
              </h2>
              <p>
                <strong>Product:</strong> {receipt.productName}
              </p>
              <p>
                <strong>Price:</strong> Rs {receipt.productPrice}
              </p>
              <p>
                <strong>Remaining:</strong> {receipt.remainingPayment || "—"}
              </p>
              <p>
                <strong>Payment Method:</strong> {receipt.paymentMethod || "—"}
              </p>
              <p>
                <strong>Description:</strong> {receipt.description || "—"}
              </p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(receipt.createdAt || "").toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {new Date(receipt.createdAt || "").toLocaleTimeString()}
              </p>
              <p>
                <strong>Day:</strong>{" "}
                {new Date(receipt.createdAt || "").toLocaleDateString("en-US", {
                  weekday: "long",
                })}
              </p>
            </div>
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrint}
                className="px-4 py-2 cursor-pointer hover:bg-teal-500/80 bg-teal-500 text-white rounded-lg flex items-center gap-2"
              >
                <Printer size={18} /> Print
              </button>
              <button
                onClick={() => setReceipt(null)}
                className="px-4 py-2 cursor-pointer hover:bg-red-500/80 bg-red-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="overflow-x-auto mt-8"
      >
        <table className="w-full border-collapse bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800 text-left">
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Name
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Price
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Remaining
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Method
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Date
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Time
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Day
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((o) => (
                <motion.tr
                  key={o._id}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  <td className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {o.productName}
                  </td>
                  <td className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    Rs {o.productPrice}
                  </td>
                  <td className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {o.remainingPayment || "—"}
                  </td>
                  <td className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {o.paymentMethod || "—"}
                  </td>
                  <td className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {new Date(o.createdAt || "").toLocaleDateString()}
                  </td>
                  <td className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {new Date(o.createdAt || "").toLocaleTimeString()}
                  </td>
                  <td className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    {new Date(o.createdAt || "").toLocaleDateString("en-US", {
                      weekday: "long",
                    })}
                  </td>
                  <td className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <ConfirmDialog
                      trigger={
                        <button className="text-red-500 cursor-pointer hover:scale-110 transition">
                          <Trash2 size={20} />
                        </button>
                      }
                      title="Delete Order?"
                      description={`This will permanently delete "${o.productName}". Are you sure?`}
                      confirmText="Delete"
                      cancelText="Cancel"
                      onConfirm={() => handleDelete(o._id!)}
                    />
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-6 text-gray-500 dark:text-gray-400"
                >
                  No orders found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
