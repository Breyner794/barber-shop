import { useState, useEffect } from 'react';
import { services } from "../../data/servicesData";
import { barberos } from "../../data/barberosData";
import { sedes } from "../../data/sedesData";

const ReservasDashboard = () => {
  // Estados para manejar las reservas y formularios
  const [reservas, setReservas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('pendientes');

  // Estado para el formulario
  const [formData, setFormData] = useState({
    id: null,
    nombre: "",
    telefono: "",
    email: "",
    fecha: "",
    hora: "",
    servicio: "",
    sede: "",
    barbero: "",
    estado: "pendiente",
    notas: ""
  });

  // Datos de ejemplo (reemplazar con llamadas a API)
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      const demoData = [
        {
          id: 1,
          nombre: "Carlos Rodríguez",
          telefono: "555-123-4567",
          email: "carlos@example.com",
          fecha: "2025-02-25",
          hora: "14:30",
          servicio: "corte-clasico",
          sede: 1,
          barbero: 1,
          estado: "confirmada",
          notas: "Cliente frecuente"
        },
        {
          id: 2,
          nombre: "Ana López",
          telefono: "555-987-6543",
          email: "ana@example.com",
          fecha: "2025-02-25",
          hora: "16:00",
          servicio: "corte-fade",
          sede: 2,
          barbero: 3,
          estado: "pendiente",
          notas: ""
        },
        {
          id: 3,
          nombre: "Juan Pérez",
          telefono: "555-456-7890",
          email: "juan@example.com",
          fecha: "2025-02-26",
          hora: "10:15",
          servicio: "barba",
          sede: 1,
          barbero: 2,
          estado: "cancelada",
          notas: "Canceló por emergencia"
        }
      ];
      setReservas(demoData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrar reservas basado en búsqueda, fecha y estado
  const filteredReservas = reservas.filter(reserva => {
    const matchesSearch = 
      reserva.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
      reserva.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reserva.telefono.includes(searchTerm);
    
    const matchesTab = activeTab === 'todas' || reserva.estado === activeTab;
    
    const reservaDate = new Date(reserva.fecha);
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const reservaDateStr = reservaDate.toISOString().split('T')[0];
    
    const matchesDate = selectedDateStr === reservaDateStr;
    
    return matchesSearch && matchesTab && matchesDate;
  });

  // Manejadores de eventos
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingId) {
      // Actualizar reserva existente
      setReservas(prevReservas => 
        prevReservas.map(res => 
          res.id === editingId ? { ...formData, id: editingId } : res
        )
      );
    } else {
      // Crear nueva reserva
      const newReserva = {
        ...formData,
        id: Date.now() // ID temporal (reemplazar con ID del backend)
      };
      setReservas(prev => [...prev, newReserva]);
    }
    
    // Resetear el formulario
    resetForm();
  };

  const handleEdit = (id) => {
    const reservaToEdit = reservas.find(res => res.id === id);
    if (reservaToEdit) {
      setFormData(reservaToEdit);
      setEditingId(id);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta reserva?')) {
      setReservas(prev => prev.filter(res => res.id !== id));
    }
  };

  const handleChangeStatus = (id, newStatus) => {
    setReservas(prevReservas => 
      prevReservas.map(res => 
        res.id === id ? { ...res, estado: newStatus } : res
      )
    );
  };

  const resetForm = () => {
    setFormData({
      id: null,
      nombre: "",
      telefono: "",
      email: "",
      fecha: "",
      hora: "",
      servicio: "",
      sede: "",
      barbero: "",
      estado: "pendiente",
      notas: ""
    });
    setEditingId(null);
    setShowForm(false);
  };

  // Helpers para renderizar datos
  const getServiceInfo = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service || { title: 'Desconocido', price: '?', icon: '?' };
  };

  const getBarberInfo = (barberId) => {
    const barbero = barberos.find(b => b.id === parseInt(barberId));
    return barbero || { nombre: 'Desconocido', sede: '' };
  };

  const getSedeInfo = (sedeId) => {
    const sede = sedes.find(s => s.id === parseInt(sedeId));
    return sede ? sede.nombre : 'Desconocida';
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'confirmada': return 'bg-green-100 text-green-800';
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      case 'completada': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'confirmada': return 'Confirmada';
      case 'pendiente': return 'Pendiente';
      case 'cancelada': return 'Cancelada';
      case 'completada': return 'Completada';
      default: return status;
    }
  };

  // Filtrar barberos por sede seleccionada
  const barberosFiltrados = barberos.filter(
    (barbero) => !formData.sede || barbero.sede === parseInt(formData.sede)
  );

  // Formatear fecha para input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h1>
          <div className="flex gap-2">
            <input
              type="date"
              value={formatDateForInput(selectedDate.toISOString())}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
            />
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-barber-accent text-white rounded-md hover:bg-red-700 transition-colors"
            >
              {showForm ? 'Cancelar' : 'Nueva Reserva'}
            </button>
          </div>
        </div>

        {/* Tabs para filtrar por estado */}
        <div className="mb-6 border-b">
          <div className="flex flex-wrap justify-center mb-8 gap-2 space-x-4">
            <button
              onClick={() => setActiveTab('pendientes')}
              className={`pb-2 px-1 ${
                activeTab === 'pendientes'
                  ? 'border-b-2 border-barber-accent text-barber-accent font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setActiveTab('confirmadas')}
              className={`pb-2 px-1 ${
                activeTab === 'confirmadas'
                  ? 'border-b-2 border-barber-accent text-barber-accent font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Confirmadas
            </button>
            <button
              onClick={() => setActiveTab('completadas')}
              className={`pb-2 px-1 ${
                activeTab === 'completadas'
                  ? 'border-b-2 border-barber-accent text-barber-accent font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Completadas
            </button>
            <button
              onClick={() => setActiveTab('canceladas')}
              className={`pb-2 px-1 ${
                activeTab === 'canceladas'
                  ? 'border-b-2 border-barber-accent text-barber-accent font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Canceladas
            </button>
            <button
              onClick={() => setActiveTab('todas')}
              className={`pb-2 px-1 ${
                activeTab === 'todas'
                  ? 'border-b-2 border-barber-accent text-barber-accent font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todas
            </button>
          </div>
        </div>

        {/* Formulario de Reserva */}
        {showForm && (
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Editar Reserva' : 'Nueva Reserva'}
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Servicio
                </label>
                <select
                  name="servicio"
                  value={formData.servicio}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                >
                  <option value="">Seleccionar servicio</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.title} - {service.price}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  name="hora"
                  value={formData.hora}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sede
                </label>
                <select
                  name="sede"
                  value={formData.sede}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                >
                  <option value="">Seleccionar sede</option>
                  {sedes.map((sede) => (
                    <option key={sede.id} value={sede.id}>
                      {sede.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Barbero
                </label>
                <select
                  name="barbero"
                  value={formData.barbero}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                >
                  <option value="">Seleccionar barbero</option>
                  {barberosFiltrados.map((barbero) => (
                    <option key={barbero.id} value={barbero.id}>
                      {barbero.nombre} ({getSedeInfo(barbero.sede)})
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notas
                </label>
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
                ></textarea>
              </div>
              
              <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-barber-accent text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Buscador */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, teléfono o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-barber-accent"
          />
        </div>

        {/* Lista de Reservas */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-barber-accent"></div>
            <p className="mt-2 text-gray-600">Cargando reservas...</p>
          </div>
        ) : filteredReservas.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No se encontraron reservas para la fecha y filtros seleccionados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Cliente</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Servicio</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Barbero/Sede</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Hora</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Estado</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReservas.map((reserva) => {
                  const serviceInfo = getServiceInfo(reserva.servicio);
                  const barberInfo = getBarberInfo(reserva.barbero);
                  
                  return (
                    <tr key={reserva.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">{reserva.nombre}</div>
                        <div className="text-sm text-gray-500">{reserva.telefono}</div>
                        <div className="text-sm text-gray-500">{reserva.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <span className="text-xl mr-2">{serviceInfo.icon}</span>
                          <div>
                            <div className="font-medium">{serviceInfo.title}</div>
                            <div className="text-barber-accent">{serviceInfo.price}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium">{barberInfo.nombre}</div>
                        <div className="text-sm text-gray-500">{getSedeInfo(reserva.sede)}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-gray-900">{reserva.hora}</div>
                        {reserva.notas && (
                          <div className="text-xs text-gray-500 mt-1">
                            Nota: {reserva.notas.length > 20 ? `${reserva.notas.substring(0, 20)}...` : reserva.notas}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(reserva.estado)}`}>
                          {getStatusText(reserva.estado)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex justify-end items-center space-x-2">
                          {reserva.estado === 'pendiente' && (
                            <button
                              onClick={() => handleChangeStatus(reserva.id, 'confirmada')}
                              className="text-green-600 hover:text-green-800"
                              title="Confirmar"
                            >
                              ✓
                            </button>
                          )}
                          {(reserva.estado === 'pendiente' || reserva.estado === 'confirmada') && (
                            <button
                              onClick={() => handleChangeStatus(reserva.id, 'completada')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Marcar como completada"
                            >
                              ★
                            </button>
                          )}
                          {reserva.estado !== 'cancelada' && (
                            <button
                              onClick={() => handleChangeStatus(reserva.id, 'cancelada')}
                              className="text-red-600 hover:text-red-800"
                              title="Cancelar"
                            >
                              ✕
                            </button>
                          )}
                          <button
                            onClick={() => handleEdit(reserva.id)}
                            className="text-gray-600 hover:text-gray-800"
                            title="Editar"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => handleDelete(reserva.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Eliminar"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservasDashboard;