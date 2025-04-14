import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllServices, createServices, updateServices, deleteService } from '../services/serviceClient';

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

  // Cargar servicios al montar el componente
  useEffect(() => {
    fetchServices();
    
    // Opcional: recargar datos cada cierto tiempo (por ejemplo, cada 24 horas)
    const refreshInterval = setInterval(() => {
      fetchServices();
    }, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, []);

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

  const addService = async (newService) => {
    try{
      setLoading(true);
      await createServices (newService);
      await fetchServices();
      return (true);
    }catch (error){
      console.error("error al crear el servicio:", error);
      setError("Error al crear el servicio.");
      throw false;
    }finally{
      setLoading(false);
    }
  };

  const editService = async (id, updateService)=>{
    try{
      setLoading(true);
      await updateServices (id, updateService);
      await fetchServices();
      return (true);
    }catch(error){
      console.error("Error al Actualizar el servicio:", error),
      setError ("Error al Actualizar el servicio")
    }finally{
      setLoading(false);
    }
  };

  const removeService = async (id) => {
    try{
      setLoading(true);
      await deleteService(id);
      setServices((prev)=> prev.filter((service)=> service._id !== id));
      return true;
    }catch{
      console.error("Error al eliminar el servicio:", error);
      setError("Error al eliminar el servicio");
      throw error;
    }finally{
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    services,
    loading,
    error,
    lastFetched,
    refreshServices: fetchServices, // Para actualizar manualmente 
    addService,
    editService,
    removeService
  };

  return (
    <ServicesContext.Provider value={value}>
      {children}
    </ServicesContext.Provider>
  );
};