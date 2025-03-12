import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, User } from "lucide-react";
import  { barberos } from "../../data/barberosData";
import { sedes } from "../../data/sedesData"; 

const BarberoForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    sede: "",
    imageUrl: "/src/assets/image/usuario.png",
  });

  // Estado para manejar errores de validación
  const [errors, setErrors] = useState({});
  
  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (isEditMode) {
      const barbero = barberos.find((b) => b.id === parseInt(id));
      if (barbero) {
        setFormData({
          nombre: barbero.nombre,
          apellido: barbero.apellido,
          sede: barbero.sede.toString(),
          imageUrl: barbero.imageUrl,
        });
      } else {
        // Barbero no encontrado, redirigir
        navigate("/dashboard/admiuser", { replace: true });
      }
    }
  }, [id, isEditMode, navigate]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio";
    }
    
    if (!formData.sede) {
      newErrors.sede = "Seleccione una sede";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Aquí iría la lógica para guardar en el backend
    console.log("Datos a guardar:", {
      ...formData,
      sede: parseInt(formData.sede),
      id: isEditMode ? parseInt(id) : Date.now(), // Generar ID temporal para nuevos
    });
    
    // Simular guardado exitoso
    alert(isEditMode ? "Barbero actualizado correctamente" : "Barbero creado correctamente");
    navigate("/dashboard/adminuser");
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate("/dashboard/adminuser")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={20} className="mr-1" />
          <span>Volver a barberos</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Editar barbero" : "Nuevo barbero"}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            {/* Vista previa de imagen */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-200 mb-4">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <User size={60} className="text-gray-500" />
                  </div>
                )}
              </div>
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  // Aquí iría la lógica para subir una imagen
                  alert("Funcionalidad de subir imagen aún no implementada");
                }}
              >
                Cambiar imagen
              </button>
            </div>
            
            {/* Campos del formulario */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="nombre">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg ${
                      errors.nombre ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ingrese el nombre"
                  />
                  {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="apellido">
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg ${
                      errors.apellido ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Ingrese el apellido"
                  />
                  {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>}
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2" htmlFor="sede">
                    Sede
                  </label>
                  <select
                    id="sede"
                    name="sede"
                    value={formData.sede}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-lg ${
                      errors.sede ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Seleccione una sede</option>
                    {sedes.map((sede) => (
                      <option key={sede.id} value={sede.id}>
                        {sede.nombre}
                      </option>
                    ))}
                  </select>
                  {errors.sede && <p className="text-red-500 text-sm mt-1">{errors.sede}</p>}
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/adminuser")}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Save size={18} className="mr-2" />
                  {isEditMode ? "Actualizar barbero" : "Guardar barbero"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarberoForm;