import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllServices } from '../services/serviceClient';

// Crear el contexto
const ServicesContext = createContext();

// Hook personalizado para usar el contexto
export const useServices = () => useContext(ServicesContext);

// Proveedor del contexto
export const ServicesProvider = ({ children }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);

  // Función para obtener los servicios
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAllServices();
      const serviceData = response.data ? response.data : response;
      // console.log("Servicios obtenidos:", serviceData);
      setServices(serviceData);
      setLastFetched(new Date());
      setError(null);
    } catch (error) {
      console.error("Error al obtener servicios:", error);
      setError("No se pudieron cargar los servicios");
    } finally {
      setLoading(false);
    }
  };

  // Cargar servicios al montar el componente
  useEffect(() => {
    fetchServices();
    
    // Opcional: recargar datos cada cierto tiempo (por ejemplo, cada 24 horas)
    const refreshInterval = setInterval(() => {
      fetchServices();
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  // Valor del contexto
  const value = {
    services,
    loading,
    error,
    lastFetched,
    refreshServices: fetchServices // Para actualizar manualmente
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
};