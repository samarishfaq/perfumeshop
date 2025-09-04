"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Search, Save, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type OtherType = {
  _id?: string;
  name: string;
  buyingPrice: number | string;
  sellingPrice: number | string;
  profit?: number | string;
};

export default function OthersPage() {
  const [items, setItems] = useState<OtherType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<OtherType>({
    name: "",
    buyingPrice: "",
    sellingPrice: "",
    profit: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<OtherType | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch("/api/others");
      const json = await res.json();
      if (json.success) setItems(json.data);
    } catch {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  async function handleAdd() {
    let newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "This field is required";
    if (!form.buyingPrice) newErrors.buyingPrice = "This field is required";
    if (!form.sellingPrice) newErrors.sellingPrice = "This field is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/others", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          buyingPrice: Number(form.buyingPrice),
          sellingPrice: Number(form.sellingPrice),
          profit: form.profit ? Number(form.profit) : undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setForm({ name: "", buyingPrice: "", sellingPrice: "", profit: "" });
        setItems((prev) => [json.data, ...prev]);
        toast.success("Item added!");
      } else {
        toast.error(json.error || "Add failed");
      }
    } catch {
      toast.error("Error creating item");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/others/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.filter((p) => p._id !== id));
        toast.success("Item deleted");
      } else {
        toast.error(json.error || "Delete failed");
      }
    } catch {
      toast.error("Delete error");
    }
  }

  function startEdit(p: OtherType) {
    setEditingId(p._id || null);
    setEditValues({
      name: p.name,
      buyingPrice: p.buyingPrice,
      sellingPrice: p.sellingPrice,
      profit: p.profit ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues(null);
  }

  async function saveEdit(id: string) {
    if (!editValues) return;
    try {
      const res = await fetch(`/api/others/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editValues.name,
          buyingPrice: Number(editValues.buyingPrice),
          sellingPrice: Number(editValues.sellingPrice),
          profit:
            editValues.profit !== "" ? Number(editValues.profit) : undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.map((p) => (p._id === id ? json.data : p)));
        cancelEdit();
        toast.success("Item updated!");
      } else {
        toast.error(json.error || "Update failed");
      }
    } catch {
      toast.error("Update error");
    }
  }

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" />
      <motion.h1
        className="text-3xl max-md:text-2xl self-center font-bold mb-6 text-yellow-600 dark:text-teal-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🛒 Manage Others
      </motion.h1>

      {/* Form */}
      <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 shadow mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          {["name", "buyingPrice", "sellingPrice", "profit"].map((field) => (
            <div key={field} className="flex flex-col">
              <input
                name={field}
                type={
                  field.includes("Price") || field === "profit"
                    ? "number"
                    : "text"
                }
                placeholder={
                  field === "name"
                    ? "Product Name"
                    : field === "buyingPrice"
                    ? "Buying Price"
                    : field === "sellingPrice"
                    ? "Selling Price"
                    : "Profit (optional)"
                }
                value={(form as any)[field]}
                onChange={handleChange}
                className={`p-3 rounded border ${
                  errors[field]
                    ? "border-red-500"
                    : "border-gray-300 dark:border-gray-700"
                } bg-white dark:bg-gray-800`}
              />
              {errors[field] && (
                <span className="text-red-500 text-sm mt-1">
                  {errors[field]}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-yellow-600 cursor-pointer hover:bg-yellow-700 dark:bg-teal-500 dark:hover:bg-teal-600"
            }`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
          <button
            onClick={fetchItems}
            className="px-4 py-2 border cursor-pointer rounded border-gray-300 dark:border-gray-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="w-full mb-4 flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name..."
            className="w-full p-3 rounded-xl border dark:border-gray-700 bg-gray-100 dark:bg-gray-900 pr-12"
          />
          <Search className="absolute right-3 top-3 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg shadow border border-gray-300 dark:border-gray-700 divide-y divide-gray-300 dark:divide-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800 text-left">
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Name
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Buying
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Selling
              </th>
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-yellow-600 dark:text-teal-400">
                Profit
              </th>
              <th className="p-3 min-w-[200px] text-center text-yellow-600 dark:text-teal-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No items yet
                </td>
              </tr>
            )}

            {filtered.map((p) => {
              const id = p._id as string;
              const isEditing = editingId === id;

              return (
                <tr
                  key={id}
                  className="divide-x divide-gray-300 dark:divide-gray-700"
                >
                  {["name", "buyingPrice", "sellingPrice", "profit"].map(
                    (field) => (
                      <td key={field} className="p-3">
                        {isEditing ? (
                          <input
                            type={
                              field.includes("Price") || field === "profit"
                                ? "number"
                                : "text"
                            }
                            value={(editValues as any)?.[field] ?? ""}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues!,
                                [field]: e.target.value,
                              })
                            }
                            className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
                          />
                        ) : field === "buyingPrice" ||
                          field === "sellingPrice" ? (
                          `Rs ${p[field]}`
                        ) : field === "profit" ? (
                          p.profit ? (
                            `Rs ${p.profit}`
                          ) : (
                            "—"
                          )
                        ) : (
                          (p as any)[field]
                        )}
                      </td>
                    )
                  )}
                  <td className="p-3 text-center flex items-center justify-center gap-1">
                    {isEditing ? (
                      <>
                        <motion.button
                          whileHover={{ y: -2 }}
                          onClick={() => saveEdit(id)}
                          className="p-2 rounded cursor-pointer bg-green-500 text-white"
                        >
                          <Save size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ y: -2 }}
                          onClick={cancelEdit}
                          className="p-2 rounded cursor-pointer bg-gray-300 dark:bg-gray-700"
                        >
                          <X size={16} />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ y: -2 }}
                          onClick={() => startEdit(p)}
                          className="p-2 rounded cursor-pointer bg-purple-100 dark:bg-teal-600 text-yellow-600 dark:text-white"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <ConfirmDialog
                          trigger={
                            <motion.button
                              whileHover={{ y: -2 }}
                              className="p-2 rounded bg-red-100 cursor-pointer text-red-600"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          }
                          title="Delete Product?"
                          description={`This will permanently delete "${p.name}". Are you sure?`}
                          confirmText="Delete"
                          cancelText="Cancel"
                          onConfirm={() => handleDelete(id)}
                        />
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
