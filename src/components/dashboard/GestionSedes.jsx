import React, { useState } from "react";
import { Search, Plus, Edit, Trash2, MapPin, Clock, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { sedes } from "../../data/sedesData"; // Ajusta la ruta según tu estructura de archivos

const SedesPanel = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar sedes según búsqueda
  const filteredSedes = sedes.filter((sede) => 
    sede.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sede.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Gestión de Sedes</h1>
        
        <Link 
          to="/dashboard/sedes/nueva" 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-2" />
          <span>Nueva Sede</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar sede..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Lista de sedes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSedes.length > 0 ? (
          filteredSedes.map((sede) => (
            <div key={sede.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-xl text-gray-800">{sede.nombre}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">ID: {sede.id}</span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <MapPin size={18} className="text-gray-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">{sede.direccion}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{sede.telefono}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={18} className="text-gray-500 mr-2" />
                    <span className="text-gray-700">{sede.horario_sede}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Link
                    to={`/dashboard/sedes/editar/${sede.id}`}
                    className="px-3 py-2 flex items-center justify-center rounded text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors flex-1"
                  >
                    <Edit size={16} className="mr-2" />
                    <span>Editar</span>
                  </Link>
                  <button
                    className="px-3 py-2 flex items-center justify-center rounded text-red-600 bg-red-50 hover:bg-red-100 transition-colors flex-1"
                    onClick={() => {
                      // Función para eliminar (a implementar)
                      if (window.confirm(`¿Estás seguro de eliminar la sede ${sede.nombre}?`)) {
                        console.log("Eliminando sede:", sede.id);
                      }
                    }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No se encontraron sedes con los criterios actuales.
          </div>
        )}
      </div>
    </div>
  );
};

export default SedesPanel;