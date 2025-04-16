import { Links } from "@/lib/constants/links";
import { Search, ShoppingBasket, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Nav() {
  return (
    <div className="font-sans sticky top-0 inset-x-0 z-40">
      {/* Top announcement bar */}
      <div className="bg-pastel-light w-full">
        <header className="max-w-7xl mx-auto flex items-center justify-center h-9 text-xs uppercase tracking-wider text-black px-4 sm:px-8">
          <div className="text-center">FREE SHIPPING OVER $250</div>
        </header>
      </div>
      
      {/* Main navigation */}
      <header className="h-20 bg-soft-beige border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-full flex items-center">
          {/* Left Side - Navigation */}
          <div className="w-1/3">
            <nav className="hidden lg:flex items-center space-x-8">
              {Links.map((link) => (
                <a key={link.name} href={link.href} className="text-black text-sm tracking-tight uppercase relative group">
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pastel-dark transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </nav>
          </div>

          {/* Center - Logo */}
          <div className="w-1/3 flex justify-center">
            <Link href="/" className="flex items-center transition-transform duration-300 hover:scale-105">
              <Image src="/logo.png" alt="SR Laserworks" width={55} height={55} />
            </Link>
          </div>

          {/* Right Side - Actions */}
          <div className="w-1/3 flex items-center justify-end space-x-6">
            <Link href="/login" aria-label="Account" className="text-black transition-transform duration-300 hover:scale-110">
              <User size={22} strokeWidth={1.5} />
            </Link>
            <button aria-label="Search" className="text-black transition-transform duration-300 hover:scale-110 cursor-pointer">
              <Search size={22} strokeWidth={1.5} />
            </button>
            <Link href="/cart" aria-label="Cart" className="text-black transition-transform duration-300 hover:scale-110 relative">
              <ShoppingBasket size={22} strokeWidth={1.5} />
              {/* Cart count badge can be uncommented when needed */}
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Nav;