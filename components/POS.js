"use client"

import { useState, useEffect } from "react"
import Login from "./Login"
import { ShoppingCart, DollarSign, CreditCard, Plus, Minus, LogOut, Trash } from "lucide-react"
import html2canvas from "html2canvas"
import { QRCodeSVG } from "qrcode.react"
import Modal from "./Modal"

export default function POS() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("cash")
  const [cashAmount, setCashAmount] = useState("")
  const [change, setChange] = useState(0)
  const [cashier, setCashier] = useState(null)
  const [storeInfo, setStoreInfo] = useState(null)
  const [showReceipt, setShowReceipt] = useState(false)
  const [currentTransaction, setCurrentTransaction] = useState(null)
  const [qrisCode, setQrisCode] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState("")

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || []
    setProducts(storedProducts)

    const storedStoreInfo = JSON.parse(localStorage.getItem("storeInfo")) || {}
    setStoreInfo(storedStoreInfo)

    const loggedInCashier = JSON.parse(localStorage.getItem("loggedInCashier"))
    setCashier(loggedInCashier)

    // Fetch categories from incoming goods
    const storedCategories = JSON.parse(localStorage.getItem("categories")) || []
    setCategories(storedCategories)
  }, [])

  useEffect(() => {
    const newTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(newTotal)
  }, [cart])

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id)
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart(cart.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)))
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { ...product, quantity: 1 }])
      }
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      if (newQuantity > product.stock) {
        setModalContent("Stok tidak mencukupi")
        setShowModal(true)
      } else if (newQuantity > 0) {
        setCart(cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item)))
      } else if (newQuantity === 0) {
        removeFromCart(productId)
      }
    }
  }

  const calculateChange = (amount) => {
    const cashAmount = Number.parseFloat(amount)
    if (!isNaN(cashAmount)) {
      const changeAmount = cashAmount - total
      setCashAmount(amount)
      setChange(changeAmount)
    }
  }

  const handlePayment = () => {
    if (paymentMethod === "cash") {
      const cashAmountValue = Number.parseFloat(cashAmount)
      if (isNaN(cashAmountValue) || cashAmountValue < total) {
        setModalContent("Jumlah tunai tidak mencukupi")
        setShowModal(true)
        return
      }
      const changeAmount = cashAmountValue - total
      setChange(changeAmount)
    } else if (paymentMethod === "qris") {
      // Generate QRIS code (ini hanya simulasi, Anda perlu mengintegrasikan dengan penyedia QRIS yang sebenarnya)
      setQrisCode(`QRIS${Date.now()}${total}`)
    }

    // Update product stock
    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id)
      if (cartItem) {
        return { ...product, stock: product.stock - cartItem.quantity }
      }
      
      return product
    })
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Save transaction
    const transaction = {
      id: Date.now(),
      items: cart,
      total,
      paymentMethod,
      cashier: cashier.username,
      date: new Date().toISOString(),
      cashAmount: paymentMethod === "cash" ? Number.parseFloat(cashAmount) : 0,
      change: paymentMethod === "cash" ? Number.parseFloat(change) : 0,
      qrisCode: paymentMethod === "qris" ? qrisCode : "",
    }
    const storedSales = JSON.parse(localStorage.getItem("sales")) || []
    localStorage.setItem("sales", JSON.stringify([...storedSales, transaction]))

    setCurrentTransaction(transaction)
    setShowReceipt(true)

    // Clear cart
    setCart([])
    setCashAmount("")
    setChange(0)
    setQrisCode("")
  }

  const generateReceipt = () => {
    const receiptElement = document.getElementById("receipt")
    html2canvas(receiptElement).then((canvas) => {
      const link = document.createElement("a")
      link.download = `struk-${currentTransaction.id}.png`
      link.href = canvas.toDataURL()
      link.click()
    })
  }

  const handleLogin = (loggedInCashier) => {
    setCashier(loggedInCashier)
  }

  const handleLogout = () => {
    localStorage.removeItem("loggedInCashier")
    setCashier(null)
  }

  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === "" || product.category === selectedCategory) &&
      (searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  if (!cashier) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2">
        <div className="flex justify-between items-center mb-4">
          <button onClick={handleLogout} className="btn btn-danger flex items-center">
            <LogOut size={16} className="mr-2" /> Logout
          </button>
        </div>
        <div className="p-3 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Produk</h2>
          <div className="mb-4 flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                className={`p-2 border rounded-md text-left hover:bg-gray-100 transition-colors duration-200 ${
                  product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={product.stock === 0}
              >
                <h3 className="font-semibold text-sm">{product.name}</h3>
                <p className="text-xs text-gray-600">Harga: Rp {product.price.toLocaleString("id-ID")}</p>
                <p className="text-xs text-gray-600">Stok: {product.stock}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-1">
        <div className="card p-4 bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Keranjang</h2>
          <ul className="mb-4 divide-y">
            {cart.map((item) => (
              <li key={item.id} className="py-2 flex justify-between items-center">
                <span>{item.name}</span>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                    className="w-16 text-center mx-2 input"
                    min="1"
                    max={item.stock}
                  />

                  <span className="ml-4">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                  <button onClick={() => removeFromCart(item.id)} className="btn btn-danger ml-2">
                    <Trash size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <div className="font-bold text-xl mb-4">Total: Rp {total.toLocaleString("id-ID")}</div>
          <div className="mb-4">
            <label className="label">Metode Pembayaran</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`btn flex items-center ${paymentMethod === "cash" ? "btn-primary" : "btn-secondary"}`}
              >
                <DollarSign size={16} className="mr-2" /> Tunai
              </button>
              <button
                onClick={() => setPaymentMethod("qris")}
                className={`btn flex items-center ${paymentMethod === "qris" ? "btn-primary" : "btn-secondary"}`}
              >
                <CreditCard size={16} className="mr-2" /> QRIS
              </button>
            </div>
          </div>
          {paymentMethod === "cash" && (
            <div className="mb-4">
              <label htmlFor="cashAmount" className="label">
                Jumlah Tunai
              </label>
              <input
                type="number"
                id="cashAmount"
                value={cashAmount}
                onChange={(e) => calculateChange(e.target.value)}
                className="input"
              />
            </div>
          )}
          {paymentMethod === "qris" && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Kode QRIS</h3>
              <QRCodeSVG value={qrisCode || `QRIS${Date.now()}${total}`} size={200} />
            </div>
          )}
          <button
            onClick={handlePayment}
            className="btn btn-primary flex items-center"
            disabled={cart.length === 0 || (paymentMethod === "cash" && Number.parseFloat(cashAmount) < total)}
          >
            <ShoppingCart size={16} className="mr-2" /> Selesaikan Pembayaran
          </button>
        </div>
      </div>

      {showReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full relative">
            {/* Zig-zag top edge */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCA0Ij48cGF0aCBkPSJNMCAwbDUgNCA1LTQgNSA0IDUtNHY0SDB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat-x"></div>

            <div id="receipt" className="p-6 pt-8 font-mono text-sm">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold uppercase">{storeInfo.name}</h2>
                <p>{storeInfo.address}</p>
                <p className="mb-2">{storeInfo.phone}</p>
                <p className="text-xs mb-1">{new Date(currentTransaction.date).toLocaleDateString("id-ID")}</p>
                <p className="text-xs mb-1">{new Date(currentTransaction.date).toLocaleTimeString("id-ID")}</p>
                <p className="text-xs">No.{currentTransaction.id}</p>
                <p className="text-xs mt-1">Kasir: {currentTransaction.cashier}</p>
              </div>

              <div className="border-t border-b border-dashed border-gray-300 py-2 mb-2">
                {currentTransaction.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <div>{item.name}</div>
                      <div>
                        {item.quantity} x {item.price.toLocaleString("id-ID")}
                      </div>
                    </div>
                    <div>Rp {(item.price * item.quantity).toLocaleString("id-ID")}</div>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>Rp {currentTransaction.total.toLocaleString("id-ID")}</span>
                </div>
                {currentTransaction.paymentMethod === "cash" && (
                  <>
                    <div className="flex justify-between">
                      <span>Bayar</span>
                      <span>Rp {currentTransaction.cashAmount.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kembali</span>
                      <span>Rp {currentTransaction.change.toLocaleString("id-ID")}</span>
                    </div>
                  </>
                )}
                {currentTransaction.paymentMethod === "qris" && (
                  <div className="flex justify-between">
                    <span>Metode Pembayaran</span>
                    <span>QRIS</span>
                  </div>
                )}
              </div>

              <div className="text-center text-sm">
                  <div className="text-center">
                    <div>Terima Kasih</div>
                  </div>
              </div>
            </div>

            {/* Zig-zag bottom edge */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCA0Ij48cGF0aCBkPSJNMCAwbDUgNCA1LTQgNSA0IDUtNHY0SDB6IiBmaWxsPSIjZmZmIi8+PC9zdmc+')] bg-repeat-x transform rotate-180"></div>

            <div className="mt-4 flex justify-between p-4">
              <button onClick={() => setShowReceipt(false)} className="btn btn-secondary">
                Tutup
              </button>
              <button onClick={generateReceipt} className="btn btn-primary">
                Unduh Struk (PNG)
              </button>
            </div>
          </div>
        </div>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} title="Pemberitahuan">
        <p>{modalContent}</p>
      </Modal>
    </div>
  )
}