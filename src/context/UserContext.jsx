import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllUser, createUser, updateUser, deleteUser } from "../services/userClient";

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fecthUsuarios();
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

  const value = {
    users,
    loading,
    error,
    fecthUsuarios,
    addUser,
    editUser,
    removeUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export default UserProvider;
