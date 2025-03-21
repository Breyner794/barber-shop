// context/BarberContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllBarbers, createBarber, updateBarber, deleteBarber } from '../services/barberClient';
import { getAllSite } from '../services/sedesClient';  // Asumiendo que tendrás este servicio

// Crear el contexto
const BarberContext = createContext();

// Hook personalizado para usar el contexto
export const useBarbers = () => useContext(BarberContext);

// Proveedor del contexto
export const BarberProvider = ({ children }) => {
  const [barbers, setBarbers] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar los barberos al montar el componente
  useEffect(() => {
    loadBarbers();
    loadSites();
  }, []);

  // Función para cargar barberos desde la API
  const loadBarbers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBarbers();

      const data = Array.isArray(response) ? response : response.data || [];
      
      // Transformar datos si es necesario para mantener compatibilidad con tu UI actual
      const formattedBarbers = data.map(barber => ({
        id: barber.id_barber, // Usar el id_barber como id para mantener compatibilidad
        nombre: barber.name_barber,
        apellido: barber.last_name_barber,
        sede: barber.site_barber,
        imageUrl: barber.imageUrl || "/src/assets/image/usuario.png",
        _id: barber._id // Guardar el _id de MongoDB para operaciones de CRUD
      }));
      
      setBarbers(formattedBarbers);
    } catch (err) {
      setError('Error al cargar los barberos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar las sedes
  const loadSites = async () => {
    try {
      const response = await getAllSite();

      const data = Array.isArray(response) ? response : response.data || [];
      // Transformar datos para mantener compatibilidad con UI actual
      const formattedSites = data.map(site => ({
        id: site._id,
        nombre: site.name_site
      }));
      setSites(formattedSites);
    } catch (err) {
      console.error('Error al cargar las sedes:', err);
      // Usar datos estáticos como fallback si hay un error
      // setSites(sedesData);
    }
  };

  // Agregar un nuevo barbero
  const addBarber = async (barberData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transformar datos para API
      const apiBarberData = {
        id_barber: barberData.id,
        name_barber: barberData.nombre,
        last_name_barber: barberData.apellido,
        site_barber: barberData.sede,
        imageUrl: barberData.imageUrl
      };
      
      await createBarber(apiBarberData);
      
      await loadBarbers();
      
      return true;
    } catch (err) {
      setError('Error al crear el barbero');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un barbero existente
  const editBarber = async (barberData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Transformar datos para API
      const apiBarberData = {
        id_barber: barberData.id,
        name_barber: barberData.nombre,
        last_name_barber: barberData.apellido,
        site_barber: barberData.sede,
        imageUrl: barberData.imageUrl
      };
      
      await updateBarber(barberData._id, apiBarberData);
    
    // Recargar todos los barberos inmediatamente
        await loadBarbers();
      
      return true;
    } catch (err) {
      setError('Error al actualizar el barbero');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un barbero
  const removeBarber = async (barberId, mongoId) => {
    try {
      setLoading(true);
      setError(null);
      
      await deleteBarber(mongoId);
      setBarbers(prev => prev.filter(barber => barber.id !== barberId));
      
      return true;
    } catch (err) {
      setError('Error al eliminar el barbero');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Obtener una sede por ID
  const getSiteById = (siteId) => {
    const site = sites.find(site => site.id === siteId);
    return site ? site.nombre : "Desconocida";
  };

  // Valores que se compartirán a través del contexto
  const value = {
    barbers,
    sites,
    loading,
    error,
    addBarber,
    editBarber,
    removeBarber,
    refreshBarbers: loadBarbers,
    getSiteById
  };

  return (
    <BarberContext.Provider value={value}>
      {children}
    </BarberContext.Provider>
  );
};

export default BarberProvider;