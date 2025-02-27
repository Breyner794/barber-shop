import React, { useState, useEffect } from 'react';
import { Search, Check, Edit, Trash, X as XIcon, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import FormularioReserva from './FormularioReserva';

const GestionReservas = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentReservation, setCurrentReservation] = useState(null);
  
  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Datos de ejemplo para las reservas
  const [reservations, setReservations] = useState([
    { id: 1, nombre: 'Juan Pérez', servicio: 'Corte de cabello', fecha: '2025-02-25', hora: '10:00', estado: 'pendiente', telefono: '123-456-7890', notas: 'Primera visita' },
    { id: 2, nombre: 'María López', servicio: 'Manicure', fecha: '2025-02-25', hora: '11:30', estado: 'confirmada', telefono: '234-567-8901', notas: 'nombree frecuente' },
    { id: 3, nombre: 'Carlos Rodríguez', servicio: 'Pedicure', fecha: '2025-02-26', hora: '09:00', estado: 'pendiente', telefono: '345-678-9012', notas: 'Alergia a ciertos productos' },
    { id: 4, nombre: 'Ana García', servicio: 'Tinte de cabello', fecha: '2025-02-26', hora: '14:00', estado: 'completada', telefono: '456-789-0123', notas: 'Prefiere tintes naturales' },
    { id: 5, nombre: 'Roberto Sánchez', servicio: 'Corte de barba', fecha: '2025-02-27', hora: '16:30', estado: 'cancelada', telefono: '567-890-1234', notas: 'Canceló por enfermedad' },
  ]);

  // Filtrar reservas según la búsqueda
  const filteredReservations = reservations.filter(reservation => 
    reservation.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.servicio.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reservation.fecha.includes(searchQuery) ||
    reservation.estado.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para actualizar el estado de una reserva
  const updateReservationStatus = (id, newStatus) => {
    setReservations(
      reservations.map(reservation => 
        reservation.id === id ? { ...reservation, estado: newStatus } : reservation
      )
    );
  };

  // Función para eliminar una reserva
  const deleteReservation = (id) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
    setExpandedCard(null);
  };

  // Obtener el color de fondo según el estado
  const getStatusColor = (estado) => {
    switch(estado) {
      case 'pendiente': return 'bg-yellow-100 text-yellow-800';
      case 'confirmada': return 'bg-blue-100 text-blue-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Alternar la expansión de una tarjeta
  const toggleCardExpansion = (id) => {
    if (expandedCard === id) {
      setExpandedCard(null);
    } else {
      setExpandedCard(id);
    }
  };

  // Abrir formulario para nueva reserva
  const handleNewReservation = () => {
    setCurrentReservation(null); // No reservation data for a new one
    setShowForm(true);
  };

  const handleEditReservation = (id) => {
    const reservationToEdit = reservations.find(res => res.id === id);
    setCurrentReservation(reservationToEdit);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    if (currentReservation) {
      // Actualizar reserva existente
      setReservations(
        reservations.map(reservation => 
          reservation.id === currentReservation.id ? { ...formData, id: currentReservation.id } : reservation
        )
      );
    } else {
      // Crear nueva reserva con ID único
      const newId = Math.max(...reservations.map(res => res.id)) + 1;
      setReservations([...reservations, { ...formData, id: newId }]);
    }
    
    // Cerrar formulario
    setShowForm(false);
    setCurrentReservation(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentReservation(null);
  };

  return (
    <div className="flex-1 overflow-auto">
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium text-gray-800">
                {currentReservation ? "Editar Reserva" : "Nueva Reserva"}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <XIcon size={20} />
              </button>
            </div>

            <div className="p-4">
              <FormularioReserva
                initialData={currentReservation}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 flex items-center justify-between h-16 pr-4 pl-20 bg-white shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestión de Reservas
        </h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar reservas..."
              className="py-2 pl-10 pr-4 text-sm border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={handleNewReservation}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Plus size={16} className="mr-1" />
            Nueva Reserva
          </button>
        </div>
      </header>

      <main className="p-4 md:p-6">
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-medium text-gray-700">
            Reservas Actuales
          </h3>

          {/* Vista de tabla para escritorio*/}
          <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    nombree
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Servicio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Fecha y Hora
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {reservation.nombre}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {reservation.servicio}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-gray-500">
                        {reservation.fecha}, {reservation.hora}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          reservation.estado
                        )}`}
                      >
                        {reservation.estado.charAt(0).toUpperCase() +
                          reservation.estado.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-center whitespace-nowrap">
                      <div className="flex justify-center space-x-2">
                        {reservation.estado !== "confirmada" && (
                          <button
                            onClick={() =>
                              updateReservationStatus(
                                reservation.id,
                                "confirmada"
                              )
                            }
                            className="p-1 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
                            title="Confirmar"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        {reservation.estado !== "completada" && (
                          <button
                            onClick={() =>
                              updateReservationStatus(
                                reservation.id,
                                "completada"
                              )
                            }
                            className="p-1 text-green-600 bg-green-100 rounded-full hover:bg-green-200"
                            title="Completar"
                          >
                            <Check size={16} />
                          </button>
                        )}

                        {reservation.estado !== "cancelada" && (
                          <button
                            onClick={() =>
                              updateReservationStatus(
                                reservation.id,
                                "cancelada"
                              )
                            }
                            className="p-1 text-red-600 bg-red-100 rounded-full hover:bg-red-200"
                            title="Cancelar"
                          >
                            <XIcon size={16} />
                          </button>
                        )}

                        <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditReservation(reservation.id);
                        }}
                          className="p-1 text-indigo-600 bg-indigo-100 rounded-full hover:bg-indigo-200"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          onClick={() => deleteReservation(reservation.id)}
                          className="p-1 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200"
                          title="Eliminar"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReservations.length === 0 && (
              <div className="p-6 text-center text-gray-500">
                No se encontraron reservas que coincidan con la búsqueda.
              </div>
            )}
          </div>

          {/* Vista de tarjetas para móviles */}
          <div className="lg:hidden space-y-3">
            {filteredReservations.length === 0 ? (
              <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">
                No se encontraron reservas que coincidan con la búsqueda.
              </div>
            ) : (
              filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-lg shadow overflow-hidden"
                >
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCardExpansion(reservation.id)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {reservation.nombre}
                      </div>
                      <div className="text-sm text-gray-500">
                        {reservation.fecha}, {reservation.hora}
                      </div>
                      <div className="mt-1">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            reservation.estado
                          )}`}
                        >
                          {reservation.estado.charAt(0).toUpperCase() +
                            reservation.estado.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div>
                      {expandedCard === reservation.id ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </div>

                  {expandedCard === reservation.id && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div>
                          <div className="text-xs text-gray-500">Servicio</div>
                          <div className="text-sm font-medium">
                            {reservation.servicio}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Teléfono</div>
                          <div className="text-sm font-medium">
                            {reservation.telefono}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="text-xs text-gray-500">Notas</div>
                        <div className="text-sm">{reservation.notas}</div>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center">
                        {reservation.estado !== "confirmada" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateReservationStatus(
                                reservation.id,
                                "confirmada"
                              );
                            }}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200"
                          >
                            <Check size={14} className="mr-1" /> Confirmar
                          </button>
                        )}

                        {reservation.estado !== "completada" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateReservationStatus(
                                reservation.id,
                                "completada"
                              );
                            }}
                            className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200"
                          >
                            <Check size={14} className="mr-1" /> Completar
                          </button>
                        )}

                        {reservation.estado !== "cancelada" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateReservationStatus(
                                reservation.id,
                                "cancelada"
                              );
                            }}
                            className="inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200"
                          >
                            <XIcon size={14} className="mr-1" /> Cancelar
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditReservation(reservation.id);
                          }}
                          className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm hover:bg-indigo-200"
                        >
                          <Edit size={14} className="mr-1" /> Editar
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteReservation(reservation.id);
                          }}
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                        >
                          <Trash size={14} className="mr-1" /> Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GestionReservas;