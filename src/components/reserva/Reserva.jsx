// components/reserva/Reserva.jsx
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { barberos } from "../../data/barberosData";
import { sedes } from "../../data/sedesData";
import CustomDatePicker from "../DateTimePicker/CustomDatePicker";
import ServicesForm from "../services/ServicesForm";
import SedesForm from "../sedes/sedesForm";
import BarberosForm from "../barberos/BarberosForm";

const Reserva = () => {
  const location = useLocation();
  const preSelectedService = location.state?.selectedService;
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectSede, setSelectSede] = useState(null);

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

          {/* Selector de Servicios */}
          <ServicesForm 
            formData={formData} 
            setFormData={setFormData} 
          />

          {/* Fecha y hora */}
          <div className="mb-6">
            <CustomDatePicker formData={formData} setFormData={setFormData} />
          </div>

          {/* Sedes */}
          <SedesForm 
            formData={formData} 
            setFormData={setFormData} 
            sedes={sedes} 
            selectSede={selectSede} 
            setSelectSede={setSelectSede} 
          />

          {/* Barberos */}
          <BarberosForm 
            formData={formData} 
            setFormData={setFormData} 
            barberos={barberos} 
            selectedBarber={selectedBarber} 
            setSelectedBarber={setSelectedBarber} 
          />
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
