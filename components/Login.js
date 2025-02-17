"use client"

import { useState } from "react"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const cashiers = JSON.parse(localStorage.getItem("cashiers")) || []
    const cashier = cashiers.find((c) => c.username === username && c.password === password)
    if (cashier) {
      localStorage.setItem("loggedInCashier", JSON.stringify(cashier))
      onLogin(cashier)
    } else {
      setError("Invalid username or password")
    }
  }

  return (
    (<div className="max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Cashier Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required />
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button type="submit" className="btn btn-primary text-white px-4 py-2 rounded-md">
          Login
        </button>
      </form>
    </div>)
  );
}

