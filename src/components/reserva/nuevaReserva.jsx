import { useState, useEffect } from "react";
import { Check, AlertCircle, Calendar, Clock } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useReservations } from "../../context/ReservaContext";
import { useBarbers } from "../../context/BarberContext";

const NuevoFormularioReserva = ({ onSuccess }) => {
  const location = useLocation();
  const preSelectedService = location.state?.selectedService;
  const { addReservation } = useReservations();
  const { getSiteById, getAllService, getAllSites, getBarbersBySite } = useBarbers();
  
  // Estados para los datos del formulario
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: preSelectedService || "",
    site: "",
    barber: "",
    date: "",
    hour: "",
    notes: "",
  });
  
  // Estados para controlar la UI y el flujo
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [sites, setSites] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar servicios y sedes al inicio
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const servicesData = await getAllService();
        const sitesData = await getAllSites();
        setServices(servicesData);
        setSites(sitesData);
      } catch (err) {
        setError("Error al cargar datos iniciales");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, [getAllService, getAllSites]);

  // Cargar barberos cuando se selecciona una sede
  useEffect(() => {
    const loadBarbers = async () => {
      if (!formData.site) return;
      
      try {
        setIsLoading(true);
        const barbersData = await getBarbersBySite(formData.site);
        setBarbers(barbersData);
      } catch (err) {
        setError("Error al cargar barberos");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBarbers();
  }, [formData.site, getBarbersBySite]);

  // Simular carga de fechas disponibles cuando se selecciona un barbero
  useEffect(() => {
    const loadAvailableDates = async () => {
      if (!formData.barber) return;
      
      // Aquí deberías hacer una llamada a tu API para obtener las fechas disponibles
      // Por ahora simularemos con datos de ejemplo
      setIsLoading(true);
      
      // Simulación - reemplazar con tu lógica real
      setTimeout(() => {
        const today = new Date();
        const nextWeekDates = Array.from({ length: 7 }, (_, i) => {
          const date = new Date();
          date.setDate(today.getDate() + i);
          return date.toISOString().split('T')[0];
        });
        
        setAvailableDates(nextWeekDates);
        setIsLoading(false);
      }, 500);
    };
    
    loadAvailableDates();
  }, [formData.barber]);

  // Simular carga de horas disponibles cuando se selecciona una fecha
  useEffect(() => {
    const loadAvailableHours = async () => {
      if (!formData.date || !formData.barber) return;
      
      // Aquí deberías hacer una llamada a tu API para obtener las horas disponibles
      setIsLoading(true);
      
      // Simulación - reemplazar con tu lógica real
      setTimeout(() => {
        const sampleHours = ["09:00", "10:00", "11:00", "12:00", "16:00", "17:00", "18:00"];
        setAvailableHours(sampleHours);
        setIsLoading(false);
      }, 500);
    };
    
    loadAvailableHours();
  }, [formData.date, formData.barber]);

  // Validar formulario según el paso actual
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Datos personales
        if (!formData.name.trim()) return "El nombre completo es obligatorio";
        if (!formData.phone.trim()) return "El teléfono es obligatorio";
        if (!/^\+?[0-9]{8,15}$/.test(formData.phone)) return "El número de teléfono no es válido";
        return null;
        
      case 2: // Servicio y sede
        if (!formData.service) return "Debes seleccionar un servicio";
        if (!formData.site) return "Debes seleccionar una sede";
        return null;
        
      case 3: // Barbero
        if (!formData.barber) return "Debes seleccionar un barbero";
        return null;
        
      case 4: // Fecha y hora
        if (!formData.date) return "Debes seleccionar una fecha";
        if (!formData.hour) return "Debes seleccionar una hora";
        return null;
        
      default:
        return null;
    }
  };

  // Avanzar al siguiente paso
  const nextStep = () => {
    const error = validateCurrentStep();
    if (error) {
      setError(error);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    setCurrentStep(prev => prev + 1);
  };

  // Retroceder al paso anterior
  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const error = validateCurrentStep();
    if (error) {
      setError(error);
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    try {
      setIsLoading(true);
      await addReservation(formData);
      setSuccess(true);
      
      // Resetear formulario después de un tiempo
      setTimeout(() => {
        setFormData({
          name: "",
          phone: "",
          email: "",
          service: "",
          site: "",
          barber: "",
          date: "",
          hour: "",
          notes: ""
        });
        setCurrentStep(1);
        setSuccess(false);
        
        if (onSuccess) {
          onSuccess();
        }
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Error al crear la reserva");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Renderizar el paso actual del formulario
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datos personales</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Nombre completo</label>
              <input
                type="text"
                placeholder="Nombre Completo"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input
                type="tel"
                placeholder="Número de WhatsApp si es posible"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email (Opcional)</label>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Servicio y sede</h3>
            
            <div>
              <label className="block text-sm font-medium mb-1">Servicio</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona un servicio</option>
                {services.map(service => (
                  <option key={service._id} value={service._id}>
                    {service.name} - ${service.price}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Sede</label>
              <select
                value={formData.site}
                onChange={(e) => {
                  setFormData({ 
                    ...formData, 
                    site: e.target.value,
                    barber: "",
                    date: "",
                    hour: "" 
                  });
                }}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecciona una sede</option>
                {sites.map(site => (
                  <option key={site.id || site._id} value={site.id || site._id}>
                    {site.name_site} - {site.address_site}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Selecciona un barbero</h3>
            
            {isLoading ? (
              <div className="text-center py-4">Cargando barberos...</div>
            ) : barbers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {barbers.map(barber => (
                  <div 
                    key={barber._id}
                    onClick={() => setFormData({ ...formData, barber: barber._id })}
                    className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors
                              ${formData.barber === barber._id ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        {barber.photo ? (
                          <img 
                            src={barber.photo} 
                            alt={barber.name} 
                            className="h-full w-full object-cover rounded-full"
                          />
                        ) : (
                          <span className="text-xl font-bold text-gray-500">
                            {barber.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{barber.name}</h4>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                No hay barberos disponibles para esta sede
              </div>
            )}
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Fecha y hora</h3>
            
            {isLoading ? (
              <div className="text-center py-4">Cargando disponibilidad...</div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Fecha disponible</span>
                    </div>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {availableDates.map(date => {
                      const d = new Date(date);
                      const formattedDate = d.toLocaleDateString('es-ES', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      });
                      
                      return (
                        <div
                          key={date}
                          onClick={() => setFormData({ ...formData, date, hour: "" })}
                          className={`p-2 border rounded text-center cursor-pointer hover:bg-gray-50
                                    ${formData.date === date ? 'bg-blue-50 border-blue-500' : ''}`}
                        >
                          <div className="text-xs uppercase">{formattedDate}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {formData.date && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>Hora disponible</span>
                      </div>
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableHours.map(hour => (
                        <div
                          key={hour}
                          onClick={() => setFormData({ ...formData, hour })}
                          className={`p-2 border rounded text-center cursor-pointer hover:bg-gray-50
                                    ${formData.hour === hour ? 'bg-blue-50 border-blue-500' : ''}`}
                        >
                          {hour}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Notas adicionales (Opcional)</label>
              <textarea
                placeholder="Agrega cualquier nota o solicitud especial"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows="3"
              ></textarea>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Renderizar formulario completo
  return (
    <div className="py-8 bg-gray-100">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reserva tu cita</h2>
        
        {/* Indicador de pasos */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center">
                <div 
                  className={`h-8 w-8 rounded-full flex items-center justify-center
                             ${currentStep >= step 
                               ? 'bg-blue-500 text-white' 
                               : 'bg-gray-200 text-gray-500'}`}
                >
                  {step}
                </div>
                <div className="text-xs mt-1 text-gray-500">
                  {step === 1 && 'Personal'}
                  {step === 2 && 'Servicio'}
                  {step === 3 && 'Barbero'}
                  {step === 4 && 'Fecha/Hora'}
                </div>
              </div>
            ))}
          </div>
          <div className="relative mt-1">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200"></div>
            <div 
              className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-blue-500 transition-all"
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
        
        {/* Mensajes de éxito/error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
            <Check className="h-5 w-5 mr-2" />
            <span>¡Reserva creada con éxito!</span>
          </div>
        )}
        
        {/* Formulario por pasos */}
        <form onSubmit={handleSubmit}>
          {renderStep()}
          
          {/* Botones de navegación */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Anterior
              </button>
            ) : (
              <div></div>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isLoading}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? "Procesando..." : "Confirmar Reserva"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevoFormularioReserva;