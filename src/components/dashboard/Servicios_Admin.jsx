import React, { useState } from 'react';
import { 
  Trash2, 
  Edit, 
  Plus, 
  X, 
  Save, 
  PlusCircle 
} from 'lucide-react';
import { services as initialServices} from '../../data/servicesData';

const ServicesAdminPanel = () => {

  const [services, setServices] = useState(initialServices);

  const [editingService, setEditingService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditService = (service) => {
    setEditingService({...service});
    setIsModalOpen(true);
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditingService(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleIncludesChange = (index, value) => {
    const newIncludes = [...editingService.includes];
    newIncludes[index] = value;
    setEditingService(prev => ({
      ...prev,
      includes: newIncludes
    }));
  };

  const addIncludeItem = () => {
    setEditingService(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  };

  const removeIncludeItem = (index) => {
    const newIncludes = editingService.includes.filter((_, i) => i !== index);
    setEditingService(prev => ({
      ...prev,
      includes: newIncludes
    }));
  };

  const saveChanges = () => {
    setServices(prev => 
      prev.map(service => 
        service.id === editingService.id ? editingService : service
      )
    );
    setIsModalOpen(false);
    console.log(setServices);
  };

  const addNewService = () => {
    const newService = {
      id: services.length + 1,
      title: "Nuevo Servicio",
      price: "$0.000",
      duration: "0 min",
      includes: [""],
      icon: "❓"
    };
    setEditingService(newService);
    setIsModalOpen(true);
    
  };

  return (
    
    <div className="container mx-auto">
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
        {services.map((service) => (
          <div 
            key={service.id} 
            className="border rounded-lg p-4 shadow-md"
          >
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
                  onClick={() => handleDeleteService(service.id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 />
                </button>
              </div>
            </div>
            <div className='grid grid-cols-2'>
            <div>
            <p>Precio: {service.price}</p>
            <p>Duración: {service.duration}</p>
            <p>Ícono: {service.icon}</p>
            </div>
            <p>Servicios: {service.includes.map((item,i)=>(
                <li key={i} className='flex'>
                    <span className='text-barber-accent mr-2'>•</span>
                    {item}
                </li>
            )
            )
                }
            </p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Editar Servicio</h2>
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
                  onChange={(e) => handleInputChange(e, 'title')}
                  placeholder="Nombre del servicio"
                />
              </div>
              
              <div>
                <label className="block mb-2">Precio</label>
                <input 
                  className="w-full border rounded p-2"
                  value={editingService.price}
                  onChange={(e) => handleInputChange(e, 'price')}
                  placeholder="Precio del servicio"
                />
              </div>
              
              <div>
                <label className="block mb-2">Duración</label>
                <input 
                  className="w-full border rounded p-2"
                  value={editingService.duration}
                  onChange={(e) => handleInputChange(e, 'duration')}
                  placeholder="Duración del servicio"
                />
              </div>
              
              <div>
                <label className="block mb-2">Ícono</label>
                <input 
                  className="w-full border rounded p-2"
                  value={editingService.icon}
                  onChange={(e) => handleInputChange(e, 'icon')}
                  placeholder="Ícono del servicio"
                />
              </div>
              
              <div>
                <label className="block mb-2">Incluye</label>
                {editingService.includes.map((include, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input 
                      className="flex-grow border rounded p-2"
                      value={include}
                      onChange={(e) => handleIncludesChange(index, e.target.value)}
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