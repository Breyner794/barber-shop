import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user`);
    return response.data;
  } catch (error) {
    console.error("error fetching user:", error);
    throw error;
  }
};

export const getByIdUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/user/:id`);
    return response.data;
  } catch (error) {
    console.error("error fetching user:", error);
    throw error;
  }
};

export const createUser = async (serviceUser) => {
  try {
    const response = await axios.post(`${API_URL}/user`, serviceUser);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id, serviceUser) => {
  try {
    const response = await axios.put(`${API_URL}/user/${id}`, serviceUser);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    throw error;
  }
};

export const getMe = async () =>{
  try{
    const response = await axios.get(`${API_URL}/user/me`);
    return response.data; 
  }catch (error){
    console.log ("No se pudo encontrar tu perfil")
    throw error;
  }
    
}