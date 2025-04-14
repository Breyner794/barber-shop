import React, { useState } from "react";
import { Trash2, Edit, Plus, X, Save, PlusCircle } from "lucide-react";
import { useServices } from "../../context/ServicesContext.jsx";
import Swal from "sweetalert2";

const ServicesAdminPanel = () => {
  const { services, loading, addService, removeService, editService } = useServices();
  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditService = (service) => {
    setEditingService({ ...service });
    setIsModalOpen(true);
  };

  const handleDeleteService = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, elimínalo!",
      });
      if (result.isConfirmed) {
        await removeService(id);

        Swal.fire({
          title: "¡Eliminado!",
          text: "Tu servicio ha sido eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 2500,
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      Swal.fire({
        title: "Error",
        text: `¡No se pudo eliminar el servicio! ${error}`,
        icon: "error",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditingService((prev) => ({
      ...prev,
      [field]:
        field === "price" || field === "duration" ? Number(value) : value,
    }));
  };

  const handleIncludesChange = (index, value) => {
    const newIncludes = [...editingService.includes];
    newIncludes[index] = value;
    setEditingService((prev) => ({
      ...prev,
      includes: newIncludes,
    }));
  };

  const addIncludeItem = () => {
    setEditingService((prev) => ({
      ...prev,
      includes: [...prev.includes, ""],
    }));
  };

  const removeIncludeItem = (index) => {
    const newIncludes = editingService.includes.filter((_, i) => i !== index);
    setEditingService((prev) => ({
      ...prev,
      includes: newIncludes,
    }));
  };

  const saveChanges = async () => {
    try {
      if (editingService._id) {
        // Actualizar servicio existente
        await editService(editingService._id, editingService);
        await Swal.fire({
          icon: "success",
          title: "Los Cambios Se  Aplicaron Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Crear nuevo servicio
        await addService(editingService);

        await Swal.fire({
          icon: "success",
          title: "Servicio Creado Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving service:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `¡Algo salió mal! ${error}`,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const addNewService = () => {
    // Encontrar el ID numérico más alto
    const highestId =
      services.length > 0
        ? Math.max(...services.map((service) => Number(service.id || 0)))
        : 0;

    const newService = {
      id: highestId + 1,
      title: "Nuevo Servicio",
      price: 0,
      duration: 0,
      includes: [""],
      icon: "❓",
    };

    setEditingService(newService);
    setIsModalOpen(true);
  };

  if (loading && services.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        Cargando servicios...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 pr-4 pl-20 bg-white shadow-md">
        <h1 className="text-xl font-bold">Administración de Servicios</h1>
        <div className="flex justify-between items-center">
          <button
            onClick={addNewService}
            className="flex items-center text-sm font-medium bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <Plus className="mr-2" /> Agregar Servicio
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 m-3">
        {services.length === 0 ? (
          <div className="col-span-3 text-center p-6 bg-gray-100 rounded-lg">
            No hay servicios registrados.
          </div>
        ) : (
          services.map((service) => (
            <div key={service._id} className="border rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{service.title}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditService(service)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div>
                  <p>Id: {service.id}</p>
                  <p>
                    Precio: ${service.price.toLocaleString("es-CO")} -{" "}
                    {service.price > 0 ? "Disponible" : "No disponible"}
                  </p>
                  <p>Duración: {service.duration} min</p>
                  <p>Ícono: {service.icon}</p>
                </div>
                <div>
                  <p>Servicios:</p>
                  <ul>
                    {service.includes &&
                      service.includes.map((item, i) => (
                        <li key={i} className="flex">
                          <span className="text-barber-accent mr-2">•</span>
                          {item}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingService._id ? "Editar Servicio" : "Crear Servicio"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2">Título del Servicio</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingService.title}
                  onChange={(e) => handleInputChange(e, "title")}
                  placeholder="Nombre del servicio"
                />
              </div>

              <div>
                <label className="block mb-2">Precio</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={editingService.price}
                  onChange={(e) => handleInputChange(e, "price")}
                  placeholder="Precio del servicio"
                />
              </div>

              <div>
                <label className="block mb-2">Duración</label>
                <input
                  type="number"
                  className="w-full border rounded p-2"
                  value={editingService.duration}
                  onChange={(e) => handleInputChange(e, "duration")}
                  placeholder="Duración del servicio"
                />
              </div>

              <div>
                <label className="block mb-2">Ícono</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingService.icon}
                  onChange={(e) => handleInputChange(e, "icon")}
                  placeholder="Ícono del servicio"
                />
              </div>

              <div>
                <label className="block mb-2">Incluye</label>
                {editingService.includes &&
                  editingService.includes.map((include, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <input
                        className="flex-grow border rounded p-2"
                        value={include}
                        onChange={(e) =>
                          handleIncludesChange(index, e.target.value)
                        }
                        placeholder="Detalle del servicio"
                      />
                      <button
                        onClick={() => removeIncludeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  ))}
                <button
                  onClick={addIncludeItem}
                  className="flex items-center text-green-500 hover:text-green-700 mt-2"
                >
                  <PlusCircle className="mr-2" /> Agregar Detalle
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                <X className="mr-2" /> Cancelar
              </button>
              <button
                onClick={saveChanges}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                <Save className="mr-2" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesAdminPanel;
