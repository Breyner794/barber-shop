import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL;

export const getAllBarbers = async () => {
    try{

        const response = await axios.get(`${API_URL}/barber`);
        return response.data;

    }catch (error) {
        console.error("error fetching barber:", error);
        throw error;
      }
};

export const createBarber = async (barberData) => {
    try{

        const response = await axios.post(`${API_URL}/barber`, barberData);
        return response.data;

    }catch (error){
        console.error('Error creating barber:', error);
        throw error; 
    }
};

export const updateBarber = async (id, barberData) => {
    try{
        const response = await axios.put(`${API_URL}/barber/${id}`, barberData);
        return response.data;
    }catch (error) {
      console.error(`Error updating barber ${id}:`, error);
      throw error;
    }
};

export const deleteBarber = async (id) =>{
    try{
        const response = await axios.delete(`${API_URL}/barber/${id}`);
        return response.data;
    }catch (error) {
        console.error(`Error deleting barber ${id}:`, error);
        throw error;
      }
};