"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Edit, Trash2, Search, Save, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDialog from "@/components/ui/confirm-dialog";

type OtherType = {
  _id?: string;
  name: string;
  description?: string;
  price: number | string;
};

export default function OthersPage() {
  const [items, setItems] = useState<OtherType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<OtherType>({
    name: "",
    description: "",
    price: "",
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  async function handleAdd() {
    const newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "This field is required";
    if (!form.price) newErrors.price = "This field is required";

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
          description: form.description,
          price: Number(form.price),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setForm({ name: "", description: "", price: "" });
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
      description: p.description,
      price: p.price,
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
          description: editValues.description,
          price: Number(editValues.price),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setItems((prev) => prev.map((p) => (p._id === id ? json.data : p)));
        cancelEdit();
        toast.success("Item updated!");
      } else toast.error(json.error || "Update failed");
    } catch {
      toast.error("Update error");
    }
  }

  const filtered = items.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-b from-teal-50 via-white to-teal-100 dark:from-teal-900 dark:via-gray-950 dark:to-teal-900 text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" />
      <motion.h1
        className="text-3xl max-md:text-2xl font-bold mb-6 text-teal-600 dark:text-teal-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🛒 Manage Others
      </motion.h1>

      {/* Form */}
      <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow mb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <input
              name="name"
              placeholder="Item Name"
              value={form.name}
              onChange={handleChange}
              className={`p-3 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
          </div>
          <div className="flex flex-col">
            <input
              name="price"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className={`p-3 rounded-lg border ${
                errors.price ? "border-red-500" : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition`}
            />
            {errors.price && <span className="text-red-500 text-sm mt-1">{errors.price}</span>}
          </div>
          <div className="flex flex-col sm:col-span-2">
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={form.description}
              onChange={handleChange}
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition w-full"
            />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleAdd}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-500 cursor-pointer hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
            } transition`}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
          <button
            onClick={fetchItems}
            className="px-4 py-2 cursor-pointer border rounded-lg border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
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
            className="w-full p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pr-12 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
          />
          <Search className="absolute right-3 top-3 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-300 dark:border-gray-700 divide-y divide-gray-300 dark:divide-gray-700">
          <thead>
            <tr className="bg-teal-100 dark:bg-teal-800 text-left">
              <th className="p-3 min-w-[200px] border-r border-gray-300 dark:border-gray-700 text-teal-600 dark:text-teal-400">
                Name
              </th>
              <th className="p-3 min-w-[250px] border-r border-gray-300 dark:border-gray-700 text-teal-600 dark:text-teal-400">
                Description
              </th>
              <th className="p-3 min-w-[150px] border-r border-gray-300 dark:border-gray-700 text-teal-600 dark:text-teal-400">
                Price
              </th>
              <th className="p-3 min-w-[150px] text-center text-teal-600 dark:text-teal-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  No items yet
                </td>
              </tr>
            )}

            {filtered.map((p) => {
              const id = p._id as string;
              const isEditing = editingId === id;

              return (
                <tr key={id} className="divide-x divide-gray-300 dark:divide-gray-700">
                  {/* Name */}
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editValues?.name ?? ""}
                        onChange={(e) =>
                          setEditValues({ ...editValues!, name: e.target.value })
                        }
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                    ) : (
                      p.name
                    )}
                  </td>

                  {/* Description */}
                  <td className="p-3">
                    {isEditing ? (
                      <textarea
                        value={editValues?.description ?? ""}
                        onChange={(e) =>
                          setEditValues({ ...editValues!, description: e.target.value })
                        }
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                    ) : (
                      p.description || "—"
                    )}
                  </td>

                  {/* Price */}
                  <td className="p-3">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues?.price ?? ""}
                        onChange={(e) =>
                          setEditValues({ ...editValues!, price: e.target.value })
                        }
                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
                      />
                    ) : (
                      `Rs ${p.price}`
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-center flex items-center justify-center gap-1">
                    {isEditing ? (
                      <>
                        <motion.button
                          whileHover={{ y: -2 }}
                          onClick={() => saveEdit(id)}
                          className="p-2 rounded cursor-pointer bg-green-500 text-white transition"
                        >
                          <Save size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ y: -2 }}
                          onClick={cancelEdit}
                          className="p-2 rounded cursor-pointer bg-gray-300 dark:bg-gray-700 transition"
                        >
                          <X size={16} />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          whileHover={{ y: -2 }}
                          onClick={() => startEdit(p)}
                          className="p-2 rounded bg-teal-100 cursor-pointer dark:bg-teal-600 text-teal-600 dark:text-white transition"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <ConfirmDialog
                          trigger={
                            <motion.button
                              whileHover={{ y: -2 }}
                              className="p-2 rounded cursor-pointer bg-red-100 text-red-600 transition"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          }
                          title="Delete Item?"
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
