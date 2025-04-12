import { useState } from "react";
import { X as XIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import CustomDatePicker from "../DateTimePicker/CustomDatePicker";
import ServicesForm from "../services/ServicesForm";
import SedesForm from "../sedes/SedesForm";
import BarberosForm from "../barberos/BarberosForm";
import { useReservations } from "../../context/ReservaContext";
import { useBarbers } from "../../context/BarberContext";

const Reserva = ({ onSuccess }) => {
  const location = useLocation();
  const preSelectedService = location.state?.selectedService;
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectSede, setSelectSede] = useState(null);
  const { addReservation } = useReservations();
  const [submitError, setSubmitError] = useState(null);
  const { getSiteById } = useBarbers();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    hour: "",
    service: preSelectedService || "",
    site: "",
    barber: "",
    notes: "",
  });

  // Validar formulario
  const validateForm = () => {
    // Verificar campos obligatorios
    const requiredFields = [
      "name",
      "phone",
      "date",
      "hour",
      "service",
      "site",
      "barber",
    ];
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
      // Modo creación - crear nueva reserva
      await addReservation(formData);

      // Mostrar mensaje de éxito
      setSubmitSuccess(true);
      // Configurar temporizador para ocultar el mensaje después de unos segundos
      setTimeout(() => setSubmitSuccess(false), 9000);

      setFormData({
        name: "",
        phone: "",
        email: "",
        date: new Date().toISOString().split("T")[0],
        hour: "",
        service: "",
        site: "",
        barber: "",
        notes: "",
      });

      setSelectedBarber(null);
      setSelectSede(null);

      // Llamar al callback de éxito si se proporciona
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error completo:", error);
      setSubmitError(
        error.response
          ? `Error ${error.response.status}: ${error.response.data.message || "Error al guardar"
          }`
          : error.message || "Error al guardar la reserva"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-gray-200">
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Reserva tu cita</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Datos personales */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono</label>
            <input
              type="tel"
              value={formData.phone}
              placeholder="Numero de WhatsApp si es posible"
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
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
              placeholder="Correo electronico"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>

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

          {/* Notas adicionales */}
          <div className="mb-6">
            <label
              htmlFor="notas"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Notas adicionales
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              placeholder="Nota adicional es OPCIONAL"
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
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

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-barber-accent text-white py-2 rounded hover:bg-red-700 transition-colors"
          >
            {isSubmitting ? "Guardando..." : "Confirmar Reserva"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Reserva;
