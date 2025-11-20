import {useEffect, useState, useMemo, useCallback, type JSX} from "react";
import { fetchModels, predict, type HFModelInfo } from "../assets/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, AlertCircle, Copy } from "lucide-react";

// --- Tipi di Interfaccia ---

interface PredictFormProps {
  initialModelKey: string;
}

interface Entity {
  start: number;
  end: number;
  entity: string;
}

interface HighlightedTextProps {
  text: string;
  entities: Entity[];
}

interface ResponseMeta {
  task?: string;
  model_id?: string;
}

interface ClassificationResultItem {
    label: string;
    score: number;
}


// --- Componenti Ausiliari (Omessi per brevità, ma essenziali) ---
// Funzione placeholder per i componenti che richiedono il corpo completo
const ScoreBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    const percentage = Math.round(score * 100);
    let color = 'bg-indigo-500';
    const upperLabel = label.toUpperCase();

    if (upperLabel === 'POSITIVE' || upperLabel === 'JOY' || upperLabel === 'LOVE') {
        color = 'bg-green-500';
    } else if (upperLabel === 'NEGATIVE' || upperLabel === 'SADNESS' || upperLabel === 'FEAR' || upperLabel === 'ANGER') {
        color = 'bg-red-500';
    } else if (upperLabel === 'NEUTRAL' || upperLabel === 'CALM') {
        color = 'bg-yellow-500';
    }

    return (
        <div className="space-y-1">
            <div className="flex justify-between items-center text-sm font-medium">
                <span>{label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()}</span>
                <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

const ClassificationResult: React.FC<{ task: string; results: ClassificationResultItem[] }> = ({ task, results }) => {
    const sortedResults = results.sort((a, b) => b.score - a.score);
    const topResult = sortedResults[0];
    const displayTask = task.charAt(0).toUpperCase() + task.slice(1).replace('-', ' ');

    let badgeColor = 'bg-indigo-500 hover:bg-indigo-600';
    const upperLabel = topResult.label.toUpperCase();

    if (upperLabel === 'POSITIVE' || upperLabel === 'JOY' || upperLabel === 'LOVE') {
        badgeColor = 'bg-green-500 hover:bg-green-600';
    } else if (upperLabel === 'NEGATIVE' || upperLabel === 'SADNESS' || upperLabel === 'FEAR' || upperLabel === 'ANGER') {
        badgeColor = 'bg-red-500 hover:bg-red-600';
    } else if (upperLabel === 'NEUTRAL' || upperLabel === 'CALM') {
        badgeColor = 'bg-yellow-500 hover:bg-yellow-600';
    }

    return (
        <Card className="p-6 shadow-none border-0">
            <div className="text-center mb-6">
                <p className="text-xl font-semibold text-gray-700 mb-1">{displayTask} Classificato Come:</p>
                <Badge className={`text-2xl font-extrabold px-6 py-2 shadow-lg text-white ${badgeColor}`}>
                    {topResult.label}
                </Badge>
                <p className="text-sm text-gray-500 mt-2">
                    Confidenza: {(topResult.score * 100).toFixed(2)}%
                </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
                <p className="text-lg font-semibold text-gray-700">Distribuzione (Score):</p>
                {sortedResults.map((item, index) => (
                    <ScoreBar key={index} label={item.label} score={item.score} />
                ))}
            </div>
        </Card>
    );
};

const EntityLegend = () => (
  <div className="mt-4 p-3 border rounded-lg bg-white shadow-sm">
    <p className="text-sm font-medium mb-2 text-gray-700">Legenda Entità (Colori):</p>
    <div className="flex flex-wrap gap-3">
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-300 font-semibold">PER (Persona)</Badge>
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-300 font-semibold">ORG (Organizzazione)</Badge>
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100 border-red-300 font-semibold">LOC (Luogo)</Badge>
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-300 font-semibold">MISC (Altro)</Badge>
    </div>
  </div>
);

const entityColors: { [key: string]: string } = {
  PER: "bg-blue-300/60 text-gray-900 font-semibold border-b-2 border-blue-500",
  ORG: "bg-green-300/60 text-gray-900 font-semibold border-b-2 border-green-500",
  LOC: "bg-red-300/60 text-gray-900 font-semibold border-b-2 border-red-500",
  MISC: "bg-yellow-300/60 text-gray-900 font-semibold border-b-2 border-yellow-500",
};

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, entities }) => {
  const sortedEntities = [...entities].sort((a, b) => a.start - b.start);
  const elements: (string | JSX.Element)[] = [];
  let lastIndex = 0;

  sortedEntities.forEach((entity, index) => {
    if (entity.start > lastIndex) {
      elements.push(text.substring(lastIndex, entity.start));
    }

    const entityText = text.substring(entity.start, entity.end);
    const entityType = entity.entity.split("-").pop()?.toUpperCase() || "MISC";
    const colorClass = entityColors[entityType] || entityColors["MISC"];

    elements.push(
      <span
        key={index}
        className={`relative group inline-block px-1 rounded-sm ${colorClass}`}
      >
        {entityText}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 p-1 text-xs bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {entityType}
        </span>
      </span>
    );
    lastIndex = entity.end;
  });

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return (
    <div className="whitespace-pre-wrap break-words text-lg leading-relaxed">
      {elements}
    </div>
  );
};

