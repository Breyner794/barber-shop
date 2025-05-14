import { useState, useEffect } from 'react';

const MultiFilterBar = ({ data, onFilterChange }) => {
  // Estados para los diferentes filtros
  const [filters, setFilters] = useState({
    estado: [],
    barbero: [],
    servicio: [],
    fecha: '',
  });
  
  // Extraer opciones únicas para cada campo de filtro
  const [filterOptions, setFilterOptions] = useState({
    estado: [],
    barbero: [],
    servicio: [],
  });
  
  // Inicializar las opciones de filtro al cargar el componente
  useEffect(() => {
    if (data && data.length > 0) {
      const estados = [...new Set(data.map(item => item.estado))];
      const barberos = [...new Set(data.map(item => item.barbero))];
      const servicios = [...new Set(data.map(item => item.servicio))];
      
      setFilterOptions({
        estado: estados,
        barbero: barberos,
        servicio: servicios,
      });
    }
  }, [data]);
  
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
    // Filtrar los datos según los criterios seleccionados
    const filteredData = data.filter(item => {
      // Si hay estados seleccionados y el estado del item no está en ellos, filtrar
      if (filters.estado.length > 0 && !filters.estado.includes(item.estado)) {
        return false;
      }
      
      // Si hay barberos seleccionados y el barbero del item no está en ellos, filtrar
      if (filters.barbero.length > 0 && !filters.barbero.includes(item.barbero)) {
        return false;
      }
      
      // Si hay servicios seleccionados y el servicio del item no está en ellos, filtrar
      if (filters.servicio.length > 0 && !filters.servicio.includes(item.servicio)) {
        return false;
      }
      
      // Si hay una fecha seleccionada y la fecha del item no coincide, filtrar
      if (filters.fecha && !item.fecha.includes(filters.fecha)) {
        return false;
      }
      
      return true;
    });
    
    // Notificar al componente padre de los datos filtrados
    onFilterChange(filteredData);
  }, [filters, data]);
  
  // Limpiar todos los filtros
  const clearFilters = () => {
    setFilters({
      estado: [],
      barbero: [],
      servicio: [],
      fecha: '',
    });
  };
  
  return (
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
      
      {/* Mostrar filtros activos y botón para limpiar */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
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
  );
};

// Componente para mostrar los datos filtrados
const FilterableTurnosTable = ({ turnos }) => {
  const [filteredTurnos, setFilteredTurnos] = useState(turnos);
  
  const handleFilterChange = (filteredData) => {
    setFilteredTurnos(filteredData);
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Reservas de Turnos</h2>
      
      {/* Componente de filtros */}
      <MultiFilterBar data={turnos} onFilterChange={handleFilterChange} />
      
      {/* Tabla de turnos */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Nombre</th>
              <th className="py-2 px-4 border-b">Servicio</th>
              <th className="py-2 px-4 border-b">Fecha y Hora</th>
              <th className="py-2 px-4 border-b">Estado</th>
              <th className="py-2 px-4 border-b">Barbero</th>
            </tr>
          </thead>
          <tbody>
            {filteredTurnos.map((turno, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 border-b">{turno.nombre}</td>
                <td className="py-2 px-4 border-b">{turno.servicio}</td>
                <td className="py-2 px-4 border-b">{`${turno.fecha} ${turno.hora}`}</td>
                <td className="py-2 px-4 border-b">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    turno.estado === 'Completado' ? 'bg-green-100 text-green-800' :
                    turno.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' :
                    turno.estado === 'Cancelado' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {turno.estado}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">{turno.barbero}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredTurnos.length === 0 && (
        <div className="text-center p-4 bg-gray-50 mt-4 rounded">
          No se encontraron reservas con los filtros seleccionados.
        </div>
      )}
    </div>
  );
};

// Ejemplo de uso en un componente principal
const TurnosPage = () => {
  // Datos de ejemplo (en una aplicación real, probablemente vendrían de una API)
  const turnosData = [
    { nombre: 'Juan Pérez', servicio: 'Corte de cabello', fecha: '2025-04-17', hora: '10:00', estado: 'Pendiente', barbero: 'Carlos' },
    { nombre: 'María López', servicio: 'Tinte', fecha: '2025-04-17', hora: '11:30', estado: 'Completado', barbero: 'Ana' },
    { nombre: 'Pedro Gómez', servicio: 'Afeitado', fecha: '2025-04-18', hora: '09:15', estado: 'Cancelado', barbero: 'Carlos' },
    { nombre: 'Laura Torres', servicio: 'Corte de cabello', fecha: '2025-04-18', hora: '12:00', estado: 'Pendiente', barbero: 'Miguel' },
    { nombre: 'Roberto Sánchez', servicio: 'Tinte', fecha: '2025-04-19', hora: '15:30', estado: 'Pendiente', barbero: 'Ana' },
    // Añade más datos según sea necesario
  ];
  
  return <FilterableTurnosTable turnos={turnosData} />;
};

export default TurnosPage;