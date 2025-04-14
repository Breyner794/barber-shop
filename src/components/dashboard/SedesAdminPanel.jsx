import React, { useState } from "react";
import { Trash2, Edit, Plus, X, Save, MapPin } from "lucide-react";
import { useSede } from "../../context/SedeContext.jsx";
import Swal from "sweetalert2";

const SedesAdminPanel = () => {
  const { sites, loading, addSede, editSede, removeSede } = useSede(); // Usa el contexto
  const [editingSede, setEditingSede] = useState({
    name_site: "",
    address_site: "",
    phone_site: "",
    headquarter_time: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditSede = (site) => {
    setEditingSede({ ...site });
    setIsModalOpen(true);
  };

  const handleDeleteSede = async (id) => {
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
        await removeSede(id);

        Swal.fire({
          title: "¡Eliminado!",
          text: "Tu Sede ha sido eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error eliminando sede", error);
      Swal.fire({
        title: "Error",
        text: `¡No se pudo eliminar la Sede! ${error}`,
        icon: "error",
      });
    }
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditingSede((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    try {
      if (editingSede._id) {
        await editSede(editingSede._id, editingSede);
        setIsModalOpen(false);
        await Swal.fire({
          icon: "success",
          title: "Sede Actualizada Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await addSede(editingSede);
        setIsModalOpen(false);
        await Swal.fire({
          icon: "success",
          title: "Sede Creada Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error guardando sede:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `¡Algo salió mal! ${error}`,
        showConfirmButton: false,
        timer: 2500,
      });
    }
  };

  const addNewSede = () => {
    const newSede = {
      name_site: "",
      address_site: "",
      phone_site: "",
      headquarter_time: "",
    };
    setEditingSede(newSede);
    setIsModalOpen(true);
  };

  if (loading && sites.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        Cargando sedes...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 pr-4 pl-20 bg-white shadow-md">
        <h1 className="text-xl font-bold ">Administración de Sedes</h1>
        <div className="flex justify-between items-center">
          <button
            onClick={addNewSede}
            className="flex items-center text-sm font-medium bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <Plus className="mr-2" /> Agregar Sede
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 m-3">
        {sites.length === 0 ? (
          <div className="col-span-3 text-center p-6 bg-gray-100 rounded-lg">
            No hay sedes registradas.
          </div>
        ) : (
          sites.map((site) => (
            <div key={site._id} className="border rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{site.name_site}</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditSede(site)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteSede(site._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-start">
                  <MapPin className="mr-2 text-gray-600 mt-1" size={16} />
                  <p>{site.address_site}</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">📞</span>
                  <p>{site.phone_site}</p>
                </div>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-600">🕒</span>
                  <p>{site.headquarter_time}</p>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <p>ID: {site._id}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingSede && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingSede._id ? "Editar Sede" : "Nueva Sede"}
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
                <label className="block mb-2">Nombre de la Sede</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingSede.name_site}
                  onChange={(e) => handleInputChange(e, "name_site")}
                  placeholder="Ej: Sede - Compartir"
                />
              </div>

              <div>
                <label className="block mb-2">Dirección</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingSede.address_site}
                  onChange={(e) => handleInputChange(e, "address_site")}
                  placeholder="Ej: Calle 123 #45-67"
                />
              </div>

              <div>
                <label className="block mb-2">Teléfono</label>
                <input
                  className="w-full border rounded p-2"
                  type="number"
                  value={editingSede.phone_site}
                  onChange={(e) => handleInputChange(e, "phone_site")}
                  placeholder="Ej: 3001234567"
                />
              </div>

              <div>
                <label className="block mb-2">Horario</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingSede.headquarter_time}
                  onChange={(e) => handleInputChange(e, "headquarter_time")}
                  placeholder="Ej: 9 am a 10 pm"
                />
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

export default SedesAdminPanel;
