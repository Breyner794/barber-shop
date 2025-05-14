// import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { AuthProvider, useAuth } from "./context/authContext";
import NuevoFormularioReserva from "./components/reserva/nuevaReserva";
import BarberDebug from "./components/debug/BarberDebug";
// import ReservationFilters from "./components/dashboard/Filtro_reserva/MultiFilterReservation";
import TurnosPage from "./components/dashboard/Filtro_reserva/MultiFilterBar";
import GestionDisponibilidadBarberos from "./components/dashboard/Gestion_tiempo/GestionDisponibilidadBarberos";

const ProteccionRutas = ({children}) =>{
  const {isAuthenticated, loading} = useAuth();

  if (loading){
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;

}

function App() {
  return (
    <AuthProvider>
    <ReservationProvider>
      <ServicesProvider>
        <SedeProvider>
          <BarbersProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/gestiontiempo" element={<GestionDisponibilidadBarberos/>}/>
                <Route path="/filtros" element={<TurnosPage />} />
                <Route path="/debug" element={<BarberDebug />} />
                <Route path="/reservanueva" element={
                    // <ProteccionRutas>
                    <NuevoFormularioReserva/>
                    // </ProteccionRutas>
                  } />
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
                    <ProteccionRutas>
                    <UserProvider>
                      <Dashboard />
                    </UserProvider>
                    </ProteccionRutas>
                  }
                >
                  <Route 
                  path="gestionreservas" 
                  element={
                    <ProteccionRutas>
                    <GestionReservas />
                    </ProteccionRutas>
                  }/>
                  <Route
                    path="servicesadminpanel"
                    element={
                      <ProteccionRutas> 
                    <ServicesAdminPanel />
                    </ProteccionRutas>
                    }
                  />
                  <Route
                    path="barberosadminpanel"
                    element={
                    <ProteccionRutas>
                    <BarberosAdminPanel />
                    </ProteccionRutas>
                  }
                  />
                  <Route 
                  path="sedesadminpanel" 
                  element={
                    <ProteccionRutas>
                  <SedesAdminPanel />
                  </ProteccionRutas>
                  }/>
                  <Route
                    path="usuariosadminpanel"
                    element={
                    <ProteccionRutas>
                    <UsuariosAdminPanel/>
                    </ProteccionRutas>
                  }
                  />
                </Route>
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </BrowserRouter>
          </BarbersProvider>
        </SedeProvider>
      </ServicesProvider>
    </ReservationProvider>
    </AuthProvider>
  );
}

export default App;
