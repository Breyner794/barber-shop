import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL ;

// Obtener todos los servicios
export const getAllServices = async () => {
  try {
    const response = await axios.get(`${API_URL}/services`);
    return response.data;
  } catch (error) {
    console.error("error fetching services:", error);
    throw error;
  }
};

// Obtener un servicio por ID
export const getByIdServices = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/services/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching service ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo servicio
export const createServices = async (serviceData) => {
    try {
      const response = await axios.post(`${API_URL}/services`, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  };

  // Actualizar un servicio existente
export const updateServices = async (id, serviceData) => {
    try {
      const response = await axios.put(`${API_URL}/services/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating service ${id}:`, error);
      throw error;
    }
  };

  // Eliminar un servicio
export const deleteService = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/services/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting service ${id}:`, error);
      throw error;
    }
  };