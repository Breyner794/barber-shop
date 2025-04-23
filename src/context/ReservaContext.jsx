import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllReservation,
  createResevation,
  updateReservation,
  updateReservationState,
  deleteReservation,
} from "../services/reserva.Client";

// Create the context
const ReservationContext = createContext();

// Custom hook to use the reservation context
export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error(
      "useReservations must be used within a ReservationProvider"
    );
  }
  return context;
};

// Provider component
export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true); // Estado para controlar si el refresco automático está activo
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchReservations();
    // Configurar el intervalo de refresco automático (2 minutos = 120000 ms)
    const refreshInterval = setInterval(() => {
      if (autoRefresh) {
        console.log("Refrescando datos automáticamente...");
        fetchReservations();
      }
    }, 120000);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(refreshInterval);
  }, [autoRefresh]);

  // Get all reservations
  const fetchReservations = async () => {
    setRefreshing(true);
    try {
      const response = await getAllReservation();
      const reservationData = response.data ? response.data : response;
      setReservations(reservationData);
      setError(null);
    } catch (err) {
      setError("Error al cargar las reservas");
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setRefreshing(false), 1500);
    }
  };

  // Toggle auto refresh
  const toggleAutoRefresh = () => {
    setAutoRefresh((prev) => !prev);
  };

  // Create a new reservation
  const addReservation = async (reservationData) => {
    try {
      setLoading(true);
      await createResevation(reservationData);
      await fetchReservations();
      return true;
    } catch (err) {
      setError("Error al crear la reserva");
      console.error(err);
      throw err;
    }
  };

  // Update an existing reservation
  const updateReservations = async (id, reservationData) => {
    try {
      setLoading(true);
      await updateReservation(id, reservationData);
      await fetchReservations();
      return true;
    } catch (err) {
      setError(`Error al actualizar la reserva con ID ${id}`);
      console.error(err);
      throw err;
    }
  };

  const updateReservationsState = async (id, newState) => {
    // Recibe el nuevo estado
    try {
      setLoading(true);
      await updateReservationState(id, newState); // Pasa el nuevo estado al cliente
      await fetchReservations(); // Recarga las reservas para actualizar la UI
      return true;
    } catch (error) {
      setError(`Error al actualizar el estado de la reserva con ID ${id}`);
      console.error(error);
      setLoading(false);
      throw error;
    }
  };

  // Delete a reservation
  const removeReservation = async (id) => {
    try {
      await deleteReservation(id);
      setReservations(
        reservations.filter((reservation) => reservation._id !== id)
      );
      return true;
    } catch (err) {
      setError(`Error al eliminar la reserva con ID ${id}`);
      console.error(err);
      throw err;
    }
  };

  // Get reservation by ID
  const getReservationById = (id) => {
    return reservations.find((reservation) => reservation._id === id) || null;
  };

  // Value object to be provided to consumers
  const value = {
    reservations,
    loading,
    error,
    refreshing,
    autoRefresh,
    fetchReservations,
    addReservation,
    updateReservations,
    updateReservationsState,
    removeReservation,
    getReservationById,
    toggleAutoRefresh,
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;
