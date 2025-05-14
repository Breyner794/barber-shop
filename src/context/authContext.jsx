import React, { createContext, useContext, useState, useEffect } from "react";
import { getMe, Login } from "../services/authClient"; // Asumiendo ruta correcta
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Inicia cargando
  const [error, setError] = useState(null);

  useEffect(() => {
    const verificarUsuario = async () => {
      setLoading(true); // Asegura que esté cargando al inicio de la verificación
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        setUser(null); // Asegura que no haya usuario si no hay token
        return;
      }

      try {
        // Configura el header ANTES de la llamada
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const userData = await getMe(); // getMe ahora devuelve solo el usuario
        setUser(userData);
        setError(null); // Limpia errores previos si la verificación es exitosa
      } catch (err) { // 'err' está bien aquí en el catch
        console.error("Error al verificar usuario:", err);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common['Authorization']; // Limpia header si el token es inválido
        setUser(null); // Asegura que no haya usuario si falla la verificación
        // Opcional: podrías querer poner un mensaje de error específico aquí
        // setError("Tu sesión ha expirado. Por favor inicia sesión de nuevo.");
      } finally {
        setLoading(false);
      }
    };
    verificarUsuario();
    // No añadas dependencias aquí si solo quieres que se ejecute al montar
  }, []); // El array vacío asegura que se ejecute solo una vez al montar

  const login = async (email, password) => {
    setError(null); // Limpia error antes de intentar
    setLoading(true); // Indica que está procesando el login
    try {
       // ¡CORREGIDO! Pasa email y password
      const response = await Login(email, password);

      // Asumiendo que Login devuelve { status: 'success', token: '...', data: { user: {...} } }
      if (response && response.token && response.data && response.data.user) {
        localStorage.setItem('token', response.token);
        setUser(response.data.user);
        // ¡CORREGIDO! Usa 'response' y el token correcto
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
        setLoading(false);
        return true; // Indica éxito
      } else {
         // Si la respuesta no tiene la estructura esperada
         throw new Error("Respuesta inesperada del servidor durante el login.");
      }

    } catch (error) { // 'error' es la variable del catch
      console.error("Login failed in AuthProvider:", error);
      const message = error.response?.data?.message || // Mensaje del backend
                      error.message || // Mensaje genérico del error
                      'Error al iniciar sesión. Por favor intenta de nuevo.';
      setError(message);
      localStorage.removeItem('token'); // Asegura limpiar si falla
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
      return false; // Indica fallo
    }
  };

  // Función de cerrar sesión (Estaba bien)
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setError(null); // Limpia errores al cerrar sesión
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user && !loading // Mejor considerar loading también
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};