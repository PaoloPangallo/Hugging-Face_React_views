import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import PredictForm from "../component/PredictForm";

export default function PredictPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Fai una Predizione
            </h1>
            <p className="text-gray-600">
              Seleziona un modello, inserisci del testo e ottieni un risultato immediato.
            </p>
          </div>

          <PredictForm />
        </div>
      </div>

      <Footer />
    </div>
  );
}