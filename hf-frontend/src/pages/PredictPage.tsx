// app/pages/PredictPage.tsx

import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import PredictForm from "../component/PredictForm";
import { useSearchParams } from "react-router-dom"; // <-- Importa questo

export default function PredictPage() {
  // Legge il parametro 'model' dall'URL (es. /predict?model=ner-it-base)
  const [searchParams] = useSearchParams();
  const initialModelKey = searchParams.get("model") || ""; // Ottieni la chiave

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-12">

          {/* Sezione Introduttiva e Modello Target */}
          <div className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
              🔬 Sandbox di Predizione
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Analizza il tuo testo con il modello AI selezionato.
            </p>
          </div>

          {/* PASSAGGIO CHIAVE: Passiamo la chiave del modello al PredictForm */}
          <PredictForm initialModelKey={initialModelKey} />

        </div>
      </main>

      <Footer />
    </div>
  );
}