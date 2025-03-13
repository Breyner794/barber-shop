import React, { useState } from "react";
import { Trash2, Edit, Plus, X, Save, User } from "lucide-react";
import { barberos as initialBarberos } from "../../data/barberosData";
import { sedes } from "../../data/sedesData";

const BarberosAdminPanel = () => {
  const [barberos, setBarberos] = useState(initialBarberos);
  const [editingBarbero, setEditingBarbero] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditBarbero = (barbero) => {
    setEditingBarbero({ ...barbero });
    setIsModalOpen(true);
  };

  const handleDeleteBarbero = (id) => {
    setBarberos(barberos.filter((barbero) => barbero.id !== id));
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditingBarbero((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSedeChange = (e) => {
    const value = parseInt(e.target.value);
    setEditingBarbero((prev) => ({
      ...prev,
      sede: value,
    }));
  };

  const saveChanges = () => {
    if (editingBarbero.id) {
      // Actualizar barbero existente
      setBarberos((prev) =>
        prev.map((barbero) =>
          barbero.id === editingBarbero.id ? editingBarbero : barbero
        )
      );
    }
    // } else {
    //   // Agregar nuevo barbero
    //   const newBarbero = {
    //     ...editingBarbero,
    //     id: Math.max(...barberos.map((b) => b.id), 0) + 1,
    //   };
    //   setBarberos((prev) => [...prev, newBarbero]);
    // }
    setIsModalOpen(false);
  };

  const addNewBarbero = () => {
    const newBarbero = {
      id: "",
      nombre: "",
      apellido: "",
      sede: 1,
      imageUrl: "/src/assets/image/usuario.png",
    };
    setEditingBarbero(newBarbero);
    setIsModalOpen(true);
  };

  const getSedeNombre = (sedeId) => {
    const sede = sedes.find((s) => s.id === sedeId);
    return sede ? sede.nombre : "Desconocida";
  };

  return (
    <div className="container mx-auto">
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
        {barberos.map((barbero) => (
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
                  onClick={() => handleDeleteBarbero(barbero.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col">
                <p>ID: {barbero.id}</p>
                <p>Sede: {getSedeNombre(barbero.sede)}</p>
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
        ))}
      </div>

      {isModalOpen && editingBarbero && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-2xl font-bold">
                {editingBarbero.id ? "Editar Barbero" : "Nuevo Barbero"}
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
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
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
