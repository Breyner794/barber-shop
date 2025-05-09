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
import Dashboard from "./components/dashboard/Dashboard";
// import Reservas from "./components/dashboard/reservas"
import GestionReservas from "./components/dashboard/GestionReservas";
import ServicesAdminPanel from "./components/dashboard/Servicios_Admin";
import BarberosAdminPanel from "./components/dashboard/BarberosAdminPanel";
import SedesAdminPanel from "./components/dashboard/SedesAdminPanel";
import UsuariosAdminPanel from "./components/dashboard/UsuariosAdminPanel";
import { ServicesProvider } from "./context/ServicesContext";
import BarbersProvider from "./context/BarberContext";
import { SedeProvider } from "./context/SedeContext";
import { ReservationProvider } from "./context/ReservaContext";
import { UserProvider } from "./context/UserContext";

function App() {
  return (
    <ReservationProvider>
      <ServicesProvider>
        <SedeProvider>
          <BarbersProvider>
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
                <Route
                  path="/dashboard"
                  element={
                    <UserProvider>
                      <Dashboard />
                    </UserProvider>
                  }
                >
                  {/* <Route path="reservas" element={<Reservas />} /> */}
                  <Route path="gestionreservas" element={<GestionReservas />} />
                  <Route
                    path="servicesadminpanel"
                    element={<ServicesAdminPanel />}
                  />
                  <Route
                    path="barberosadminpanel"
                    element={<BarberosAdminPanel />}
                  />
                  <Route path="sedesadminpanel" element={<SedesAdminPanel />} />
                  <Route
                    path="usuariosadminpanel"
                    element={<UsuariosAdminPanel />}
                  />
                </Route>
              </Routes>
            </BrowserRouter>
          </BarbersProvider>
        </SedeProvider>
      </ServicesProvider>
    </ReservationProvider>
  );
}

export default App;
