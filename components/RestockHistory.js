export default function RestockHistory({ restockHistory }) {
  return (
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
            {restockHistory.map((item) => (
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
  );
}