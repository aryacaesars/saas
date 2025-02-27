"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import RestockModal from "./RestockModal"

export default function Warehouse() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [restockProduct, setRestockProduct] = useState(null)
  const [expenditure, setExpenditure] = useState(0)

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || []
    setProducts(storedProducts)

    const storedCategories = JSON.parse(localStorage.getItem("categories")) || []
    setCategories(storedCategories)

    const storedExpenditure = JSON.parse(localStorage.getItem("expenditure")) || 0
    setExpenditure(storedExpenditure)
  }, [])

  const handleRestock = (product, quantity, purchasePrice, sellingPrice, supplier) => {
    const updatedProducts = products.map((p) =>
      p.id === product.id ? { ...p, stock: p.stock + quantity, purchasePrice, sellingPrice, supplier } : p
    )
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    const restockRecord = {
      id: Date.now(),
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity,
      purchasePrice,
      sellingPrice,
      supplier,
      date: new Date().toISOString(),
    }

    const storedRestockHistory = JSON.parse(localStorage.getItem("restockHistory")) || []
    const updatedRestockHistory = [...storedRestockHistory, restockRecord]
    localStorage.setItem("restockHistory", JSON.stringify(updatedRestockHistory))

    const newExpenditure = expenditure + (purchasePrice * quantity)
    setExpenditure(newExpenditure)
    localStorage.setItem("expenditure", JSON.stringify(newExpenditure))
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Daftar Produk</h2>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none md:w-64">
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input flex-1 md:flex-none md:w-48"
          >
            <option value="">Semua Kategori</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Nama Produk</th>
              <th className="text-left py-2">Kategori</th>
              <th className="text-left py-2">Stok</th>
              <th className="text-left py-2">Harga Jual</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="border-b">
                <td className="py-2">{product.name}</td>
                <td className="py-2">{product.category}</td>
                <td className="py-2">{product.stock}</td>
                <td className="py-2">Rp {product.price.toLocaleString("id-ID")}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 10 ? "Stok Cukup" : product.stock > 0 ? "Stok Menipis" : "Stok Habis"}
                  </span>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => setRestockProduct(product)}
                    className="btn btn-primary"
                  >
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {restockProduct && (
        <RestockModal
          product={restockProduct}
          onRestock={handleRestock}
          onClose={() => setRestockProduct(null)}
        />
      )}
    </div>
  );
}

