import React, { useState } from "react";
import { Trash2, Edit, Plus, X, Save, User } from "lucide-react";
import { useBarbers } from "../../context/BarberContext";
import { useSede } from "../../context/SedeContext";
import Swal from "sweetalert2";

const BarberosAdminPanel = () => {
  
  const { 
    barber, 
    loading, 
    error, 
    addBarber, 
    editBarber, 
    removeBarber, 
    getSiteById,
  } = useBarbers();
  const {sites} = useSede();
  const [editingBarbero, setEditingBarbero] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditBarbero = (barbero) => {
    setEditingBarbero({ ...barbero });
    setIsModalOpen(true);
  };

  const handleDeleteBarbero = async (barbero) => {
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
        await removeBarber(barbero.id, barbero._id);

        Swal.fire({
          title: "¡Eliminado!",
          text: "Tu servicio ha sido eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      };
    } catch (error) {
      console.error("Error deleting barber:", error);
      Swal.fire({
        title: "Error",
        text: `¡No se pudo eliminar el barbero! ${error}`,
        icon: "error",
        confirmButtonColor: '#d33', // Color rojo para errores
        confirmButtonText: 'OK'
      });
    }
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditingBarbero((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSedeChange = (e) => {
    const value = e.target.value;
    setEditingBarbero((prev) => ({
      ...prev,
      sede: value,
    }));
  };

  const saveChanges = async () => {
    try {
      if (editingBarbero._id) {
        // Actualizar barbero existente
        await editBarber(editingBarbero);
        await Swal.fire({
          icon: "success",
          title: "Barbero Actualizado Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Agregar nuevo barbero
        await addBarber(editingBarbero);
        await Swal.fire({
          icon: "success",
          title: "Barbero Creado Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error deleting barber:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `¡Algo salió mal! ${error}`,
        confirmButtonColor: '#d33', // Color rojo para errores
        confirmButtonText: 'OK'
      });
    }
  };

  const addNewBarbero = () => {
    const newBarbero = {
      id: "",
      nombre: "",
      apellido: "",
      sede: "", // Dejarlo vacío para que el usuario seleccione
      imageUrl: "/src/assets/image/usuario.png",
    };
    setEditingBarbero(newBarbero);
    setIsModalOpen(true);
  };

  if (loading && barber.length === 0) {
    return <div className="flex-1 flex items-center justify-center">Cargando barberos...</div>;
  }

  // if (error && barber.length === 0) {
  //   return (
  //     <div className="flex-1 flex items-center justify-center text-red-500">
  //       Error: {error}
  //     </div>
  //   );
  // }

  return (
    <div className="flex-1 overflow-auto">
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 pr-4 pl-20 bg-white shadow-md">
        <h1 className="text-xl font-bold">Administración de Barberos</h1>
        <div className="flex justify-between items-center">
          <button
            onClick={addNewBarbero}
            className="flex items-center text-sm font-medium bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <Plus className="mr-2" /> Agregar Barbero
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 m-3">
        {barber.length === 0 ? (
          <div className="col-span-3 text-center p-6 bg-gray-100 rounded-lg">
            No hay barberos registrados.
          </div>
        ) : (
          barber.map((barbero) => (
            <div key={barbero.id} className="border rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {barbero.nombre} {barbero.apellido}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditBarbero(barbero)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteBarbero(barbero)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex flex-col">
                  <p>ID: {barbero.id}</p>
                  <p>Sede: {getSiteById(barbero.site)}</p>
                </div>
                <div className="flex items-center justify-center">
                  {barbero.imageUrl ? (
                    <img
                      src={barbero.imageUrl}
                      alt={`${barbero.nombre} ${barbero.apellido}`}
                      className="w-16 h-16 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={24} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingBarbero && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-2xl font-bold">
                {editingBarbero._id ? "Editar Barbero" : "Nuevo Barbero"}
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
                <label className="block mb-2">CC</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingBarbero.id}
                  onChange={(e) => handleInputChange(e, "id")}
                  placeholder="Cedula del usuario"
                />
              </div>

              <div>
                <label className="block mb-2">Nombre</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingBarbero.nombre}
                  onChange={(e) => handleInputChange(e, "nombre")}
                  placeholder="Nombre del barbero"
                />
              </div>

              <div>
                <label className="block mb-2">Apellido</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingBarbero.apellido}
                  onChange={(e) => handleInputChange(e, "apellido")}
                  placeholder="Apellido del barbero"
                />
              </div>

              <div>
                <label className="block mb-2">Sede</label>
                <select
                  className="w-full border rounded p-2"
                  value={editingBarbero.sede}
                  onChange={handleSedeChange}
                >
                  <option value="">Selecciona una sede</option>
                  {/* Aquí usamos los sites del contexto */}
                  {sites.map((sede) => (
                    <option key={sede._id} value={sede._id}>
                      {sede.name_site}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">URL de la imagen</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingBarbero.imageUrl}
                  onChange={(e) => handleInputChange(e, "imageUrl")}
                  placeholder="Ruta de la imagen"
                />
                <div className="mt-2 flex justify-center">
                  {editingBarbero.imageUrl ? (
                    <img
                      src={editingBarbero.imageUrl}
                      alt="Vista previa"
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={32} />
                    </div>
                  )}
                </div>
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

export default BarberosAdminPanel;