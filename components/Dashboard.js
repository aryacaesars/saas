"use client"

import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { TrendingUp, TrendingDown, Wallet, Package } from "lucide-react"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        font: {
          size: 12,
          weight: "bold",
        },
        padding: 20,
      },
    },
    title: {
      display: true,
      text: "Statistik Keuangan",
      font: {
        size: 18,
        weight: "bold",
      },
      padding: {
        top: 10,
        bottom: 30,
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `Rp ${value.toLocaleString("id-ID")}`,
      },
    },
  },
  barThickness: "flex",
  maxBarThickness: 30,
  categoryPercentage: 0.8,
  barPercentage: 0.9,
}

export default function Dashboard() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  })
  const [chartType, setChartType] = useState("sales")
  const [summary, setSummary] = useState({
    totalSales: 0,
    profit: 0,
    expenses: 0,
    lowStock: [],
  })

  useEffect(() => {
    // Load data from LocalStorage
    const storedSales = JSON.parse(localStorage.getItem("sales")) || []
    const storedProducts = JSON.parse(localStorage.getItem("products")) || []
    const storedIncoming = JSON.parse(localStorage.getItem("incomingGoods")) || []

    // Calculate summary
    const totalSales = storedSales.reduce((sum, sale) => sum + sale.total, 0)
    const expenses = storedIncoming.reduce((total, item) => total + item.purchasePrice * item.quantity, 0)
    const profit = totalSales - expenses
    const lowStock = storedProducts.filter((product) => product.stock < 10)

    setSummary({
      totalSales,
      profit,
      expenses,
      lowStock,
    })

    // Prepare chart data
    const salesByDate = storedSales.reduce((acc, sale) => {
      const date = new Date(sale.date).toLocaleDateString("id-ID")
      acc[date] = (acc[date] || 0) + sale.total
      return acc
    }, {})

    const expensesByDate = storedIncoming.reduce((acc, item) => {
      const date = new Date(item.date).toLocaleDateString("id-ID")
      acc[date] = (acc[date] || 0) + item.purchasePrice * item.quantity
      return acc
    }, {})

    const profitByDate = Object.keys(salesByDate).reduce((acc, date) => {
      acc[date] = (salesByDate[date] || 0) - (expensesByDate[date] || 0)
      return acc
    }, {})

    const allDates = [...new Set([...Object.keys(salesByDate), ...Object.keys(expensesByDate)])].sort()

    const newChartData = {
      labels: allDates,
      datasets: [
        {
          label: "Penjualan",
          data: allDates.map((date) => salesByDate[date] || 0),
          backgroundColor: "rgba(75, 192, 192, 0.8)",
          borderColor: "rgb(75, 192, 192)",
          borderWidth: 1,
        },
        {
          label: "Pengeluaran",
          data: allDates.map((date) => expensesByDate[date] || 0),
          backgroundColor: "rgba(255, 99, 132, 0.8)",
          borderColor: "rgb(255, 99, 132)",
          borderWidth: 1,
        },
        {
          label: "Keuntungan",
          data: allDates.map((date) => profitByDate[date] || 0),
          backgroundColor: "rgba(53, 162, 235, 0.8)",
          borderColor: "rgb(53, 162, 235)",
          borderWidth: 1,
        },
      ],
    }

    setChartData(newChartData)
  }, [])

  const handleChartTypeChange = (type) => {
    setChartType(type)
    const newDatasets = chartData.datasets.map((dataset) => ({
      ...dataset,
      hidden: dataset.label.toLowerCase() !== type,
    }))
    setChartData((prevData) => ({
      ...prevData,
      datasets: newDatasets,
    }))
  }

  return (
    (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <SummaryCard
        title="Total Penjualan"
        value={`Rp ${summary.totalSales.toLocaleString("id-ID")}`}
        icon={<Wallet className="text-green-500" size={24} />} />
      <SummaryCard
        title="Keuntungan"
        value={`Rp ${summary.profit.toLocaleString("id-ID")}`}
        icon={<TrendingUp className="text-blue-500" size={24} />} />
      <SummaryCard
        title="Pengeluaran"
        value={`Rp ${summary.expenses.toLocaleString("id-ID")}`}
        icon={<TrendingDown className="text-red-500" size={24} />} />
      <SummaryCard
        title="Stok Rendah"
        value={summary.lowStock.length}
        icon={<Package className="text-yellow-500" size={24} />} />
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Grafik Keuangan</h2>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${chartType === "penjualan" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => handleChartTypeChange("penjualan")}>
                Penjualan
              </button>
              <button
                className={`px-3 py-1 rounded ${chartType === "pengeluaran" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => handleChartTypeChange("pengeluaran")}>
                Pengeluaran
              </button>
              <button
                className={`px-3 py-1 rounded ${chartType === "keuntungan" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                onClick={() => handleChartTypeChange("keuntungan")}>
                Keuntungan
              </button>
            </div>
          </div>
          <div className="h-[400px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <div className="col-span-1 md:col-span-2 lg:col-span-4">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Produk Stok Rendah</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Nama Produk</th>
                  <th className="text-left py-2">Stok</th>
                  <th className="text-left py-2">Harga Jual</th>
                </tr>
              </thead>
              <tbody>
                {summary.lowStock.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="py-2">{product.name}</td>
                    <td className="py-2">{product.stock}</td>
                    <td className="py-2">Rp {product.price.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>)
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    (<div className="card flex items-center">
      <div className="mr-4">{icon}</div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>)
  );
}

