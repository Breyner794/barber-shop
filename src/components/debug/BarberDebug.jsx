// components/BarberDebug.jsx
import React, { useState, useEffect } from 'react';
import { useBarbers } from '../../context/BarberContext';

// Componente para depurar problemas con barberos y sedes
const BarberDebug = () => {
  const { barber, sites, loading, error, getBarbersBySite } = useBarbers();
  const [selectedSite, setSelectedSite] = useState('');
  const [filteredBarbers, setFilteredBarbers] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});

  // Cuando cambia la sede seleccionada
  useEffect(() => {
    const loadBarbers = async () => {
      if (!selectedSite) return;
      
      try {
        const barbers = await getBarbersBySite(selectedSite);
        setFilteredBarbers(barbers);
        
        // Información de depuración
        setDebugInfo({
          siteIdType: typeof selectedSite,
          siteIdValue: selectedSite,
          totalBarbers: barber.length,
          filteredCount: barbers.length,
          allBarberSites: barber.map(b => ({
            id: b.id,
            site: b.site,
            site_barber: b.site_barber
          }))
        });
      } catch (err) {
        console.error("Error al filtrar barberos:", err);
      }
    };
    
    loadBarbers();
  }, [selectedSite, getBarbersBySite]);

  if (loading) return <div className="p-4">Cargando datos...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Depurador de Barberos</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Seleccionar Sede</label>
        <select
          value={selectedSite}
          onChange={(e) => setSelectedSite(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Seleccione una sede</option>
          {sites.map((site) => (
            <option key={site.id || site._id} value={site.id || site._id}>
              {site.nombre || site.name} - ID: {site.id || site._id}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Barberos filtrados ({filteredBarbers.length})</h3>
        {filteredBarbers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBarbers.map((barber) => (
              <div key={barber._id} className="border p-3 rounded">
                <p><strong>Nombre:</strong> {barber.name}</p>
                <p><strong>ID:</strong> {barber._id}</p>
                <p><strong>Experiencia:</strong> {barber.experience}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-orange-500">No se encontraron barberos para esta sede</p>
        )}
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Información de Depuración</h3>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4 bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Todas las Sedes</h3>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(sites, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4 bg-gray-50 p-4 rounded">
        <h3 className="text-lg font-semibold mb-2">Todos los Barberos</h3>
        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(barber, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default BarberDebug;