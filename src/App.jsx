// import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Hero from "./components/hero/Hero";
import Services from "./components/services/Services";
import Gallery from "./components/gallery/Gallery";
import Contact from "./components/contact/Contact";
import Reserva from "./components/reserva/Reserva";
import Login from "./components/auth/Login";
import Layout from "./components/layout/Layout";
import Dashboard from "./components/dashboard/Dashboard"
// import Reservas from "./components/dashboard/reservas"
import GestionReservas from "./components/dashboard/GestionReservas";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <>
                <Hero />
                <Services />
                <Gallery />
                <Contact />
              </>
            }
          />
          <Route path="/reserva" element={<Reserva />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />}>
          {/* <Route path="reservas" element={<Reservas />} /> */}
          <Route path="gestionreservas" element={<GestionReservas/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
