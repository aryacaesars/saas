import { useState } from "react";
import { Plus } from "lucide-react";

export default function AddProductForm({ categories, onAddProduct }) {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    purchasePrice: "",
    sellingPrice: "",
    stock: "",
  });
  const [supplier, setSupplier] = useState("");

  const handleNewProductSubmit = (e) => {
    e.preventDefault();
    onAddProduct(newProduct, supplier);
    setNewProduct({
      name: "",
      category: "",
      purchasePrice: "",
      sellingPrice: "",
      stock: "",
    });
    setSupplier("");
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">Tambah Produk Baru</h2>
      <form onSubmit={handleNewProductSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="label">Nama Produk</label>
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
          <label htmlFor="category" className="label">Kategori</label>
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
                <option key={category} value={category}>{category}</option>
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
          <label htmlFor="purchasePrice" className="label">Harga Beli</label>
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
          <label htmlFor="sellingPrice" className="label">Harga Jual</label>
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
          <label htmlFor="stock" className="label">Jumlah Stok</label>
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
          <label htmlFor="supplier" className="label">Supplier</label>
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
  );
}