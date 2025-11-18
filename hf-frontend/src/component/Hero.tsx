import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-indigo-100 pt-20 pb-32 sm:pt-32 sm:pb-48">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-600">
                Potenza dell'IA al tuo servizio
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Analizza Testi con
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Intelligenza Artificiale
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
                Accedi a modelli state-of-the-art per sentiment analysis, classificazione testi, generazione e molto altro. Nessuna configurazione complicata richiesta.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/predict">
                <Button className="w-full sm:w-auto h-12 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                  Inizia Subito
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <button className="w-full sm:w-auto h-12 px-8 border-2 border-gray-300 hover:border-blue-600 text-gray-900 hover:text-blue-600 font-semibold text-base rounded-lg transition-all hover:bg-blue-50">
                <Play className="w-5 h-5 mr-2 inline" />
                Guarda Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-2xl font-bold text-gray-900">50+</div>
                <p className="text-sm text-gray-600">Modelli disponibili</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <p className="text-sm text-gray-600">Dati privati</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">&lt;1s</div>
                <p className="text-sm text-gray-600">Tempo medio</p>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-700">
            <div className="relative w-full h-96">
              {/* Main Card */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl transform -rotate-6 shadow-2xl"></div>

              <div className="absolute inset-0 bg-white rounded-2xl shadow-xl overflow-hidden transform rotate-3 p-8 space-y-6">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex gap-2">
                    <div className="h-3 bg-green-200 rounded-full w-16 animate-pulse"></div>
                    <div className="h-3 bg-red-200 rounded-full w-16 animate-pulse"></div>
                  </div>
                </div>

                <div className="pt-4">
                  <div className="h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg animate-pulse"></div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-gray-900">Modello Attivo</span>
                </div>
              </div>

              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200 animate-float animation-delay-1000">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚡</span>
                  <span className="text-sm font-semibold text-gray-900">Veloce</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 pt-12 border-t border-gray-200">
          <div className="text-center space-y-4">
            <p className="text-gray-600 font-medium">Trusted by developers and researchers worldwide</p>
            <div className="flex justify-center gap-6 text-gray-500 text-sm">
              <span>Hugging Face</span>
              <span>•</span>
              <span>PyTorch</span>
              <span>•</span>
              <span>TensorFlow</span>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}