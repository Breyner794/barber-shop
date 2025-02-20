// components/reserva/Reserva.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { services } from '../../data/servicesData';
import { barberos } from '../../data/barberosData';
import { sedes } from '../../data/sedesData';
import { horasDisponibles } from '../../data/horariosData'

const Reserva = () => {
  const location = useLocation();
  const preSelectedService = location.state?.selectedService;
  const [selectedBarber, setSelectedBarber] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
    servicio: preSelectedService || "",
    barbero: "", // opcional
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar al backend
    console.log(formData);
  };

  const barberosFiltrados = barberos.filter(
    (barbero) => barbero.sede === parseInt(formData.sede)
  );

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Reserva tu cita</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos personales */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) =>
                setFormData({ ...formData, telefono: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* Selección de servicio */}
         {/* Selector de Servicios */}
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
          ${formData.servicio === service.id 
            ? 'ring-2 ring-blue-500 bg-blue-50' 
            : 'hover:bg-gray-50'
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
              <li key={index} className="flex items-center justify-center text-sm text-gray-600 w-full">
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
            {services.find(s => s.id === formData.servicio)?.icon}
          </div>
          <div>
            <p className="font-medium">
              {services.find(s => s.id === formData.servicio)?.title}
            </p>
            <p className="text-sm text-gray-500">
              {services.find(s => s.id === formData.servicio)?.duration}
            </p>
          </div>
        </div>
        <p className="text-xl font-bold text-barber-accent">
          {services.find(s => s.id === formData.servicio)?.price}
        </p>
      </div>
    </div>
  )}
</div>

          {/* Fecha y hora */}
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              value={formData.fecha}
              onChange={(e) =>
                setFormData({ ...formData, fecha: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Hora</label>
            <select
              value={formData.hora}
              onChange={(e) =>
                setFormData({ ...formData, hora: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona una hora</option>
              {horasDisponibles.map((hora) => (
                <option key={hora} value={hora}>
                  {hora}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sede</label>
            <select
              value={formData.sede}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sede: e.target.value,
                  barbero: "", // Resetear barbero al cambiar de sede
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona una sede</option>
              {sedes.map((sede) => (
                <option key={sede.id} value={sede.id}>
                  {sede.nombre}
                </option>
              ))}
            </select>
          </div>

          {formData.sede && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Selecciona tu barbero
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {barberosFiltrados.map((barbero) => (
                  <div
                    key={barbero.id}
                    className={`
            bg-white 
            rounded-xl 
            shadow-md 
            overflow-hidden 
            cursor-pointer 
            transition-all 
            duration-200
            transform
            hover:scale-105
            hover:shadow-lg
            ${
              selectedBarber?.id === barbero.id
                ? "ring-2 ring-blue-500 bg-blue-50"
                : ""
            }
          `}
                    onClick={() => {
                      setSelectedBarber(barbero);
                      setFormData({ ...formData, barbero: barbero.id });
                    }}
                  >
                    <div className="p-4">
                      <div className="flex flex-col items-center">
                        <img
                          src={barbero.imageUrl}
                          alt={`Foto barbero ${barbero.nombre}`}
                          className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-gray-200"
                        />
                        <h3 className="text-sm font-semibold text-center text-gray-800">
                          {barbero.nombre}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Sede {barbero.sede === 1 ? "Compartir" : "Valle Grande"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Resumen de selección */}
              {selectedBarber && (
                <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Barbero seleccionado:
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={selectedBarber.imageUrl}
                          alt={`Foto de ${selectedBarber.nombre}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {selectedBarber.nombre}
                        </p>
                        <p className="text-xs text-gray-500">
                          Sede {selectedBarber.sede === 1 ? "Compartir" : "Valle Grande"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Botón de envío */}
          <button
            type="submit"
            className="w-full bg-barber-accent text-white py-2 rounded hover:bg-red-700 transition-colors"
          >
            Confirmar Reserva
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reserva;
