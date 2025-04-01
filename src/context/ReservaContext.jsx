import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAllReservation, 
  createResevation, 
  updateResevation, 
  deleteReservation 
} from '../services/reserva.Client';

// Create the context
const ReservationContext = createContext();

// Custom hook to use the reservation context
export const useReservations = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservations must be used within a ReservationProvider');
  }
  return context;
};

// Provider component
export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reservations on component mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Get all reservations
  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await getAllReservation();
      setReservations(data.data || []);
      setError(null);
    } catch (err) {
      setError('Error al cargar las reservas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new reservation
  const addReservation = async (reservationData) => {
    try {
      const newReservation = await createResevation(reservationData);
      setReservations([...reservations, newReservation]);
      return newReservation;
    } catch (err) {
      setError('Error al crear la reserva');
      console.error(err);
      throw err;
    }
  };

  // Update an existing reservation
  const updateReservation = async (id, reservationData) => {
    try {
      const updatedReservation = await updateResevation(id, reservationData);
      setReservations(reservations.map(reservation => 
        reservation._id === id ? updatedReservation : reservation
      ));
      return updatedReservation;
    } catch (err) {
      setError(`Error al actualizar la reserva con ID ${id}`);
      console.error(err);
      throw err;
    }
  };

  // Delete a reservation
  const removeReservation = async (id) => {
    try {
      await deleteReservation(id);
      setReservations(reservations.filter(reservation => reservation._id !== id));
      return true;
    } catch (err) {
      setError(`Error al eliminar la reserva con ID ${id}`);
      console.error(err);
      throw err;
    }
  };

  // Get reservation by ID
  const getReservationById = (id) => {
    return reservations.find(reservation => reservation._id === id) || null;
  };

  // Value object to be provided to consumers
  const value = {
    reservations,
    loading,
    error,
    fetchReservations,
    addReservation,
    updateReservation,
    removeReservation,
    getReservationById
  };

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
};

export default ReservationContext;