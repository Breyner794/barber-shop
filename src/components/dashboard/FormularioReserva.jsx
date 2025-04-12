import React, { useState, useEffect } from 'react';
import { X as XIcon } from 'lucide-react';
import { services } from "../../data/servicesData";
import CustomDatePicker from "../DateTimePicker/CustomDatePicker";
import ServicesForm from "../services/ServicesForm";
import SedesForm from "../sedes/SedesForm";
import BarberosForm from "../barberos/BarberosForm";
import { useBarbers } from "../../context/BarberContext";

const FormularioReserva = ({ initialData, onSubmit, onCancel }) => {

    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectSede, setSelectSede] = useState(null);
    const { getSiteById } = useBarbers();

  // Estado inicial del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    fecha: '',
    hora: '',
    servicio: '',
    sede: '',
    barbero: '',
    estado: 'pendiente',
    notas: ''
  });

  // Opciones para los selectores
  const servicios = [
    { id: 'corte-clasico', nombre: 'Corte de cabello clásico' },
    { id: 'corte-fade', nombre: 'Corte Fade' },
    { id: 'barba', nombre: 'Corte de barba' },
    { id: 'afeitado', nombre: 'Afeitado clásico' },
    { id: 'manicure', nombre: 'Manicure' },
    { id: 'pedicure', nombre: 'Pedicure' },
    { id: 'tinte', nombre: 'Tinte de cabello' }
  ];

  const estados = [
    { id: 'pendiente', nombre: 'Pendiente' },
    { id: 'confirmada', nombre: 'Confirmada' },
    { id: 'completada', nombre: 'Completada' },
    { id: 'cancelada', nombre: 'Cancelada' }
  ];

  // Si hay datos iniciales (modo edición), cargarlos en el formulario
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || '',
        telefono: initialData.telefono || '',
        email: initialData.email || '',
        fecha: initialData.fecha || '',
        hora: initialData.hora || '',
        servicio: initialData.servicio || '',
        sede: initialData.sede || '',
        barbero: initialData.barbero || '',
        estado: initialData.estado || 'pendiente',
        notas: initialData.notas || ''
      });
    } else {
      // Si es una nueva reserva, establecer la fecha actual como valor predeterminado
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0];
      
      setFormData({
        ...formData,
        fecha: formattedDate,
        estado: 'pendiente'
      });
    }
  }, [initialData]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Función para obtener el nombre de un elemento seleccionado
  const getSelectedName = (options, selectedId) => {
    const option = options.find(opt => opt.id.toString() === selectedId.toString());
    return option ? option.nombre : '';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Información del cliente */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Información del Cliente</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Completo *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono *
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Detalles de la reserva */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Detalles de la Reserva</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            selectSede={selectSede} 
            setSelectSede={setSelectSede} 
            setSelectedBarber={setSelectedBarber}
          />

          {/* Barberos */}
          <BarberosForm 
            formData={formData} 
            setFormData={setFormData}  
            selectedBarber={selectedBarber} 
            setSelectedBarber={setSelectedBarber}
            getSiteById={getSiteById}
          />
          
          {/* Solo mostrar selector de estado en modo edición */}
          {initialData && (
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {estados.map(estado => (
                  <option key={estado.id} value={estado.id}>
                    {estado.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {/* Notas adicionales */}
      <div className="mb-6">
        <label htmlFor="notas" className="block text-sm font-medium text-gray-700 mb-1">
          Notas adicionales
        </label>
        <textarea
          id="notas"
          name="notas"
          value={formData.notas}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {initialData ? 'Actualizar Reserva' : 'Crear Reserva'}
        </button>
      </div>
    </form>
  );
};

export default FormularioReserva;