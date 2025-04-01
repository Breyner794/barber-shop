import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllReservation = async () => {
    try {
        const response = await axios.get(`${API_URL}/reservation`);
        return response.data;
      } catch (error) {
        console.error("error fetching reservation:", error);
        throw error;
      }
};

export const createResevation = async (reservationData) => {
    try{
        const response = await axios.post(`${API_URL}/reservation`, reservationData);
        return response.data;
    }catch (error){
        console.error('Error creating reservation:', error)
        throw error;
    }
};

export const updateResevation = async (id, reservationData) => {
    try {
      const response = await axios.put(`${API_URL}/reservation/${id}`, reservationData);
      return response.data;
    } catch (error) {
      console.error(`Error updating reservation ${id}:`, error);
      throw error;
    }
  };

  export const deleteReservation = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/reservation/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting reservation ${id}:`, error);
      throw error;
    }
  };