import React from "react";

const BarberosForm = ({ formData, setFormData, barberos, selectedBarber, setSelectedBarber }) => {
  // Filtramos los barberos por sede
  const barberosFiltrados = barberos.filter(
    (barbero) => barbero.sede === parseInt(formData.sede)
  );

  if (!formData.sede) return null;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Selecciona tu barbero
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {barberosFiltrados.map((barbero) => (
          <div
            key={barbero.id}
            className={`
              bg-white 
              rounded-xl 
              shadow-md 
              overflow-hidden 
              cursor-pointer 
              transition-all 
              duration-200
              transform
              hover:scale-105
              hover:shadow-lg
              ${selectedBarber?.id === barbero.id ? "ring-2 ring-blue-500 bg-blue-50" : ""}
            `}
            onClick={() => {
              setSelectedBarber(barbero);
              setFormData({ ...formData, barbero: barbero.id });
            }}
          >
            <div className="p-4">
              <div className="flex flex-col items-center">
                <img
                  src={barbero.imageUrl}
                  alt={`Foto barbero ${barbero.nombre}`}
                  className="w-16 h-16 rounded-full mb-2 object-cover border-2 border-gray-200"
                />
                <h3 className="text-sm font-semibold text-center text-gray-800">
                  {barbero.nombre}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Sede {barbero.sede === 1 ? "Compartir" : "Valle Grande"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de selección */}
      {selectedBarber && (
        <div className="mt-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Barbero seleccionado:
            </p>
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={selectedBarber.imageUrl}
                  alt={`Foto de ${selectedBarber.nombre}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {selectedBarber.nombre}
                </p>
                <p className="text-xs text-gray-500">
                  Sede {selectedBarber.sede === 1 ? "Compartir" : "Valle Grande"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarberosForm;