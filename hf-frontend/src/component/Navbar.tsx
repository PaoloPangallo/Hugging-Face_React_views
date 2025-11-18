import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="hidden sm:block font-bold text-xl text-gray-900">
              AIModels
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Modelli
            </Link>
            <a
              href="#features"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Caratteristiche
            </a>
            <a
              href="#about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Chi Siamo
            </a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/predict">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Inizia
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Modelli
            </Link>
            <a
              href="#features"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Caratteristiche
            </a>
            <a
              href="#about"
              className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
            >
              Chi Siamo
            </a>
            <Link
              to="/predict"
              onClick={() => setMobileOpen(false)}
            >
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Inizia
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}