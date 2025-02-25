import React from "react";

const ServicesForm = ({ formData, setFormData, services }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Selecciona tu servicio
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
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
                formData.servicio === service.id
                  ? "ring-2 ring-blue-500 bg-blue-50"
                  : "hover:bg-gray-50"
              }
            `}
            onClick={() => setFormData({ ...formData, servicio: service.id })}
          >
            <div className="p-4 flex flex-col items-center">
              {/* Ícono del servicio */}
              <div className="text-4xl mb-4 text-center">{service.icon}</div>

              <div className="text-center w-full">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-2xl font-bold text-barber-accent mb-2">
                  {service.price}
                </p>
                <p className="text-gray-600 mb-4">{service.duration}</p>
              </div>

              {/* Lista de servicios incluidos */}
              <ul className="space-y-2 w-full flex flex-col items-center">
                {service.includes.map((item, index) => (
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

      {/* Resumen del servicio seleccionado */}
      {formData.servicio && (
        <div className="mt-4 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">
                {services.find((s) => s.id === formData.servicio)?.icon}
              </div>
              <div>
                <p className="font-medium">
                  {services.find((s) => s.id === formData.servicio)?.title}
                </p>
                <p className="text-sm text-gray-500">
                  {services.find((s) => s.id === formData.servicio)?.duration}
                </p>
              </div>
            </div>
            <p className="text-xl font-bold text-barber-accent">
              {services.find((s) => s.id === formData.servicio)?.price}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesForm;