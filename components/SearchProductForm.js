import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchProductForm({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleProductSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-semibold mb-4">Cari Produk</h2>
      <form onSubmit={handleProductSearch}>
        <div className="mb-4">
          <label htmlFor="searchTerm" className="label">Nama Produk</label>
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
  );
}