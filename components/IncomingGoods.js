"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash } from "lucide-react"

export default function IncomingGoods() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
  })
  const [newCategory, setNewCategory] = useState("")
  const [incomingGoods, setIncomingGoods] = useState([])
  const [restockHistory, setRestockHistory] = useState([])
  const [supplier, setSupplier] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({
    productName: "",
    category: "",
    quantity: "",
    purchasePrice: "",
    sellingPrice: "",
    supplier: "",
  })
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || []
    setProducts(storedProducts)

    const storedCategories = JSON.parse(localStorage.getItem("categories")) || []
    setCategories(storedCategories)

    const storedIncomingGoods = JSON.parse(localStorage.getItem("incomingGoods")) || []
    setIncomingGoods(storedIncomingGoods)

    const storedRestockHistory = JSON.parse(localStorage.getItem("restockHistory")) || []
    setRestockHistory(storedRestockHistory)
  }, [])

  const handleNewProductSubmit = (e) => {
    e.preventDefault()
    const productId = Date.now()

    // Create new product
    const product = {
      id: productId,
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.sellingPrice),
      stock: Number(newProduct.stock),
    }

    // Create incoming goods record
    const incomingGood = {
      id: Date.now(),
      productId,
      productName: newProduct.name,
      category: newProduct.category,
      quantity: Number(newProduct.stock),
      purchasePrice: Number(newProduct.purchasePrice),
      sellingPrice: Number(newProduct.sellingPrice),
      supplier,
      date: new Date().toISOString(),
    }

    // Update products
    const updatedProducts = [...products, product]
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Update incoming goods
    const updatedIncomingGoods = [...incomingGoods, incomingGood]
    setIncomingGoods(updatedIncomingGoods)
    localStorage.setItem("incomingGoods", JSON.stringify(updatedIncomingGoods))

    // Reset form
    setNewProduct({
      name: "",
      category: "",
      purchasePrice: "",
      sellingPrice: "",
      stock: "",
    })
    setSupplier("")
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories, newCategory]
      setCategories(updatedCategories)
      localStorage.setItem("categories", JSON.stringify(updatedCategories))
      setNewCategory("")
    }
  }

  const handleProductSearch = (e) => {
    e.preventDefault()
    const product = products.find((p) => p.name.toLowerCase() === searchTerm.toLowerCase())
    setSelectedProduct(product)
  }

  const handleUpdateProduct = (e) => {
    e.preventDefault()
    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id ? { ...selectedProduct } : product
    )
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Create new restock record for the update
    const restockRecord = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      category: selectedProduct.category,
      quantity: Number(selectedProduct.stock),
      purchasePrice: Number(selectedProduct.purchasePrice),
      sellingPrice: Number(selectedProduct.price),
      supplier: selectedProduct.supplier,
      date: new Date().toISOString(),
    }

    const updatedRestockHistory = [...restockHistory, restockRecord]
    setRestockHistory(updatedRestockHistory)
    localStorage.setItem("restockHistory", JSON.stringify(updatedRestockHistory))

    setSelectedProduct(null)
  }

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId)
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
    setSelectedProduct(null)
  }

  const filteredIncomingGoods = incomingGoods
    .filter(
      (item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const filteredRestockHistory = restockHistory
    .filter(
      (item) =>
        item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Tambah Produk Baru</h2>
        <form onSubmit={handleNewProductSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="label">
              Nama Produk
            </label>
            <input
              type="text"
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="label">
              Kategori
            </label>
            <div className="flex gap-2">
              <select
                id="category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                className="input"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => document.getElementById("addCategoryDialog").showModal()}
                className="btn btn-secondary"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="purchasePrice" className="label">
              Harga Beli
            </label>
            <input
              type="number"
              id="purchasePrice"
              value={newProduct.purchasePrice}
              onChange={(e) => setNewProduct({ ...newProduct, purchasePrice: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sellingPrice" className="label">
              Harga Jual
            </label>
            <input
              type="number"
              id="sellingPrice"
              value={newProduct.sellingPrice}
              onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="stock" className="label">
              Jumlah Stok
            </label>
            <input
              type="number"
              id="stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="input"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="supplier" className="label">
              Supplier
            </label>
            <input
              type="text"
              id="supplier"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              className="input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary flex items-center">
            <Plus size={16} className="mr-2" /> Tambah Produk
          </button>
        </form>
      </div>

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Cari Produk</h2>
        <form onSubmit={handleProductSearch}>
          <div className="mb-4">
            <label htmlFor="searchTerm" className="label">
              Nama Produk
            </label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </form>
      </div>

      {/* Riwayat Barang Masuk Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Riwayat Barang Masuk</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Tanggal</th>
                <th className="text-left py-2 px-4">Produk</th>
                <th className="text-left py-2 px-4">Kategori</th>
                <th className="text-left py-2 px-4">Jumlah</th>
                <th className="text-left py-2 px-4">Harga Beli</th>
                <th className="text-left py-2 px-4">Harga Jual</th>
                <th className="text-left py-2 px-4">Total</th>
                <th className="text-left py-2 px-4">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncomingGoods.map((item) => (
                <tr key={item.id} className="border-b">
                  {editingId === item.id ? (
                    <>
                      <td colSpan="9">
                        <form onSubmit={handleEditSubmit} className="py-2">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="label">Nama Produk</label>
                              <input
                                type="text"
                                value={editForm.productName}
                                onChange={(e) => setEditForm({ ...editForm, productName: e.target.value })}
                                className="input w-full"
                              />
                            </div>
                            <div>
                              <label className="label">Kategori</label>
                              <input
                                type="text"
                                value={editForm.category}
                                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                className="input w-full"
                              />
                            </div>
                            <div>
                              <label className="label">Jumlah</label>
                              <input
                                type="number"
                                value={editForm.quantity}
                                onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                className="input w-full"
                              />
                            </div>
                            <div>
                              <label className="label">Harga Beli</label>
                              <input
                                type="number"
                                value={editForm.purchasePrice}
                                onChange={(e) => setEditForm({ ...editForm, purchasePrice: e.target.value })}
                                className="input w-full"
                              />
                            </div>
                            <div>
                              <label className="label">Harga Jual</label>
                              <input
                                type="number"
                                value={editForm.sellingPrice}
                                onChange={(e) => setEditForm({ ...editForm, sellingPrice: e.target.value })}
                                className="input w-full"
                              />
                            </div>
                            <div>
                              <label className="label">Supplier</label>
                              <input
                                type="text"
                                value={editForm.supplier}
                                onChange={(e) => setEditForm({ ...editForm, supplier: e.target.value })}
                                className="input w-full"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <button type="submit" className="btn btn-primary mr-2">
                              Simpan
                            </button>
                            <button type="button" onClick={() => setEditingId(null)} className="btn btn-secondary">
                              Batal
                            </button>
                          </div>
                        </form>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                      <td className="py-2 px-4">{item.productName}</td>
                      <td className="py-2 px-4">{item.category}</td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4">Rp {item.purchasePrice?.toLocaleString("id-ID")}</td>
                      <td className="py-2 px-4">Rp {item.sellingPrice?.toLocaleString("id-ID")}</td>
                      <td className="py-2 px-4">Rp {(item.purchasePrice * item.quantity)?.toLocaleString("id-ID")}</td>
                      <td className="py-2 px-4">{item.supplier}</td>
                      <td className="py-2 px-4">
                        <button onClick={() => handleEdit(item)} className="btn btn-secondary">
                          <Edit size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Riwayat Re-Stock Section */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Riwayat Re-Stock</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Tanggal</th>
                <th className="text-left py-2 px-4">Produk</th>
                <th className="text-left py-2 px-4">Kategori</th>
                <th className="text-left py-2 px-4">Jumlah</th>
                <th className="text-left py-2 px-4">Harga Beli</th>
                <th className="text-left py-2 px-4">Harga Jual</th>
                <th className="text-left py-2 px-4">Total</th>
                <th className="text-left py-2 px-4">Supplier</th>
              </tr>
            </thead>
            <tbody>
              {filteredRestockHistory.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="py-2 px-4">{new Date(item.date).toLocaleDateString("id-ID")}</td>
                  <td className="py-2 px-4">{item.productName}</td>
                  <td className="py-2 px-4">{item.category}</td>
                  <td className="py-2 px-4">{item.quantity}</td>
                  <td className="py-2 px-4">Rp {item.purchasePrice?.toLocaleString("id-ID")}</td>
                  <td className="py-2 px-4">Rp {item.sellingPrice?.toLocaleString("id-ID")}</td>
                  <td className="py-2 px-4">Rp {(item.purchasePrice * item.quantity)?.toLocaleString("id-ID")}</td>
                  <td className="py-2 px-4">{item.supplier}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Category Dialog */}
      <dialog
        id="addCategoryDialog"
        className="modal p-4 rounded-lg shadow-lg backdrop:bg-black backdrop:bg-opacity-50"
      >
        <div className="w-full max-w-sm">
          <h3 className="text-lg font-semibold mb-4">Tambah Kategori Baru</h3>
          <form onSubmit={handleAddCategory}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="input mb-4"
              placeholder="Nama Kategori"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => document.getElementById("addCategoryDialog").close()}
                className="btn btn-danger"
              >
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Tambah
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}

