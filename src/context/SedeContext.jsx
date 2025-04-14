import React, { createContext, useState, useContext, useEffect } from "react";
import {
  getAllSite,
  createSite,
  updateSite,
  deleteSite,
} from "../services/sedesClient";

// Crear el contexto
const SedeContext = createContext();

// Proveedor del contexto
export const SedeProvider = ({ children }) => {
  const [sites, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar las sedes cuando se monta el componente
  useEffect(() => {
    fetchSedes();
  }, []);

  // Función para obtener todas las sedes
  const fetchSedes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllSite();
      const sedeData = Array.isArray(response)
        ? response
        : response?.data || [];

      setSedes(sedeData);
    } catch (error) {
      console.error("Error cargando sedes:", error);
      setError("Error al cargar las sedes");
    } finally {
      setLoading(false);
    }
  };

  // Función para crear una nueva sede
  const addSede = async (newSede) => {
    try {
      setLoading(true);
      await createSite(newSede);
      await fetchSedes();
      return { success: true };
    } catch (error) {
      console.error("Error al crear sede:", error);
      setError("Error al crear la sede");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar una sede existente
  const editSede = async (id, updatedSede) => {
    try {
      setLoading(true);
      await updateSite(id, updatedSede);
      await fetchSedes();
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar sede:", error);
      setError("Error al actualizar la sede");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una sede
  const removeSede = async (id) => {
    try {
      setLoading(true);
      await deleteSite(id);
      // Actualizar el estado directamente en lugar de hacer fetchSedes()
      setSedes((prev) => prev.filter((sede) => sede._id !== id));
      return true;
    } catch (error) {
      console.error("Error al eliminar sede:", error);
      setError("Error al eliminar la sede");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    sites,
    loading,
    error,
    fetchSedes,
    addSede,
    editSede,
    removeSede,
  };

  return <SedeContext.Provider value={value}>{children}</SedeContext.Provider>;
};

export const useSede = () => useContext(SedeContext);

export default SedeProvider;
