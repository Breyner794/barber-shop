import React from "react";
import { useSede } from "../../context/SedeContext";

const SedesForm = ({ formData, setFormData, setSelectSede, selectSede, setSelectedBarber }) => {

  const { sites, loading, error } = useSede();

  if (loading) return <p>Cargando sedes...</p>;
  if (error) return <p>Error al cargar sedes: {error}</p>;

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">Sede</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {sites.map((site) => (
          <div
            key={site._id}
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
              ${selectSede?._id === site._id ? "ring-2 ring-blue-500 bg-blue-50" : ""}
            `}
            onClick={() => {
              setSelectSede(site);
              setFormData({ ...formData, site: site._id, barbero: "" }); // Resetear barbero al cambiar de sede
              setSelectedBarber(null); // Resetear la selección de barbero
            }}
          >
            <div className="p-4">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-center text-gray-800">
                  {site.name_site} - {site.headquarter_time}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SedesForm;