import { useEffect, useState, useMemo } from "react";
import { type HFModelInfo, fetchModels } from "../assets/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Search, AlertTriangle, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Componente Placeholder (Skeleton Loading)
const ModelCardSkeleton = () => (
  <Card className="h-full border-0 shadow-md overflow-hidden bg-white">
    <div className="h-1 bg-gray-200 animate-pulse"></div>
    <CardHeader className="pb-4">
      <Skeleton className="h-6 w-3/4 mb-3" />
      <Skeleton className="h-5 w-1/3" />
    </CardHeader>
    <CardContent className="space-y-4">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-10 w-full mt-4" />
    </CardContent>
  </Card>
);

export default function ModelGrid() {
  const [models, setModels] = useState<HFModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState<string>("all");

  // Funzione di caricamento estratta per poter riprovare in caso di errore
  const loadModelsData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Tentativo di connessione API...");
      const data = await fetchModels();
      console.log("Dati ricevuti:", data);

      if (Array.isArray(data) && data.length > 0) {
        setModels(data);
      } else {
        // Se l'array è vuoto ma non c'è errore di rete
        console.warn("API ha restituito array vuoto");
        setModels([]);
      }
    } catch (err: any) {
      console.error("Errore fetchModels in ModelGrid:", err);
      setError(err.message || "Impossibile caricare i modelli. Verifica che il backend sia attivo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModelsData();
  }, []);

  const getTaskColor = (task: string) => {
    const colors: Record<string, string> = {
      "sentiment-analysis": "bg-rose-100 text-rose-700 border-rose-300/50",
      "text-classification": "bg-rose-100 text-rose-700 border-rose-300/50", // Alias comune
      "text-generation": "bg-blue-100 text-blue-700 border-blue-300/50",
      "summarization": "bg-purple-100 text-purple-700 border-purple-300/50",
      "translation": "bg-green-100 text-green-700 border-green-300/50",
      "question-answering": "bg-orange-100 text-orange-700 border-orange-300/50",
      "token-classification": "bg-teal-100 text-teal-700 border-teal-300/50",
    };
    return colors[task] || "bg-gray-100 text-gray-700 border-gray-300/50";
  };

  const filteredModels = useMemo(() => {
    let currentModels = models;

    if (selectedTask !== "all") {
      currentModels = currentModels.filter(m => m.task === selectedTask);
    }

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      currentModels = currentModels.filter(
        m => m.name.toLowerCase().includes(lowerCaseSearch) ||
             m.task.toLowerCase().includes(lowerCaseSearch) ||
             m.model_id.toLowerCase().includes(lowerCaseSearch)
      );
    }

    return currentModels;
  }, [models, selectedTask, searchTerm]);

  const availableTasks = useMemo(() => {
    const tasks = new Set(models.map(m => m.task));
    return ["all", ...Array.from(tasks)].sort();
  }, [models]);


  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-[500px]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-sm font-bold text-blue-600 uppercase tracking-wider">
              Modelli Disponibili
            </h2>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Scegli il tuo modello IA
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Una collezione di modelli state-of-the-art pronti per essere utilizzati.
          </p>
        </div>

        {/* Messaggio di Errore Visibile */}
        {error && (
          <Alert variant="destructive" className="mb-8 border-2 border-red-200 bg-red-50">
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-bold text-lg">Errore di Connessione</AlertTitle>
            <AlertDescription className="mt-2">
              <p>{error}</p>
              <p className="text-sm mt-2 text-red-700 font-mono bg-red-100 p-2 rounded">
                 URL API previsto: {import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000"}
              </p>
              <Button
                onClick={loadModelsData}
                variant="outline"
                className="mt-4 border-red-300 hover:bg-red-100 text-red-800"
              >
                <RefreshCcw className="w-4 h-4 mr-2" /> Riprova Connessione
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Sezione Filtri (Disabilitata se errore o caricamento) */}
        <div className={`flex flex-col sm:flex-row gap-4 mb-10 p-4 bg-white border rounded-lg shadow-sm transition-opacity ${loading || error ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                    type="text"
                    placeholder="Cerca per nome o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 w-full"
                />
            </div>

            <div className="w-full sm:w-1/3">
                <Select value={selectedTask} onValueChange={setSelectedTask}>
                    <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Filtra per Task" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tutti i Task</SelectItem>
                        {availableTasks.filter(t => t !== "all").map(task => (
                            <SelectItem key={task} value={task}>
                                {task.charAt(0).toUpperCase() + task.slice(1).replace('-', ' ')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* LOADING STATE */}
          {loading && !error && Array.from({ length: 6 }).map((_, idx) => (
            <ModelCardSkeleton key={idx} />
          ))}

          {/* MODELS LIST */}
          {!loading && !error && filteredModels.map((m, idx) => (
            <div
              key={m.key}
              className="group animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <Card className="h-full border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden bg-white flex flex-col">
                <div className={`h-1 ${getTaskColor(m.task).split(' ')[0]}`}></div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {m.name}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className={`w-fit font-semibold ${getTaskColor(m.task)}`}>
                    {m.task.charAt(0).toUpperCase() + m.task.slice(1).replace('-', ' ')}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
                  <div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">
                       Modello ottimizzato per compiti di {m.task.replace('-', ' ')}.
                    </p>
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">ID Modello</p>
                        <code className="block text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded font-mono break-all border border-gray-200">
                        {m.model_id}
                        </code>
                    </div>
                  </div>

                  <Link to={`/predict?model=${m.key}`} className="block pt-4 mt-auto">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all transform hover:shadow-lg group-hover:bg-blue-700">
                      Prova subito
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          ))}

          {/* EMPTY STATE (No models found after filter) */}
          {!loading && !error && filteredModels.length === 0 && models.length > 0 && (
            <div className="lg:col-span-3">
                <Card className="border-2 border-dashed border-gray-300 bg-white">
                  <CardContent className="text-center py-16">
                    <Search className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg font-medium">Nessun modello trovato</p>
                    <p className="text-gray-500 mt-2">Prova a modificare i filtri o la ricerca.</p>
                  </CardContent>
                </Card>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}