import { useState } from "react";

export default function RestockModal({ product, onRestock, onClose }) {
  const [quantity, setQuantity] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState(product.purchasePrice);
  const [sellingPrice, setSellingPrice] = useState(product.sellingPrice);
  const [supplier, setSupplier] = useState(product.supplier);
  const [additionalData, setAdditionalData] = useState(""); // New state for additional data

  const handleRestock = (e) => {
    e.preventDefault();
    onRestock(product, quantity, purchasePrice, sellingPrice, supplier, additionalData); // Include additional data
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Restock {product.name}</h2>
        <form onSubmit={handleRestock}>
          <div className="mb-4">
            <label htmlFor="quantity" className="label">Jumlah Restock</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="input"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="purchasePrice" className="label">Harga Beli</label>
            <input
              type="number"
              id="purchasePrice"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="input"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="sellingPrice" className="label">Harga Jual</label>
            <input
              type="number"
              id="sellingPrice"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
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
          <div className="mb-4">
            <label htmlFor="additionalData" className="label">Additional Data</label>
            <input
              type="text"
              id="additionalData"
              value={additionalData}
              onChange={(e) => setAdditionalData(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">Batal</button>
            <button type="submit" className="btn btn-primary">Restock</button>
          </div>
        </form>
      </div>
    </div>
  );
}