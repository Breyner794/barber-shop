// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import "./App.css";
import Hero from "./components/hero/Hero";
import Services from "./components/services/Services";
import Gallery from "./components/gallery/Gallery";
import Contact from "./components/contact/Contact";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Services />
                <Gallery/>
                <Contact/>
                {/*los demas componentes*/}
              </>
            } />
            {/* <Route path="/reservas" element={<Reservas />} /> */}
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
