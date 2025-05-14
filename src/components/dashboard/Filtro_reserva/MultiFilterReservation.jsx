import React, { useState, useEffect } from 'react';
import { useReservations } from '../../../context/ReservaContext';

const ReservationFilters = () => {
  const { reservations, loading } = useReservations();
  const [filteredReservations, setFilteredReservations] = useState([]);
  
  // Estados para los diferentes filtros
  const [filters, setFilters] = useState({
    estado: [],
    barbero: [],
    servicio: [],
    fecha: '',
  });
  
  // Opciones disponibles para los filtros (extraídos de los datos)
  const [filterOptions, setFilterOptions] = useState({
    estado: [],
    barbero: [],
    servicio: [],
  });
  
  // Inicializar las opciones de filtro cuando los datos están disponibles
  useEffect(() => {
    if (reservations && reservations.length > 0) {
      const estados = [...new Set(reservations.map(item => item.estado))];
      const barberos = [...new Set(reservations.map(item => item.barbero))];
      const servicios = [...new Set(reservations.map(item => item.servicio))];
      
      setFilterOptions({
        estado: estados,
        barbero: barberos,
        servicio: servicios,
      });
      
      // Inicialmente, mostrar todas las reservas
      setFilteredReservations(reservations);
    }
  }, [reservations]);
  
  // Manejar cambios en los filtros de selección múltiple
  const handleMultiSelectChange = (field, value) => {
    const currentValues = [...filters[field]];
    
    if (currentValues.includes(value)) {
      // Si ya está seleccionado, lo quitamos
      const updatedValues = currentValues.filter(item => item !== value);
      setFilters(prev => ({ ...prev, [field]: updatedValues }));
    } else {
      // Si no está seleccionado, lo añadimos
      setFilters(prev => ({ ...prev, [field]: [...currentValues, value] }));
    }
  };
  
  // Manejar cambios en el filtro de fecha
  const handleDateChange = (e) => {
    setFilters(prev => ({ ...prev, fecha: e.target.value }));
  };
  
  // Aplicar filtros cuando cambian
  useEffect(() => {
    if (!reservations) return;
    
    const filtered = reservations.filter(item => {
      // Filtrar por estado
      if (filters.estado.length > 0 && !filters.estado.includes(item.estado)) {
        return false;
      }
      
      // Filtrar por barbero
      if (filters.barbero.length > 0 && !filters.barbero.includes(item.barbero)) {
        return false;
      }
      
      // Filtrar por servicio
      if (filters.servicio.length > 0 && !filters.servicio.includes(item.servicio)) {
        return false;
      }
      
      // Filtrar por fecha
      if (filters.fecha && !item.fecha?.includes(filters.fecha)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredReservations(filtered);
  }, [filters, reservations]);
  
  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      estado: [],
      barbero: [],
      servicio: [],
      fecha: '',
    });
  };
  
  if (loading) {
    return <div className="text-center p-4">Cargando reservas...</div>;
  }
  
  return (
    <div className="reservation-system">
      {/* Sección de Filtros */}
      <div className="filter-container p-4 bg-gray-100 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-3">Filtros</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por Estado */}
          <div className="filter-group">
            <h4 className="text-sm font-medium mb-2">Estado</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.estado.map(estado => (
                <button
                  key={estado}
                  onClick={() => handleMultiSelectChange('estado', estado)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filters.estado.includes(estado)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {estado}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filtro por Barbero */}
          <div className="filter-group">
            <h4 className="text-sm font-medium mb-2">Barbero</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.barbero.map(barbero => (
                <button
                  key={barbero}
                  onClick={() => handleMultiSelectChange('barbero', barbero)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filters.barbero.includes(barbero)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {barbero}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filtro por Servicio */}
          <div className="filter-group">
            <h4 className="text-sm font-medium mb-2">Servicio</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions.servicio.map(servicio => (
                <button
                  key={servicio}
                  onClick={() => handleMultiSelectChange('servicio', servicio)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    filters.servicio.includes(servicio)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {servicio}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filtro por Fecha */}
          <div className="filter-group">
            <h4 className="text-sm font-medium mb-2">Fecha</h4>
            <input
              type="date"
              value={filters.fecha}
              onChange={handleDateChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
        
        {/* Filtros activos y botón para limpiar */}
        <div className="mt-4 flex flex-wrap items-center justify-between">
          <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
            {filters.estado.length > 0 && (
              <div className="active-filter bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">
                Estados: {filters.estado.join(', ')}
              </div>
            )}
            {filters.barbero.length > 0 && (
              <div className="active-filter bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">
                Barberos: {filters.barbero.join(', ')}
              </div>
            )}
            {filters.servicio.length > 0 && (
              <div className="active-filter bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">
                Servicios: {filters.servicio.join(', ')}
              </div>
            )}
            {filters.fecha && (
              <div className="active-filter bg-blue-100 text-blue-800 text-xs py-1 px-2 rounded-full">
                Fecha: {filters.fecha}
              </div>
            )}
          </div>
          
          <button
            onClick={clearFilters}
            className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded"
          >
            Limpiar filtros
          </button>
        </div>
      </div>
      
      {/* Tabla de Reservas */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Servicio</th>
              <th className="py-2 px-4 border-b">Fecha y Hora</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b">Barbero</th>
              <th className="py-2 px-4 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((reservation) => (
                <tr key={reservation._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{reservation.cliente?.nombre || 'N/A'}</td>
                  <td className="py-2 px-4 border-b">{reservation.servicio}</td>
                  <td className="py-2 px-4 border-b">{`${reservation.fecha} ${reservation.hora}`}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      reservation.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                      reservation.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {reservation.estado}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">{reservation.barbero}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex space-x-2">
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">
                        Editar
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center">
                  No se encontraron reservas con los filtros seleccionados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReservationFilters;