"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Package, ShoppingCart, TrendingUp, Info, Menu, X } from "lucide-react"

const menuItems = [
  { icon: Home, text: "Dashboard", href: "/" },
  { icon: Package, text: "Gudang", href: "/warehouse" },
  { icon: ShoppingCart, text: "Kasir", href: "/pos" },
  { icon: TrendingUp, text: "Barang Masuk", href: "/incoming" },
  { icon: Info, text: "Info Toko", href: "/store-info" },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize);
  }, [])

  return (<>
    <button
      className="fixed p-2 bg-gray-800 text-white rounded-lg top-4 left-4 md:hidden z-20"
      onClick={() => setIsOpen(!isOpen)}>
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
    <aside
      className={`
        fixed md:sticky top-0 left-0 h-screen
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        bg-white border-r w-64
        z-10
      `}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <span className="text-xl font-bold text-black">Shop Management</span>
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          <ul className="p-4">
            {menuItems.map((item) => (
              <li key={item.href} className="mb-2">
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-2 rounded-lg
                    transition-colors duration-200
                    ${pathname === item.href ? "bg-gray-300 rounded-xl text-black" : "text-gray-600 hover:bg-gray-100"}
                  `}
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      setIsOpen(false)
                    }
                  }}>
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.text}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
    {/* Overlay for mobile */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-0"
        onClick={() => setIsOpen(false)} />
    )}
  </>);
}

