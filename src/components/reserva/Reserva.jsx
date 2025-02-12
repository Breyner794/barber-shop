// components/reserva/Reserva.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Reserva = () => {

  const sedes = [
    { id: 1, nombre: "Sede Norte" },
    { id: 2, nombre: "Sede Sur" },
  ];

  const barberos = [
    { id: 1, nombre: "Juan Pérez", sede: 1 },
    { id: 2, nombre: "Carlos García", sede: 1 },
    { id: 3, nombre: "Miguel López", sede: 2 },
    { id: 4, nombre: "David Martínez", sede: 2 },
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
    servicio: "",
    barbero: "", // opcional
  });

  // Estos datos vendrían de tu backend eventualmente
  const servicios = [
    { id: 1, nombre: "Corte Clásico", precio: "$15.000" },
    { id: 2, nombre: "Barba Completa", precio: "$10.000" },
    { id: 3, nombre: "Combo Premium", precio: "$20.000" },
  ];

  const horasDisponibles = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar al backend
    console.log(formData);
  };

  const barberosFiltrados = barberos.filter(
    barbero => barbero.sede === parseInt(formData.sede)
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
          <div>
            <label className="block text-sm font-medium mb-1">Servicio</label>
            <select
              value={formData.servicio}
              onChange={(e) =>
                setFormData({ ...formData, servicio: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecciona un servicio</option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre} - {servicio.precio}
                </option>
              ))}
            </select>
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
              onChange={(e) => setFormData({
                ...formData, 
                sede: e.target.value,
                barbero: '' // Resetear barbero al cambiar de sede
              })}
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

          {/* Selección de barbero */}
          {formData.sede && (
            <div>
              <label className="block text-sm font-medium mb-1">Barbero</label>
              <select
                value={formData.barbero}
                onChange={(e) => setFormData({...formData, barbero: e.target.value})}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Selecciona un barbero</option>
                {barberosFiltrados.map((barbero) => (
                  <option key={barbero.id} value={barbero.id}>
                    {barbero.nombre}
                  </option>
                ))}
              </select>
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
