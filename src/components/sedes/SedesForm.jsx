import React from "react";

const SedesForm = ({ formData, setFormData, sedes, setSelectSede, selectSede }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">Sede</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {sedes.map((sede) => (
          <div
            key={sede.id}
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
              ${selectSede?.id === sede.id ? "ring-2 ring-blue-500 bg-blue-50" : ""}
            `}
            onClick={() => {
              setSelectSede(sede);
              setFormData({ ...formData, sede: sede.id, barbero: "" }); // Resetear barbero al cambiar de sede
            }}
          >
            <div className="p-4">
              <div className="flex flex-col items-center">
                <h3 className="text-sm font-semibold text-center text-gray-800">
                  {sede.nombre}
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