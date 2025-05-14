import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllSite = async () => {
  try {
    const response = await axios.get(`${API_URL}/site`);
    return response.data;
  } catch (error) {
    console.error("error fetching sites:", error);
    throw error;
  }
};

export const getSiteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/site/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching site with id ${id}:`, error);
    throw error;
  }
}

export const createSite = async (siteData) => {
    try{
        const response = await axios.post(`${API_URL}/site`, siteData);
      return response.data;
    }catch (error){
        console.error('Error creating site:', error);
        throw error; 
    }
};

export const updateSite = async (id, siteData) => {
    try {
      const response = await axios.put(`${API_URL}/site/${id}`, siteData);
      return response.data;
    } catch (error) {
      console.error(`Error updating site ${id}:`, error);
      throw error;
    }
  };

  export const deleteSite = async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/site/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting site ${id}:`, error);
      throw error;
    }
  };