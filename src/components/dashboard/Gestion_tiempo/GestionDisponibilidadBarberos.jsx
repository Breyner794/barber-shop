import { useState, useEffect } from "react";
import { Calendar, Clock, Trash2, Save, Plus, X } from "lucide-react";
import { getAllBarbers } from "../../../services/barberClient";

const GestionDisponibilidadBarberos = () => {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [schedules, setSchedules] = useState([]);
  const [newScheduleStart, setNewScheduleStart] = useState("09:00");
  const [newScheduleEnd, setNewScheduleEnd] = useState("10:00");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Cargar barberos al inicio
  useEffect(() => {
    const loadBarbers = async () => {
      try {
        setIsLoading(true);
        // Aquí llamarías a tu API para obtener los barberos
        // Por ahora usamos datos de ejemplo
        const response = await getAllBarbers();
        const data = Array.isArray(response)?response:response.data || [];

        setBarbers(data);
      } catch (err) {
        setError("Error al cargar barberos");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBarbers();
  }, []);

  // Cargar horarios cuando se selecciona un barbero y una fecha
  useEffect(() => {
    const loadSchedules = async () => {
      if (!selectedBarber || !selectedDate) return;
      
      try {
        setIsLoading(true);
        // Aquí llamarías a tu API para obtener los horarios
        // Por ahora usamos datos de ejemplo
        setTimeout(() => {
          const sampleSchedules = [
            { _id: "1", start: "09:00", end: "10:00" },
            { _id: "2", start: "11:00", end: "12:00" },
            { _id: "3", start: "16:00", end: "17:00" }
          ];
          setSchedules(sampleSchedules);
          setIsLoading(false);
        }, 500);
      } catch (err) {
        setError("Error al cargar horarios");
        setIsLoading(false);
      }
    };
    
    loadSchedules();
  }, [selectedBarber, selectedDate]);

  // Generar días del mes seleccionado
  const getDaysInMonth = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // Formato de fecha para la API
  const formatDateForAPI = (day) => {
    return `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  // Seleccionar un día
  const handleSelectDay = (day) => {
    const formattedDate = formatDateForAPI(day);
    setSelectedDate(formattedDate);
  };

  // Agregar un nuevo horario
  const handleAddSchedule = async () => {
    if (!selectedBarber || !selectedDate) {
      setError("Debes seleccionar un barbero y una fecha");
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simular llamada a la API para guardar el horario
      // Aquí harías la llamada real a tu backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actualizar la UI optimistamente
      const newSchedule = {
        _id: `temp-${Date.now()}`,
        start: newScheduleStart,
        end: newScheduleEnd
      };
      
      setSchedules([...schedules, newSchedule]);
      setNewScheduleStart("09:00");
      setNewScheduleEnd("10:00");
      
      setSuccess("Horario agregado correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al agregar horario");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar un horario
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      setIsLoading(true);
      
      // Simular llamada a la API para eliminar
      // Aquí harías la llamada real a tu backend
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Actualizar la UI optimistamente
      setSchedules(schedules.filter(s => s._id !== scheduleId));
      
      setSuccess("Horario eliminado correctamente");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Error al eliminar horario");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar mes
  const changeMonth = (increment) => {
    let newMonth = selectedMonth + increment;
    let newYear = selectedYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    setSelectedDate("");
  };

  // Nombre del mes actual
  const currentMonthName = new Date(selectedYear, selectedMonth).toLocaleString('es-ES', { month: 'long' });

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Gestión de Disponibilidad</h2>
      
      {/* Selector de barbero */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Selecciona un barbero</label>
        <select
          value={selectedBarber}
          onChange={(e) => {
            setSelectedBarber(e.target.value);
            setSelectedDate("");
          }}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        >
          <option value="">-- Selecciona un barbero --</option>
          {barbers.map(barber => (
            <option key={barber._id} value={barber._id}>{barber.name_barber}</option>
          ))}
        </select>
      </div>
      
      {/* Calendario */}
      {selectedBarber && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <button 
              onClick={() => changeMonth(-1)}
              className="p-1 rounded hover:bg-gray-100"
              type="button"
            >
              ← Anterior
            </button>
            <h3 className="text-lg font-medium capitalize">
              {currentMonthName} {selectedYear}
            </h3>
            <button 
              onClick={() => changeMonth(1)}
              className="p-1 rounded hover:bg-gray-100"
              type="button"
            >
              Siguiente →
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-gray-500">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {/* Espacios en blanco para el primer día del mes */}
            {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="h-10"></div>
            ))}
            
            {/* Días del mes */}
            {getDaysInMonth().map(day => {
              const date = formatDateForAPI(day);
              const isSelected = date === selectedDate;
              const isToday = new Date().toISOString().split('T')[0] === date;
              
              return (
                <div
                  key={`day-${day}`}
                  onClick={() => handleSelectDay(day)}
                  className={`h-10 flex items-center justify-center rounded cursor-pointer
                            ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}
                            ${isToday && !isSelected ? 'border border-blue-500' : ''}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Gestión de horarios para el día seleccionado */}
      {selectedDate && (
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium mb-4">
            Horarios para {new Date(selectedDate).toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          
          {/* Lista de horarios existentes */}
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Horarios configurados:</h4>
            {schedules.length > 0 ? (
              <div className="space-y-2">
                {schedules.map(schedule => (
                  <div 
                    key={schedule._id} 
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{schedule.start} - {schedule.end}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(schedule._id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                      disabled={isLoading}
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay horarios configurados para este día.</p>
            )}
          </div>
          
          {/* Agregar nuevo horario */}
          <div className="p-3 bg-gray-50 rounded mb-4">
            <h4 className="text-sm font-medium mb-2">Agregar nuevo horario:</h4>
            <div className="flex flex-wrap items-end gap-2">
              <div>
                <label className="block text-xs mb-1">Hora inicio</label>
                <input
                  type="time"
                  value={newScheduleStart}
                  onChange={(e) => setNewScheduleStart(e.target.value)}
                  className="p-1 border rounded"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-xs mb-1">Hora fin</label>
                <input
                  type="time"
                  value={newScheduleEnd}
                  onChange={(e) => setNewScheduleEnd(e.target.value)}
                  className="p-1 border rounded"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleAddSchedule}
                className="flex items-center px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={isLoading}
                type="button"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mensajes de error/éxito */}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md flex items-center mt-4">
          <X className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 text-green-700 rounded-md flex items-center mt-4">
          <Check className="h-5 w-5 mr-2" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};

export default GestionDisponibilidadBarberos;