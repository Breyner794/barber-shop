import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  Save, 
  MapPin 
} from 'lucide-react';
import { getAllSite, createSite, updateSite, deleteSite } from '../../services/sedesClient';

const SedesAdminPanel = () => {
  const [sedes, setSedes] = useState([]);
  const [editingSede, setEditingSede] = useState({
    name_site: "",
    address_site: "",
    phone_site: "",
    headquarter_time: "", // Inicializa con la fecha actual
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSite = async () =>{
    try{
      setLoading(true);
      const response = await getAllSite();
      const siteData = response.data ? response.data : response;
      setSedes(siteData);
    }catch(error){
      console.error('Error Loading sites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchSite();
  },[]);

  const handleEditSede = (sede) => {
    setEditingSede({...sede});
    setIsModalOpen(true);
  };

  const handleDeleteSede = async(id) => {
    try{
      await deleteSite(id);

      await fetchSite();
    }catch (error){
      console.error('Error deleting site',error);
    }
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
  setEditingSede(prev => ({
    ...prev,
    [field]: value
  }));
  };

  const saveChanges = async() => {
    try{
      if (editingSede._id){
        await updateSite(editingSede._id, editingSede);
      } else {
        await createSite(editingSede);
      }
      await fetchSite();
      setIsModalOpen(false);
    }catch(error){
      console.error('Error saving site:', error)
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

  if (loading) {
    return <div className="flex justify-center items-center h-full">Cargando servicios...</div>;
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
        {sedes.map((sede) => (
          <div 
            key={sede._id} 
            className="border rounded-lg p-4 shadow-md"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{sede.name_site}</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleEditSede(sede)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <Edit />
                </button>
                <button 
                  onClick={() => handleDeleteSede(sede._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-start">
                <MapPin className="mr-2 text-gray-600 mt-1" size={16} />
                <p>{sede.address_site}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">📞</span>
                <p>{sede.phone_site}</p>
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-gray-600">🕒</span>
                <p>{sede.headquarter_time}</p>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>ID: {sede._id}</p>
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
                  value={editingSede.name_site}
                  onChange={(e) => handleInputChange(e, 'name_site')}
                  placeholder="Ej: Sede - Compartir"
                />
              </div>
              
              <div>
                <label className="block mb-2">Dirección</label>
                <input 
                  className="w-full border rounded p-2"
                  value={editingSede.address_site}
                  onChange={(e) => handleInputChange(e, 'address_site')}
                  placeholder="Ej: Calle 123 #45-67"
                />
              </div>
              
              <div>
                <label className="block mb-2">Teléfono</label>
                <input 
                  className="w-full border rounded p-2"
                  type="number"
                  value={editingSede.phone_site}
                  onChange={(e) => handleInputChange(e, 'phone_site')}
                  placeholder="Ej: 3001234567"
                />
              </div>
              
              <div>
                <label className="block mb-2">Horario</label>
                <input 
                  className="w-full border rounded p-2"
                  value={editingSede.headquarter_time}
                  onChange={(e) => handleInputChange(e, 'headquarter_time')}
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