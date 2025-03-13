import React, { useState } from 'react';
import { 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  Save, 
  MapPin 
} from 'lucide-react';
import { sedes as initialSedes } from '../../data/sedesData';

const SedesAdminPanel = () => {
  const [sedes, setSedes] = useState(initialSedes);
  const [editingSede, setEditingSede] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditSede = (sede) => {
    setEditingSede({...sede});
    setIsModalOpen(true);
  };

  const handleDeleteSede = (id) => {
    setSedes(sedes.filter(sede => sede.id !== id));
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditingSede(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveChanges = () => {
    if (editingSede.id) {
      // Actualizar sede existente
      setSedes(prev => 
        prev.map(sede => 
          sede.id === editingSede.id ? editingSede : sede
        )
      );
    } else {
      // Agregar nueva sede
      const newSede = {
        ...editingSede,
        id: Math.max(...sedes.map(s => s.id), 0) + 1
      };
      setSedes(prev => [...prev, newSede]);
    }
    setIsModalOpen(false);
  };

  const addNewSede = () => {
    const newSede = {
      id: null,
      nombre: "",
      direccion: "",
      telefono: "",
      horario_sede: ""
    };
    setEditingSede(newSede);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto">
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
        {sedes.map((sede) => (
          <div 
            key={sede.id} 
            className="border rounded-lg p-4 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{sede.nombre}</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditSede(sede)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <Edit />
                </button>
                <button 
                  onClick={() => handleDeleteSede(sede.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-start">
                <MapPin className="mr-2 text-gray-600 mt-1" size={16} />
                <p>{sede.direccion}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">📞</span>
                <p>{sede.telefono}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">🕒</span>
                <p>{sede.horario_sede}</p>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>ID: {sede.id}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingSede && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingSede.id ? "Editar Sede" : "Nueva Sede"}
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
                  value={editingSede.nombre}
                  onChange={(e) => handleInputChange(e, 'nombre')}
                  placeholder="Ej: Sede - Compartir"
                />
              </div>
              
              <div>
                <label className="block mb-2">Dirección</label>
                <input 
                  className="w-full border rounded p-2"
                  value={editingSede.direccion}
                  onChange={(e) => handleInputChange(e, 'direccion')}
                  placeholder="Ej: Calle 123 #45-67"
                />
              </div>
              
              <div>
                <label className="block mb-2">Teléfono</label>
                <input 
                  className="w-full border rounded p-2"
                  type="tel"
                  value={editingSede.telefono}
                  onChange={(e) => handleInputChange(e, 'telefono')}
                  placeholder="Ej: 3001234567"
                />
              </div>
              
              <div>
                <label className="block mb-2">Horario</label>
                <input 
                  className="w-full border rounded p-2"
                  value={editingSede.horario_sede}
                  onChange={(e) => handleInputChange(e, 'horario_sede')}
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