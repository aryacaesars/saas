"use client"

import { useState, useEffect } from "react"
import AddProductForm from "./AddProductForm"
import SearchProductForm from "./SearchProductForm"
import IncomingGoodsHistory from "./IncomingGoodsHistory"
import RestockHistory from "./RestockHistory"

export default function IncomingGoods() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [incomingGoods, setIncomingGoods] = useState([])
  const [restockHistory, setRestockHistory] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

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

  const handleAddProduct = (newProduct, supplier) => {
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
  }

  const handleAddCategory = (newCategory) => {
    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    localStorage.setItem("categories", JSON.stringify(updatedCategories))
  }

  const handleProductSearch = (searchTerm) => {
    setSearchTerm(searchTerm)
    const product = products.find((p) => p.name.toLowerCase() === searchTerm.toLowerCase())
    setSelectedProduct(product)
  }

  const filteredIncomingGoods = incomingGoods
    .filter(
      (item) =>
        (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const filteredRestockHistory = restockHistory
    .filter(
      (item) =>
        (item.productName && item.productName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div className="grid grid-cols-1 gap-6">
      <AddProductForm categories={categories} onAddProduct={handleAddProduct} onAddCategory={handleAddCategory} />
      <SearchProductForm onSearch={handleProductSearch} />
      <IncomingGoodsHistory incomingGoods={filteredIncomingGoods} />
      <RestockHistory restockHistory={filteredRestockHistory} />
    </div>
  )
}

