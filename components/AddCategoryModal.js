import { useState } from "react";

export default function AddCategoryModal({ onAddCategory, onClose }) {
  const [category, setCategory] = useState("");

  const handleAddCategory = (e) => {
    e.preventDefault();
    onAddCategory(category);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Tambah Kategori Baru</h2>
        <form onSubmit={handleAddCategory}>
          <div className="mb-4">
            <label htmlFor="category" className="label">Nama Kategori</label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">Batal</button>
            <button type="submit" className="btn btn-primary">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  );
}