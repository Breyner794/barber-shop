import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  getAllReservation, 
  createResevation, 
  updateResevation, 
  deleteReservation 
} from '../services/reservaClient'; // Adjust the import path as needed

// Create the context
const ReservationContext = createContext();

// Custom hook to use the reservation context
export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};

// Provider component
export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all reservations
  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await getAllReservation();
      
      // Asegurar que siempre sea un array
      const safeReservations = Array.isArray(data) ? data : 
        (data && typeof data === 'object' ? [data] : []);
        
      console.log(safeReservations)
      setReservations(safeReservations);
      setError(null);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError(err);
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new reservation
  const createReservation = async (reservationData) => {
    try {
      const newReservation = await createResevation(reservationData);
      setReservations(prev => [...prev, newReservation]);
      return newReservation;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Update an existing reservation
  const updateReservation = async (id, reservationData) => {
    try {
      const updatedReservation = await updateResevation(id, reservationData);
      setReservations(prev => 
        prev.map(reservation => 
          reservation.id === id ? updatedReservation : reservation
        )
      );
      return updatedReservation;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Delete a reservation
  const removeReservation = async (id) => {
    try {
      await deleteReservation(id);
      setReservations(prev => prev.filter(reservation => reservation.id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Fetch reservations on initial mount
  useEffect(() => {
    fetchReservations();
  }, []);

  // Context value
  const contextValue = {
    reservations,
    loading,
    error,
    fetchReservations,
    createReservation,
    updateReservation,
    removeReservation
  };

  return (
    <ReservationContext.Provider value={contextValue}>
      {children}
    </ReservationContext.Provider>
  );
};