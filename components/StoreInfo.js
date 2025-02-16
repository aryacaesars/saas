"use client"

import { useState, useEffect } from "react"
import { Save, Plus, User } from "lucide-react"

export default function StoreInfo() {
  const [storeInfo, setStoreInfo] = useState({
    name: "",
    address: "",
    phone: "",
  })
  const [cashiers, setCashiers] = useState([])
  const [newCashier, setNewCashier] = useState("")

  useEffect(() => {
    const storedInfo = JSON.parse(localStorage.getItem("storeInfo")) || {}
    setStoreInfo(storedInfo)

    const storedCashiers = JSON.parse(localStorage.getItem("cashiers")) || []
    setCashiers(storedCashiers)
  }, [])

  const handleStoreInfoChange = (e) => {
    setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
  }

  const handleStoreInfoSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("storeInfo", JSON.stringify(storeInfo))
    alert("Store information updated successfully!")
  }

  const handleAddCashier = (e) => {
    e.preventDefault()
    if (newCashier) {
      const updatedCashiers = [...cashiers, { username: newCashier, password: `${newCashier}123` }]
      setCashiers(updatedCashiers)
      localStorage.setItem("cashiers", JSON.stringify(updatedCashiers))
      setNewCashier("")
    }
  }

  return (
    (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Store Information</h2>
        <form onSubmit={handleStoreInfoSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="label">
              Store Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={storeInfo.name}
              onChange={handleStoreInfoChange}
              className="input"
              required />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="label">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={storeInfo.address}
              onChange={handleStoreInfoChange}
              className="input"
              required />
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="label">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={storeInfo.phone}
              onChange={handleStoreInfoChange}
              className="input"
              required />
          </div>
          <button type="submit" className="btn btn-primary">
            <Save size={16} className="mr-2" /> Update Store Info
          </button>
        </form>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Cashiers</h2>
        <form onSubmit={handleAddCashier} className="mb-4">
          <div className="flex">
            <input
              type="text"
              value={newCashier}
              onChange={(e) => setNewCashier(e.target.value)}
              className="input flex-grow rounded-r-none"
              placeholder="Enter cashier name"
              required />
            <button type="submit" className="btn btn-primary rounded-l-none">
              <Plus size={16} className="mr-2" /> Add Cashier
            </button>
          </div>
        </form>
        <ul className="divide-y">
          {cashiers.map((cashier) => (
            <li key={cashier.username} className="py-4">
              <div className="flex items-center">
                <User size={24} className="mr-2 text-gray-500" />
                <div>
                  <p className="font-semibold">{cashier.username}</p>
                  <p className="text-sm text-gray-600">Password: {cashier.password}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>)
  );
}

