import { Link } from "react-router-dom";
import { Sparkles, Mail, Github, Twitter, Linkedin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Rimani aggiornato
            </h3>
            <p className="text-gray-600">
              Ricevi le ultime novità su nuovi modelli e funzionalità
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="La tua email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Iscriviti
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center transform group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-lg text-gray-900">AIModels</span>
            </Link>

            <p className="text-gray-600 leading-relaxed">
              Accedi a modelli di IA state-of-the-art per analizzare, classificare e comprendere testi.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white flex items-center justify-center transition-colors"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white flex items-center justify-center transition-colors"
                title="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-blue-600 text-gray-700 hover:text-white flex items-center justify-center transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Prodotto */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg">Prodotto</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Caratteristiche
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Modelli
                </a>
              </li>
              <li>
                <Link
                  to="/predict"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Prova Subito
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Changelog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Risorse */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg">Risorse</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Documentazione
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Tutorial
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Legale */}
          <div className="space-y-4">
            <h4 className="font-bold text-gray-900 text-lg">Legale</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Termini d'Uso
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Contatti
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                  Status
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-gray-600 text-center md:text-left flex items-center gap-2">
              © {currentYear} AIModels. Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by developers.
            </p>

            {/* Bottom Links */}
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Security
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Status
              </a>
              <span className="text-gray-300">•</span>
              <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">
                Feedback
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_bottom,rgba(0,0,0,.02),rgba(0,0,0,.02))] pointer-events-none"></div>
    </footer>
  );
}