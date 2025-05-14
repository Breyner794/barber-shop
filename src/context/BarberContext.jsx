// context/BarberContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllBarbers, createBarber, updateBarber, deleteBarber } from '../services/barberClient';
import { getAllSite} from '../services/sedesClient'; 
import { getAllServices } from '../services/serviceClient';

// Crear el contexto
const BarberContext = createContext();

// Hook personalizado para usar el contexto
export const useBarbers = () => useContext(BarberContext);

// Proveedor del contexto
export const BarberProvider = ({ children }) => {
  const [barber, setBarbers] = useState([]);
  const [sites, setSites] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar los barberos al montar el componente
  useEffect(() => {
    loadBarbers();
    loadSites();
    loadServices();
  }, []);

  // Función para cargar barberos desde la API
  const loadBarbers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllBarbers();

      const data = Array.isArray(response) ? response : response.data || [];
      // console.log("Datos originales de barberos:", data);
      
      // Transformar datos si es necesario para mantener compatibilidad con tu UI actual
      const formattedBarbers = data.map(barber => {
        // Conservamos todas las propiedades originales para hacer más robusto el filtrado
        const formattedBarber = {
          ...barber,
          id: barber.id_barber || barber._id, // Usar el id_barber como id para mantener compatibilidad
          nombre: barber.name_barber || barber.nombre || barber.name || '',
          apellido: barber.last_name_barber || barber.apellido || '',
          // Mantener diferentes variantes de 'site' para compatibilidad
          site: barber.site_barber || barber.site || barber.sede || '',
          site_barber: barber.site_barber || barber.site || barber.sede || '',
          imageUrl: barber.imageUrl || barber.photo || "/src/assets/image/usuario.png",
          _id: barber._id, // Guardar el _id de MongoDB para operaciones de CRUD
          experience: barber.experience || "1 año"
        };
        
        // console.log(`Barbero procesado: ${formattedBarber.nombre}, Site: ${formattedBarber.site}`);
        return formattedBarber;
      });
      
      // console.log("Barberos formateados:", formattedBarbers);
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
        name_site: site.name_site,
        address_site: site.address_site || "Dirección no disponible"
      }));
      setSites(formattedSites);
    } catch (err) {
      console.error('Error al cargar las sedes:', err);
      // Usar datos estáticos como fallback si hay un error
      // setSites(sedesData);
    }
  };

  // Cargar los servicios
  const loadServices = async () => {
    try {
      const response = await getAllServices();

      const data = Array.isArray(response) ? response : response.data || [];
      // Transformar datos para mantener compatibilidad con UI actual
      const formattedServices = data.map(service => ({
        _id: service._id,
        name: service.title || service.name,
        price: service.price_service || service.price || 0,
        description: service.description || ""
      }));
      setServices(formattedServices);
    } catch (err) {
      console.error('Error al cargar los servicios:', err);
      // Podrías tener servicios por defecto como fallback
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
    return site ? site.name_site : "Desconocida";
  };
  // Obtener todos los servicios
  const getAllService = () => {
    return services;
  };

  const getAllSites = () => {
    return sites;
  };

   // Obtener barberos por sede
  const getBarbersBySite = async (siteId) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Buscando barberos para la sede:", siteId);
      console.log("Barberos disponibles:", barber);
      
      // Comprobamos si estamos comparando en el formato correcto
      // A veces el siteId puede venir como string y site puede ser un ObjectId
      const filteredBarbers = barber.filter(b => {
        // Intentamos diferentes propiedades y formatos para mayor compatibilidad
        return (
          b.site === siteId || 
          b.site_barber === siteId || 
          b.site?.toString() === siteId?.toString() ||
          b.site_barber?.toString() === siteId?.toString()
        );
      });
      
      console.log("Barberos filtrados encontrados:", filteredBarbers.length);
      
      // Si no hay barberos, devolvemos al menos uno de ejemplo para depuración
      if (filteredBarbers.length === 0 && process.env.NODE_ENV === 'development') {
        console.log("ADVERTENCIA: No se encontraron barberos para esta sede, mostrando datos de ejemplo para depuración");
        return [{
          _id: "ejemplo-id",
          name: "Barbero de Ejemplo",
          photo: "/src/assets/image/usuario.png",
          experience: "5 años"
        }];
      }
      
      // Transformar a formato que espera el formulario de reserva
      return filteredBarbers.map(b => ({
        _id: b._id,
        name: `${b.nombre} ${b.apellido || ''}`.trim(),
        photo: b.imageUrl || "/src/assets/image/usuario.png",
        experience: b.experience || "1 año"
      }));
    } catch (err) {
      setError('Error al cargar barberos por sede');
      console.error(err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Valores que se compartirán a través del contexto
  const value = {
    barber,
    sites,
    loading,
    error,
    addBarber,
    editBarber,
    removeBarber,
    refreshBarbers: loadBarbers,
    getSiteById,
    getAllService,
    getAllSites,
    getBarbersBySite
  };

  return (
    <BarberContext.Provider value={value}>
      {children}
    </BarberContext.Provider>
  );
};

export default BarberProvider;