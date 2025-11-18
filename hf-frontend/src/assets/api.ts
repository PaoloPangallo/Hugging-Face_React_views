import axios from "axios";

console.log("VITE_API_BASE_URL =", import.meta.env.VITE_API_BASE_URL);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// =========================
// Tipi
// =========================

export interface HFModelInfo {
  key: string;       // <- CHIAVE USATA DAL BACKEND
  name: string;
  task: string;
  model_id: string;
}

// =========================
// API: Fetch Models
// =========================

export async function fetchModels(): Promise<HFModelInfo[]> {
  try {
    const res = await api.get("/api/models");
    console.log("fetchModels →", res.data);
    return res.data;
  } catch (err) {
    console.error("fetchModels ERROR:", err);
    return [];
  }
}

// =========================
// API: Predict
// =========================

export async function predict(modelKey: string, text: string) {
  try {
    const res = await api.post(`/api/predict/${modelKey}`, { text });
    console.log("predict →", res.data);
    return res.data;
  } catch (err) {
    console.error("predict ERROR:", err);
    throw err;
  }
}
