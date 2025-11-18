import Navbar from "./Navbar";
import ModelGrid from "./ModelGrid";
import Footer from "./Footer";
import Hero from "./Hero";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <Hero />
      <div className="flex-grow">
        <ModelGrid />
      </div>
      <Footer />
    </div>
  );
}