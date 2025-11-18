import { useEffect, useState } from "react";
import { type HFModelInfo, fetchModels } from "../assets/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function ModelGrid() {
  const [models, setModels] = useState<HFModelInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModels().then((data) => {
      setModels(data);
      setLoading(false);
    });
  }, []);

  const getTaskColor = (task: string) => {
    const colors: Record<string, string> = {
      "sentiment-analysis": "bg-rose-100 text-rose-700",
      "text-generation": "bg-blue-100 text-blue-700",
      "summarization": "bg-purple-100 text-purple-700",
      "translation": "bg-green-100 text-green-700",
      "question-answering": "bg-orange-100 text-orange-700",
      "text-classification": "bg-indigo-100 text-indigo-700",
    };
    return colors[task] || "bg-gray-100 text-gray-700";
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">
              Modelli Disponibili
            </h2>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Scegli il tuo modello IA
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Una collezione di modelli state-of-the-art pronti per essere utilizzati. Seleziona quello che fa per te e inizia subito.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((m, idx) => (
            <div
              key={m.key}
              className="group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Card className="h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white">
                {/* Top Border Accent */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {m.name}
                      </CardTitle>
                    </div>
                  </div>
                  <Badge className={`w-fit ${getTaskColor(m.task)}`}>
                    {m.task}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Model ID */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      ID Modello
                    </p>
                    <code className="block text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded font-mono break-all">
                      {m.model_id}
                    </code>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Utilizza questo modello per analizzare testi con capacità di {m.task.toLowerCase()}.
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-500 font-medium">Pronto all'uso</span>
                  </div>

                  {/* CTA Button */}
                  <Link to="/predict" className="block pt-2">
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:shadow-lg"
                      onClick={() => localStorage.setItem("selectedModel", m.key)}
                    >
                      Prova il modello
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && models.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
            <CardContent className="text-center py-16">
              <p className="text-gray-600 text-lg font-medium">Nessun modello disponibile</p>
              <p className="text-gray-500 mt-2">Verifica la connessione e riprova</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}