import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllUser, createUser, updateUser, deleteUser, getMe as fetchUserProfile } from "../services/userClient";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // For the logged-in user profile
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fecthUsuarios();

    getUserProfile().catch(err => {
      console.log("Initial profile load failed:", err);
      // Don't set error here to avoid disrupting the UI on initial load
    });
  }, []);

  const fecthUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAllUser();
      const userData = Array.isArray(response)
        ? response
        : response?.data || [];
      setUsers(userData);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setError("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (newUser) => {
    try {
      setLoading(true);
      await createUser(newUser);
      await fecthUsuarios();
      return true;
    } catch (error) {
      console.log("error creating user", error);
      setError("Error al crear el usuario");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const editUser = async (id, updateuser) => {
    try {
      setLoading(true);
      await updateUser(id, updateuser);
      await fecthUsuarios();
      return true;
    } catch (error) {
      console.error("Error updating user:", error);
      setError("Error al actualizar el usuario");
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id) => {
    try {
      setLoading(true);
      await deleteUser(id);
      setUsers((prev) => prev.filter((user) => user._id !== id));
      return true;
    } catch (error) {
      console.error("Error removeting user", error);
      setError("Error al eliminar el usuario");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getUserProfile = async () => {
    setLoading(true);
    setError(null);

    try{
      const response = await fetchUserProfile();
      if (response && response.data && response.data.user) {
        setCurrentUser(response.data.user);
        setLoading(false);
        return response.data.user;
      } else if (response && response.data) {
        setCurrentUser(response.data);
        setLoading(false);
        return response.data;
      } else {
        throw new Error("Formato de respuesta inesperado");
      }
    }catch (error){
      console.error("Error al obtener el perfil:");
      setError(error);
      setLoading(false);
      throw error;
    }
  }
  
  const value = {
    users,
    currentUser,
    loading,
    error,
    fecthUsuarios,
    addUser,
    editUser,
    removeUser,
    getMe: getUserProfile
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
