import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getMe = async () => {
    try{
        const response = await axios.get(`${API_URL}/auth/me`, 
            {withCredentials: true});
        return response.data;
    }catch(error){
        console.error("Error fetching me:", error);
        throw error;
    }
};

export const Login = async (email, password) => {
    try{
        const response = await axios.post(`${API_URL}/auth/login`, 
            {email, password}, 
            {withCredentials: true});

        return response.data;
    }catch (error){
        console.error("Error logging in:", error.response?.data || error.message); // Log detailed error
        throw error; // Re-throw the error for the caller (AuthProvider) to handle
    }
}