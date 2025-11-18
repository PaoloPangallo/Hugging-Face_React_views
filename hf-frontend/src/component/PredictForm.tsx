import { useEffect, useState } from "react";
import { fetchModels, predict, type HFModelInfo } from "../assets/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";

export default function PredictForm() {
  const [models, setModels] = useState<HFModelInfo[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchModels().then((data) => {
      setModels(data);
      if (data.length > 0) setSelected(data[0].key);
    });
  }, []);

  const selectedModel = models.find(m => m.key === selected);

  async function handlePredict() {
    if (!text.trim()) {
      setError("Per favore inserisci del testo da analizzare");
      return;
    }

    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const out = await predict(selected, text);
      setResult(out);
    } catch (err: any) {
      setError("Errore durante l'elaborazione. Verifica il modello e riprova.");
      console.error(err);
    }

    setLoading(false);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full space-y-8">
      {/* Form Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="text-2xl">Analizza con l'IA</CardTitle>
          <CardDescription>
            Seleziona un modello e inserisci il testo da processare
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-8 space-y-6">
          {/* Model Selector */}
          <div className="space-y-3">
            <label htmlFor="model-select" className="block text-sm font-semibold text-gray-900">
              Modello
            </label>
            <select
              id="model-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer font-medium"
            >
              {models.map((m) => (
                <option key={m.key} value={m.key}>
                  {m.name} – {m.task}
                </option>
              ))}
            </select>
            {selectedModel && (
              <p className="text-xs text-gray-500 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                ID: <code className="bg-gray-100 px-2 py-1 rounded">{selectedModel.model_id}</code>
              </p>
            )}
          </div>

          {/* Textarea */}
          <div className="space-y-3">
            <label htmlFor="text-input" className="block text-sm font-semibold text-gray-900">
              Testo da Analizzare
            </label>
            <textarea
              id="text-input"
              rows={7}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Inserisci il testo che desideri analizzare con il modello IA..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 font-medium bg-white transition-all"
            />
            <div className="text-xs text-gray-500">
              {text.length} caratteri
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700 ml-2">{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            onClick={handlePredict}
            disabled={loading || !text.trim()}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-base rounded-lg transition-all transform hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Elaborazione in corso...
              </>
            ) : (
              "Esegui Predizione"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Result Section */}
      {result && (
        <Card className="border-0 shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                Risultato
              </CardTitle>
              <CardDescription>Analisi completata</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="hover:bg-green-100"
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copiato!" : "Copia"}
            </Button>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="bg-gray-900 rounded-lg p-6 overflow-x-auto">
              <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap break-words">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>💡 Suggerimento:</strong> Puoi copiare il risultato e usarlo in altre applicazioni.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}