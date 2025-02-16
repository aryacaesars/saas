import "./globals.css"
import { Inter } from "next/font/google"
import Sidebar from "../components/Sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Aplikasi Toko Kelontong SaaS",
  description: "Kelola toko kelontong Anda dengan mudah",
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gray-100 text-gray-900`}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
            <div className="container mx-auto px-6 py-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}

