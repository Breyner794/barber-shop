import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;



// funcion para obtener las reservas que estan en la base de datos 
export const getAllReservas = async () => {

    return await axios.get(`${API_URL}/reservation`);
    }

// funcion para eliminar una reserva 
export const eliminarReservas = async (id) => {
    return await axios.delete(`${API_URL}/reservation/${id}`);
    }

// funcion para actualizar
export const updateReservas = async (id, reserva) => {
    return await axios.put(`${API_URL}/reservation/${id}`, reserva);
    }