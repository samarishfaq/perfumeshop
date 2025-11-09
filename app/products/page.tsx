"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Edit,
  Trash2,
  Search,
  Save,
  X,
  PlusCircle,
  MinusCircle,
  Printer,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmDialog from "@/components/ui/confirm-dialog";

// ✅ PDF libraries
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // 👈 Proper import

type VariantType = { size: string; price: number | string };
type ProductType = {
  _id?: string;
  name: string;
  description?: string;
  variants: VariantType[];
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<ProductType>({
    name: "",
    description: "",
    variants: [{ size: "", price: "" }],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<ProductType | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  const handleVariantChange = (
    index: number,
    field: keyof VariantType,
    value: string
  ) => {
    const updated = [...form.variants];
    updated[index][field] = value;
    setForm({ ...form, variants: updated });
  };

  const addVariant = () =>
    setForm({ ...form, variants: [...form.variants, { size: "", price: "" }] });
  const removeVariant = (index: number) =>
    setForm({ ...form, variants: form.variants.filter((_, i) => i !== index) });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  async function handleAddProduct() {
    let newErrors: Record<string, string> = {};
    if (!form.name) newErrors.name = "Product name is required";
    if (
      !form.variants.length ||
      !form.variants[0].size ||
      !form.variants[0].price
    )
      newErrors.variants = "At least one valid variant is required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.success) {
        setForm({
          name: "",
          description: "",
          variants: [{ size: "", price: "" }],
        });
        setProducts((prev) => [json.data, ...prev]);
        toast.success("Product added successfully!");
      } else {
        toast.error(json.error || "Failed to add product");
      }
    } catch {
      toast.error("Error creating product");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) setProducts((prev) => prev.filter((p) => p._id !== id));
      else toast.error(json.error || "Delete failed");
    } catch {
      toast.error("Delete error");
    }
  }

  function startEdit(p: ProductType) {
    setEditingId(p._id || null);
    setEditValues({ ...p, variants: [...p.variants] });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValues(null);
  }

  async function saveEdit(id: string) {
    if (!editValues) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editValues),
      });
      const json = await res.json();
      if (json.success) {
        setProducts((prev) => prev.map((p) => (p._id === id ? json.data : p)));
        cancelEdit();
        toast.success("Product updated!");
      } else toast.error(json.error || "Update failed");
    } catch {
      toast.error("Update error");
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const generatePDF = () => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });

      // Header
      doc.setFontSize(16);
      doc.text("Elevated Creations — Price List", 40, 40);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 55);

      let y = 80; // Starting vertical position

      filtered.forEach((product, index) => {
        // Product header (number + name)
        doc.setFontSize(12);
        doc.setTextColor(22, 160, 133);
        doc.text(`${index + 1}. ${product.name}`, 40, y);

        y += 8; // Small spacing

        // Variants table box for each product
        const variantData =
          product.variants.length > 0
            ? product.variants.map((v) => [v.size, `Rs ${v.price}`])
            : [["-", "-"]];

        autoTable(doc, {
          head: [["Size", "Price"]],
          body: variantData,
          startY: y + 5,
          styles: { fontSize: 9, cellPadding: 5 },
          theme: "grid",
          headStyles: {
            fillColor: [22, 160, 133],
            textColor: 255,
            fontStyle: "bold",
          },
          margin: { left: 60, right: 60 },
        });

        // Get where the last table ended
        const tableY = (doc as any).lastAutoTable.finalY;

        // Draw dark border line after each product section
        doc.setDrawColor(30, 30, 30);
        doc.setLineWidth(0.7);
        doc.line(40, tableY + 10, 550, tableY + 10);

        // Move down for next product
        y = tableY + 25;

        // Add new page if near the bottom
        if (y > 740) {
          doc.addPage();
          y = 60;
        }
      });

      doc.save("Elevated-Creations-Price-List.pdf");
      toast.success("PDF generated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 bg-gradient-to-b from-teal-50 via-white to-teal-100 dark:from-teal-900 dark:via-gray-950 dark:to-teal-900 text-gray-900 dark:text-gray-100">
      <Toaster position="top-right" />
      <motion.h1
        className="text-3xl font-bold mb-8 text-teal-600 dark:text-teal-400"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧴 Manage Attars
      </motion.h1>

      {/* Form */}
      <motion.div
        className="w-full bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-lg mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Oud Al Khaleeji"
              className={`p-3 rounded-lg border ${
                errors.name
                  ? "border-red-500"
                  : "border-gray-300 dark:border-gray-700"
              } bg-gray-50 dark:bg-gray-900 transition`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm mt-1">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-gray-700 dark:text-gray-300">
              Description (optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Small description about the attar"
              className="p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 transition"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="mt-4">
          <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Variants
          </label>
          {form.variants.map((variant, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 w-full"
            >
              <input
                type="text"
                value={variant.size}
                onChange={(e) =>
                  handleVariantChange(index, "size", e.target.value)
                }
                placeholder="Size (e.g., 3ml)"
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 w-full sm:w-32 transition"
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) =>
                  handleVariantChange(index, "price", e.target.value)
                }
                placeholder="Price"
                className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 w-full sm:w-32 transition"
              />
              {form.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-red-500 hover:text-red-600 mt-1 sm:mt-0"
                >
                  <MinusCircle size={20} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="flex cursor-pointer items-center gap-2 mt-2 text-teal-500 hover:text-teal-600 transition"
          >
            <PlusCircle size={18} /> Add Variant
          </button>
          {errors.variants && (
            <span className="text-red-500 text-sm">{errors.variants}</span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={handleAddProduct}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-teal-500 cursor-pointer hover:bg-teal-600"
            } transition`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
          <button
            onClick={fetchProducts}
            className="px-4 py-2 cursor-pointer border rounded-lg border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Add PDF Download Button */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={generatePDF}
          className="flex cursor-pointer items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition"
        >
          <Printer size={18} /> Download Price List (PDF)
        </button>
      </div>

      {/* Search */}
      <div className="w-full mb-6">
        <div className="relative">
          <input
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name..."
            className="w-full p-3 rounded-xl border dark:border-gray-700 bg-gray-50 dark:bg-gray-900 pr-12 transition"
          />
          <Search className="absolute right-3 top-3 text-gray-400 dark:text-gray-500" />
        </div>
      </div>

      {/* Product Cards with table-like layout and responsive scroll */}
      <div className="w-full space-y-4">
        {/* Table Header */}
        <div className="grid grid-cols-[200px_1fr_120px] bg-yellow-100 dark:bg-yellow-900 text-black dark:text-white rounded-lg font-semibold text-center border border-gray-300 dark:border-gray-700 overflow-auto">
          <div className="p-2 border-r border-gray-300 dark:border-gray-700">
            Product Name
          </div>
          <div className="p-2 border-r border-gray-300 dark:border-gray-700 min-w-[200px]">
            Variants & Prices
          </div>
          <div className="p-2">Actions</div>
        </div>

        {filtered.length === 0 && (
          <motion.div
            className="p-6 text-center bg-white dark:bg-gray-800 rounded-2xl shadow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            No products found
          </motion.div>
        )}

        {filtered.map((p) => {
          const id = p._id!;
          const isEditing = editingId === id;

          return (
            <motion.div
              key={id}
              className="grid grid-cols-[200px_1fr_120px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 overflow-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Product Name */}
              <div className="flex items-center justify-center border-r border-gray-300 dark:border-gray-600 p-4 font-semibold text-teal-600 dark:text-teal-400 text-center">
                {isEditing ? (
                  <input
                    value={editValues?.name ?? p.name ?? ""}
                    onChange={(e) =>
                      setEditValues((prev) => ({
                        ...prev!,
                        name: e.target.value,
                        variants: prev?.variants ?? [],
                      }))
                    }
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                  />
                ) : (
                  p.name
                )}
              </div>

              {/* Variants & Prices with horizontal scroll */}
              <div className="flex flex-col border-r border-gray-300 dark:border-gray-600 p-4 space-y-2 w-full">
                {(isEditing
                  ? editValues?.variants ?? []
                  : p.variants ?? []
                ).map((v, i) => (
                  <motion.div
                    key={i}
                    className="flex min-w-[200px] border border-gray-300 dark:border-gray-700 rounded p-2 bg-gray-50 dark:bg-gray-900  justify-between items-center"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={v.size ?? ""}
                          placeholder="Size"
                          onChange={(e) => {
                            const updated = [...(editValues?.variants ?? [])];
                            updated[i] = {
                              ...updated[i],
                              size: e.target.value,
                            };
                            setEditValues({
                              _id: editValues?._id,
                              name: editValues?.name ?? "",
                              description: editValues?.description ?? "",
                              variants: updated,
                            });
                          }}
                          className="w-1/2 p-1 m-2 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                        />
                        <input
                          type="number"
                          value={v.price ?? ""}
                          placeholder="Price"
                          onChange={(e) => {
                            const updated = [...(editValues?.variants ?? [])];
                            updated[i] = {
                              ...updated[i],
                              price: Number(e.target.value),
                            };
                            setEditValues({
                              _id: editValues?._id,
                              name: editValues?.name ?? "",
                              description: editValues?.description ?? "",
                              variants: updated,
                            });
                          }}
                          className="w-1/2 p-1 rounded border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                        />
                      </>
                    ) : (
                      <>
                        <div className="text-gray-700 dark:text-gray-300 font-semibold">
                          {v.size}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Rs {v.price}
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col justify-center items-center p-4 gap-2 overflow-auto">
                {isEditing ? (
                  <>
                    <motion.button
                      whileHover={{ y: -2 }}
                      onClick={() => saveEdit(id)}
                      className="p-2 cursor-pointer rounded bg-green-500 text-white"
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
                      className="p-2 rounded cursor-pointer bg-teal-100 dark:bg-teal-600 text-teal-600 dark:text-white"
                    >
                      <Edit size={16} />
                    </motion.button>
                    <ConfirmDialog
                      trigger={
                        <motion.button
                          whileHover={{ y: -2 }}
                          className="p-2 rounded cursor-pointer bg-red-100 text-red-600"
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
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
