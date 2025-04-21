import React, { useState, useEffect } from 'react';
import { X as XIcon } from 'lucide-react';
import CustomDatePicker from "../DateTimePicker/CustomDatePicker";
import ServicesForm from "../services/ServicesForm";
import SedesForm from "../sedes/SedesForm";
import BarberosForm from "../barberos/BarberosForm";
import { useBarbers } from "../../context/BarberContext";
import { useReservations } from "../../context/ReservaContext";

const FormularioReserva = ({ initialData, onCancel, onSuccess }) => {
    const [selectedBarber, setSelectedBarber] = useState(null);
    const [selectSede, setSelectSede] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const { getSiteById } = useBarbers();
    const { addReservation, updateReservation } = useReservations();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        date: '',
        hour: '',
        service: '',
        site: '',
        barber: '',
        state: 'pendiente',
        notes: ''
    });

    // Opciones para los estados
    const states = [
        { id: 'pendiente', nombre: 'Pendiente' },
        { id: 'confirmada', nombre: 'Confirmada' },
        { id: 'completada', nombre: 'Completada' },
        { id: 'cancelada', nombre: 'Cancelada' }
    ];

    // Si hay datos iniciales (modo edición), cargarlos en el formulario
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                phone: initialData.phone || '',
                email: initialData.email || '',
                date: initialData.date || '',
                hour: initialData.hour || '',
                service: initialData.service || '',
                site: initialData.site || '',
                barber: initialData.barber || '',
                state: initialData.state || 'pendiente',
                notes: initialData.notes || ''
            });
            
            // Si tiene sede, establecer selectSede para el selector de barberos
            if (initialData.site) {
                setSelectSede(initialData.site);
            }
            
            // Si tiene barbero, establecer selectedBarber
            if (initialData.barber) {
                setSelectedBarber(initialData.barber);
            }
        } else {
            // Si es una nueva reserva, establecer la fecha actual como valor predeterminado
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            
            setFormData({
                ...formData,
                date: formattedDate,
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

    // Validar formulario
    const validateForm = () => {
        // Verificar campos obligatorios
        const requiredFields = ['name', 'phone','email', 'date', 'hour', 'service', 'site', 'barber'];
        for (const field of requiredFields) {
            if (!formData[field]) {
                return `El campo ${field} es obligatorio`;
            }
        }
        
        // Validar formato de teléfono (opcional)
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (!phoneRegex.test(formData.phone)) {
            return "El número de teléfono no es válido";
        }
        
        // Validar email si se proporcionó
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return "El correo electrónico no es válido";
        }
        
        return null;
    };

    // Enviar formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validar formulario
        const validationError = validateForm();
        if (validationError) {
            setSubmitError(validationError);
            return;
        }
        
        setIsSubmitting(true);
        setSubmitError(null);
        
        try {
            if (initialData && initialData._id) {
                // Modo edición - actualizar reserva existente
                await updateReservation(initialData._id, formData);
            } else {
              // Modo creación - crear nueva reserva
              await addReservation(formData);

              // Mostrar mensaje de éxito
              setSubmitSuccess(true);
              // Configurar temporizador para ocultar el mensaje después de unos segundos
              setTimeout(() => setSubmitSuccess(false), 5000);

              setFormData({
                name: "",
                phone: "",
                email: "",
                date: new Date().toISOString().split("T")[0],
                hour: "",
                service: "",
                site: "",
                barber: "",
                state: "pendiente",
                notes: "",
              });

              setSelectedBarber(null);
              setSelectSede(null);
            }
            
            // Llamar al callback de éxito si se proporciona
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
          console.error("Error completo:", error);
          setSubmitError(error.response ? 
              `Error ${error.response.status}: ${error.response.data.message || 'Error al guardar'}` : 
              (error.message || 'Error al guardar la reserva'));
        } finally {
            setIsSubmitting(false);
        }
        
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Información del cliente */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Información del Cliente
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre Completo *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Teléfono *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
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
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Detalles de la Reserva
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Selector de Servicios */}
            <ServicesForm formData={formData} setFormData={setFormData} />

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
                <label
                  htmlFor="estado"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {states.map((estado) => (
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
          <label
            htmlFor="notes"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Notas adicionales
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

              {/* Mensaje de error si hay */}
              {submitError && (
          <div className="bg-red-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <XIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error al guardar la reserva
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mensaje de éxito */}
        {submitSuccess && (
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                {/* Puedes importar un ícono de check de lucide-react */}
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  ¡Reserva creada con éxito!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>La reserva ha sido registrada correctamente.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting
              ? "Guardando..."
              : initialData
              ? "Actualizar Reserva"
              : "Crear Reserva"}
          </button>
        </div>
      </form>
    );
};

export default FormularioReserva;