import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, ChevronDown, Rocket, LayoutGrid, Brain } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dati fittizi per il dropdown dei modelli (simuliamo le categorie o modelli popolari)
const modelLinks = [
  { name: "Tutti i Modelli", href: "/", icon: LayoutGrid, description: "Esplora il catalogo completo." },
  { name: "Named Entity Recognition (NER)", href: "/predict?task=ner", icon: Brain, description: "Identifica entità (Luoghi, Persone, Org)." },
  { name: "Generazione Testo", href: "/predict?task=generation", icon: Rocket, description: "Crea contenuti testuali o codice." },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="hidden sm:block font-extrabold text-xl text-gray-900 tracking-tight">
              AI Hub
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">

            {/* 1. Dropdown per l'Esplorazione Modelli */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium transition-colors group">
                  Esplora Modelli
                  <ChevronDown className="w-4 h-4 ml-1 transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 shadow-xl">
                {modelLinks.map((item, index) => (
                  <Link to={item.href} key={index} className="block">
                    <DropdownMenuItem className="cursor-pointer flex items-center gap-3 p-2 hover:bg-blue-50 rounded transition-colors">
                      <item.icon className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-semibold text-gray-800 leading-none">{item.name}</p>
                        {/* La descrizione è ottima per l'UX informativa */}
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      </div>
                    </DropdownMenuItem>
                  </Link>
                ))}
                <DropdownMenuSeparator />
                <Link to="/" className="block">
                    <DropdownMenuItem className="cursor-pointer text-sm font-medium text-gray-600 hover:text-blue-600 justify-center">
                        Vedi tutti i Modelli
                    </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. Link diretti (pagine meno importanti) */}
            <Link
              to="/docs"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Documentazione
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              API
            </Link>
          </div>

          {/* Desktop CTA (Call To Action) */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/predict">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-lg transition-shadow">
                <Rocket className="w-4 h-4 mr-2" />
                Prova Sandbox
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
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
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3 px-4 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Mobile: Link principali e Dropdown simulato */}
            <p className="text-sm font-semibold text-gray-500 mt-2 border-b pb-2">Modelli IA</p>
            {modelLinks.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="flex items-center gap-3 px-2 py-2 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-50 rounded transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <item.icon className="w-5 h-5 text-blue-500" />
                  {item.name}
                </Link>
            ))}

            <DropdownMenuSeparator />

            {/* Mobile: Link secondari */}
            <Link
              to="/docs"
              className="block px-2 py-2 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-50 rounded transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Documentazione
            </Link>
            <Link
              to="/about"
              className="block px-2 py-2 text-gray-700 hover:text-blue-600 font-medium hover:bg-gray-50 rounded transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              API
            </Link>

            {/* Mobile CTA */}
            <Link
              to="/predict"
              onClick={() => setMobileOpen(false)}
            >
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Inizia la Predizione
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}