// --- Component principale ---

export default function PredictForm({ initialModelKey }: PredictFormProps) {
  const [models, setModels] = useState<HFModelInfo[]>([]);
  const [selected, setSelected] = useState<string>(initialModelKey);
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [responseMeta, setResponseMeta] = useState<ResponseMeta | null>(null);
  const [copied, setCopied] = useState(false);

  // Sincronizza selected con la prop iniziale (navigazione diretta)
  useEffect(() => {
    if (initialModelKey) {
      setSelected(initialModelKey);
      setResult(null);
      setError(null);
      setText("");
      setResponseMeta(null);
    }
  }, [initialModelKey]);

  // Caricamento dei modelli disponibili
  useEffect(() => {
    const loadModels = async () => {
        try {
            const data = await fetchModels();
            setModels(data);

            const modelKeys = data.map((m) => m.key);
            const keyExists = initialModelKey && modelKeys.includes(initialModelKey);

            if (data.length > 0) {
              if (keyExists) {
                setSelected(initialModelKey);
              } else {
                setSelected(data[0].key);
              }
            } else {
              setError("L'API non ha restituito alcun modello. Controlla il registro FastAPI.");
              setSelected("");
            }
        } catch (e: any) {
            console.error("Errore critico in loadModels:", e);
            setError(e.message || "Impossibile connettersi al server API. Controlla l'URL base e che FastAPI sia attivo.");
            setSelected("");
        }
    };

    loadModels();
  }, [initialModelKey]);

  const selectedModel = models.find((m) => m.key === selected) || null;

  // Quando cambio modello manualmente, resetto input e risultato
  const handleModelChange = (newKey: string) => {
    setSelected(newKey);
    setText("");
    setResult(null);
    setError(null);
    setResponseMeta(null);
  };

  const handlePredict = useCallback(async () => {
    if (!text.trim() || !selected) {
      setError("Per favore seleziona un modello e inserisci del testo.");
      return;
    }

    setError(null);
    setResult(null);
    setResponseMeta(null);
    setLoading(true);

    try {
      const out = await predict(selected, text);

      setResult(out.result);
      setResponseMeta({
        task: out.task,
        model_id: out.model_id,
      });
    } catch (err: any) {
      console.error("Predict API Error:", err);
      // Estrai il messaggio di errore più significativo
      const message = err.response?.data?.detail || err.message || "Errore sconosciuto";
      setError(`Predizione fallita: ${message}`);
    }

    setLoading(false);
  }, [selected, text]);

  const effectiveTask =
    responseMeta?.task || selectedModel?.task || "unknown-task";

  const copyToClipboard = useCallback(() => {
    const payloadToCopy = {
      result,
      task: effectiveTask,
      model_id: responseMeta?.model_id || selectedModel?.model_id,
    };
    navigator.clipboard.writeText(JSON.stringify(payloadToCopy, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result, effectiveTask, responseMeta, selectedModel]);

  // Visualizzazione robusta in base al tipo di task
  const resultDisplay = useMemo(() => {
    if (loading) {
      return (
        <div className="space-y-4 pt-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-4 w-[85%]" />
          <div className="flex justify-center items-center mt-6 p-4">
            <Loader2 className="w-8 h-8 mr-3 animate-spin text-blue-500" />
            <span className="text-blue-600 font-medium">
              Analisi del testo in corso...
            </span>
          </div>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8">
          <AlertCircle className="w-8 h-8 text-gray-400 mb-3" />
          <p className="text-gray-600 font-medium">
            Clicca &quot;Esegui Predizione&quot; per visualizzare l&apos;analisi.
          </p>
        </div>
      );
    }

    // Risultato vuoto (es. NER senza entità)
    if (Array.isArray(result) && result.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8">
          <AlertCircle className="w-8 h-8 text-gray-300 mb-3" />
          <p className="text-gray-500 font-medium">
            Il modello non ha trovato risultati rilevanti.
          </p>
        </div>
      );
    }

    // ========== NER (token-classification) ==========
    if (
      text &&
      Array.isArray(result) &&
      effectiveTask === "token-classification"
    ) {
      return (
        <>
          <Card className="min-h-[300px] p-6 bg-white border border-gray-200 shadow-inner">
            <HighlightedText text={text} entities={result.filter(e => e.start !== undefined)} />
          </Card>
          <EntityLegend />
        </>
      );
    }

    // ========== TEXT / SENTIMENT / EMOTION (text-classification) ==========
    let classificationData: ClassificationResultItem[] | null = null;

    if (effectiveTask === "text-classification" && Array.isArray(result)) {
        // Formato 1: Risultato è un array di array (il formato di pipeline HF)
        if (Array.isArray(result[0]) && result[0][0]?.label) {
            classificationData = result[0].map((item: any) => ({
                label: item.label,
                score: item.score
            }));
        }
        // Formato 2: Risultato è un array diretto di oggetti (a volte succede)
        else if (result.length > 0 && result[0].label) {
             classificationData = result.map((item: any) => ({
                label: item.label,
                score: item.score
            }));
        }
    }

    if (classificationData) {
      return (
        <div className="p-4">
          <ClassificationResult
              task={effectiveTask}
              results={classificationData}
          />
        </div>
      );
    }

    // ========== FALLBACK JSON GENERICO ==========
    return (
      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
        <h3 className="text-white text-sm font-semibold mb-2">
          Risultato JSON ({effectiveTask})
        </h3>
        <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap break-words">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  }, [loading, result, text, effectiveTask, selectedModel]);

  return (
    <div className="w-full space-y-8">
      {/* ERRORI GENERALI */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Errore</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* SEZIONE INPUT */}
      <Card className="shadow-2xl border-t-4 border-blue-600">
        <CardHeader className="border-b">
          <CardTitle className="text-xl">Configurazione e Input</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* Selettore modello */}
          <div className="space-y-2">
            <label
              htmlFor="model-select"
              className="block text-sm font-semibold text-gray-700"
            >
              Modello di Analisi
            </label>
            <select
              id="model-select"
              value={selected}
              onChange={(e) => handleModelChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none cursor-pointer font-medium shadow-sm"
              disabled={loading || models.length === 0}
            >
              {models.length === 0 && !error ? (
                <option value="" disabled>
                  Caricamento Modelli...
                </option>
              ) : models.length === 0 && error ? (
                <option value="" disabled>
                  Errore di caricamento
                </option>
              ) : (
                models.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.name} –{" "}
                    {m.task
                      .charAt(0)
                      .toUpperCase()
                      .concat(m.task.slice(1).replace("-", " "))}
                  </option>
                ))
              )}
            </select>
            {selectedModel && (
              <div className="flex flex-wrap items-center gap-4 text-xs mt-1">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  Task:{" "}
                  {selectedModel.task
                    .charAt(0)
                    .toUpperCase()
                    .concat(selectedModel.task.slice(1).replace("-", " "))}
                </Badge>
                <p className="text-gray-500">
                  ID:{" "}
                  <code className="bg-gray-100 px-1 rounded">
                    {selectedModel.model_id}
                  </code>
                </p>
              </div>
            )}
            {!selectedModel && models.length > 0 && (
                <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-800">Seleziona un modello dalla lista per iniziare.</AlertDescription>
                </Alert>
            )}
          </div>

          {/* Layout principale: Input vs Risultato */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Colonna sinistra: Input */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="text-input"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Testo di Input
                </label>
                <Textarea
                  id="text-input"
                  rows={15}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={`Inserisci il testo per l'analisi di ${
                    selectedModel?.name || "IA"
                  }...`}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none text-gray-800 placeholder-gray-400 font-medium transition-all shadow-sm"
                  disabled={loading || !selectedModel}
                />
                <div className="text-xs text-gray-500 flex justify-between">
                  <span>Lunghezza: {text.length} caratteri</span>
                </div>
              </div>

              <Button
                onClick={handlePredict}
                disabled={loading || !text.trim() || !selectedModel}
                className="w-full h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all shadow-md disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analisi...
                  </>
                ) : (
                  `Esegui ${
                    effectiveTask.toUpperCase().replace("-", " ") || "Predizione"
                  }`
                )}
              </Button>
            </div>

            {/* Colonna destra: Risultato */}
            <div className="md:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  Risultato{" "}
                  {effectiveTask === "token-classification"
                    ? "Evidenziato"
                    : "Modello"}
                </h3>
                {result && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-xs transition-colors"
                    disabled={copied || loading}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {copied ? "Copiato!" : "Copia JSON"}
                  </Button>
                )}
              </div>

              <div className="min-h-[300px] border border-gray-300 rounded-lg shadow-inner bg-gray-50 p-0">
                {resultDisplay}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}