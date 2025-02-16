import Link from "next/link"
import { Home, Package, ShoppingCart, TrendingUp, Info } from "lucide-react"

export default function Navbar() {
  return (
    (<nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SaaS Grocery Store
          </Link>
          <ul className="flex space-x-6">
            <NavItem href="/" icon={<Home size={20} />} text="Dashboard" />
            <NavItem href="/warehouse" icon={<Package size={20} />} text="Warehouse" />
            <NavItem href="/pos" icon={<ShoppingCart size={20} />} text="POS" />
            <NavItem href="/incoming" icon={<TrendingUp size={20} />} text="Incoming" />
            <NavItem href="/store-info" icon={<Info size={20} />} text="Store Info" />
          </ul>
        </div>
      </div>
    </nav>)
  );
}

function NavItem({ href, icon, text }) {
  return (
    (<li>
      <Link
        href={href}
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200">
        {icon}
        <span className="ml-2">{text}</span>
      </Link>
    </li>)
  );
}

