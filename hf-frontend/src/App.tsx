import { BrowserRouter, Routes, Route } from "react-router-dom";
import PredictPage from "./pages/PredictPage";
import Home from "./component/Home";
import "./index.css";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/predict" element={<PredictPage />} />
      </Routes>
    </BrowserRouter>
  );
}