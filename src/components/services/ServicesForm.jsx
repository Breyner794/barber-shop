import React from "react";
import { useServices } from "../../context/ServicesContext.jsx";

const ServicesForm = ({ formData, setFormData }) => {
  // Usar el contexto de servicios
  const { services, loading, error, refreshServices } = useServices();

  const hasServices = Array.isArray(services) && services.length > 0;

  // Función para obtener el servicio seleccionado
  const getSelectedService = () => {
    if (!hasServices || !formData.servicio) return null;
    return services.find(
      (s) => s.id === formData.servicio || s._id === formData.servicio
    );
  };

  const selectedService = getSelectedService();

  if (loading) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Selecciona tu servicio
        </label>
        <div className="bg-gray-100 rounded-xl p-8 text-center">
          <p>Cargando servicios disponibles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Selecciona tu servicio
        </label>
        <div className="bg-red-50 rounded-xl p-8 text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={refreshServices} 
            className="mt-2 text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Selecciona tu servicio
      </label>
      
      {!hasServices ? (
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <p>No hay servicios disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id || service.id}
              className={`
                bg-white 
                rounded-xl 
                shadow-md 
                overflow-hidden 
                cursor-pointer 
                transition-all 
                duration-200
                hover:shadow-lg
                ${
                  formData.servicio === service.id || formData.servicio === service._id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }
              `}
              onClick={() => setFormData({ 
                ...formData, 
                servicio: service._id || service.id 
              })}
            >
              <div className="p-4 flex flex-col items-center">
                {/* Ícono del servicio */}
                <div className="text-4xl mb-4 text-center">{service.icon}</div>

                <div className="text-center w-full">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-2xl font-bold text-barber-accent mb-2">
                    $ {service.price.toLocaleString('es-CO')}
                  </p>
                  <p className="text-gray-600 mb-4">{service.duration} minutos</p>
                </div>

                {/* Lista de servicios incluidos */}
                <ul className="space-y-2 w-full flex flex-col items-center">
                  {service.includes && service.includes.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-center text-sm text-gray-600 w-full"
                    >
                      <span className="text-barber-accent mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumen del servicio seleccionado */}
      {selectedService && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {selectedService.icon}
              </div>
              <div>
                <p className="font-medium">
                  {selectedService.title}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedService.duration} minutos
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-barber-accent">
              $ {selectedService.price.toLocaleString('es-CO')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesForm;