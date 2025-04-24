import React, { useState } from "react";
import { Check, Edit, Trash, X as XIcon, Plus, X, Save } from "lucide-react";
import Swal from "sweetalert2";
import { useReservations } from "../../context/ReservaContext";
import { useServices } from "../../context/ServicesContext";
import { useBarbers } from "../../context/BarberContext";
import { useSede } from "../../context/SedeContext";

const GestionReservas = () => {
  const {
    reservations,
    loading,
    removeReservation,
    updateReservations,
    updateReservationsState,
    addReservation,
    autoRefresh,
    toggleAutoRefresh,
    refreshing,
  } = useReservations();
  const [currentReservation, setCurrentReservation] = useState(null);
  const [editingReservation, setEditingReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const { services } = useServices();
  const { barber } = useBarbers();
  const { sites } = useSede();

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditingReservation((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      { key: "name", label: "Nombre completo" },
      { key: "phone", label: "Teléfono" },
      { key: "service", label: "Servicio" },
      { key: "site", label: "Sede" },
      { key: "date", label: "Fecha" },
      { key: "hour", label: "Hora" },
    ];

    for (const field of requiredFields) {
      if (!editingReservation[field.key]) {
        return `El campo ${field.label} es obligatorio`;
      }
    }
    return null;
  };

  const saveChanges = async () => {
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitError(null);

    try {
      if (editingReservation._id) {
        // Actualizar reserva existente
        await updateReservations(editingReservation._id, editingReservation);
        await Swal.fire({
          icon: "success",
          title: "Reserva Actualizada Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await addReservation(editingReservation);
        await Swal.fire({
          icon: "success",
          title: "Reserva Creada Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving reservation:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `¡Algo salió mal! ${error}`,
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  // Modificar tus funciones de edición/creación
  const handleEditReservation = (id) => {
    const reservationToEdit = reservations.find((res) => res._id === id);
    setEditingReservation({ ...reservationToEdit });
    setIsModalOpen(true);
  };

  const handleNewReservation = () => {
    const newReservation = {
      name: "",
      phone: "",
      email: "",
      service: "",
      site: "",
      barber: "",
      date: "",
      hour: "",
      state: "pendiente",
      notes: "",
    };
    setEditingReservation(newReservation);
    setIsModalOpen(true);
  };

  const updateReservationStatus = async (id, newStatus) => {
    try {
      // Asumiendo que updateResevation toma ID y un objeto de datos
      await updateReservationsState(id, { state: newStatus });

      // Podrías querer mostrar un feedback de éxito al usuario
      Swal.fire({
        title: "¡Actualizado!",
        text: "El estado de la reserva ha sido actualizado.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el estado de la reserva.",
        icon: "error",
        confirmButtonColor: "#d33", // Color rojo para errores
        confirmButtonText: "OK",
      });
    }
  };

  // Función para eliminar una reserva
  const deleteReservations = async (id) => {
    try {
      const result = await Swal.fire({
        title: "¿Estás seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, elimínalo!",
      });
      if (result.isConfirmed) {
        await removeReservation(id);
        Swal.fire({
          title: "¡Eliminado!",
          text: "La Reserva ha sido eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error al eliminar la reserva:", error);
      // Puedes mostrar un mensaje de error al usuario aquí
    }
  };

  // Obtener el color de fondo según el estado
  const getStatusColor = (state) => {
    switch (state) {
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "confirmada":
        return "bg-blue-100 text-blue-800";
      case "completada":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && reservations.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        Cargando Reservas...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-2xl font-bold">
                {currentReservation ? "Editar Reserva" : "Nueva Reserva"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                <X />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre Completo *</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingReservation?.name || ""}
                  onChange={(e) => handleInputChange(e, "name")}
                  placeholder="Nombre del cliente"
                />
              </div>

              <div>
                <label className="block mb-2">Teléfono *</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingReservation?.phone || ""}
                  onChange={(e) => handleInputChange(e, "phone")}
                  placeholder="Número de teléfono"
                />
              </div>

              <div>
                <label className="block mb-2">Correo Electrónico</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingReservation?.email || ""}
                  onChange={(e) => handleInputChange(e, "email")}
                  placeholder="Email del cliente"
                />
              </div>

              <div>
                <label className="block mb-2">Servicio *</label>
                <select
                  className="w-full border rounded p-2"
                  value={editingReservation?.service || ""}
                  onChange={(e) => handleInputChange(e, "service")}
                >
                  <option value="">Selecciona un servicio</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Sede *</label>
                <select
                  className="w-full border rounded p-2"
                  value={editingReservation?.site || ""}
                  onChange={(e) => handleInputChange(e, "site")}
                >
                  <option value="">Selecciona una sede</option>
                  {sites.map((site) => (
                    <option key={site._id} value={site._id}>
                      {site.name_site}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Barbero</label>
                <select
                  className="w-full border rounded p-2"
                  value={editingReservation?.barber || ""}
                  onChange={(e) => handleInputChange(e, "barber")}
                >
                  <option value="">Selecciona un barbero</option>
                  {barber.map((barber) => (
                    <option key={barber._id} value={barber._id}>
                      {barber.nombre} {barber.apellido}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Fecha *</label>
                <input
                  type="date"
                  className="w-full border rounded p-2"
                  value={editingReservation?.date || ""}
                  onChange={(e) => handleInputChange(e, "date")}
                />
              </div>

              <div>
                <label className="block mb-2">Hora *</label>
                <input
                  type="time"
                  className="w-full border rounded p-2"
                  value={editingReservation?.hour || ""}
                  onChange={(e) => handleInputChange(e, "hour")}
                />
              </div>

              <div>
                <label className="block mb-2">Estado</label>
                <select
                  className="w-full border rounded p-2"
                  value={editingReservation?.state || "pendiente"}
                  onChange={(e) => handleInputChange(e, "state")}
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block mb-2">Notas</label>
                <textarea
                  className="w-full border rounded p-2"
                  value={editingReservation?.notes || ""}
                  onChange={(e) => handleInputChange(e, "notes")}
                  placeholder="Notas adicionales"
                  rows="3"
                ></textarea>
              </div>

              {submitError && (
                <div className="bg-red-50 p-4 rounded-md mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error al guardar la reserva
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{submitError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                <X className="mr-2" /> Cancelar
              </button>
              <button
                onClick={saveChanges}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                <Save className="mr-2" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODIFICADO: Actualizado el header para incluir indicador de auto-refresco */}
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 pr-4 pl-20 bg-white shadow-md">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestión de Reservas
          {refreshing && (
            <span className="ml-2 text-xs font-normal text-blue-500">
              Actualizando...
            </span>
          )}
        </h2>
        <div className="flex items-center space-x-3">
          {/* NUEVO: Botón para controlar auto-refresco */}
          <button
            onClick={toggleAutoRefresh}
            className={`text-xs px-2 py-1 rounded ${
              autoRefresh
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {autoRefresh
              ? "Auto-refresco: Activado"
              : "Auto-refresco: Desactivado"}
          </button>
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

          {/* Vista de tabla para escritorio */}
          <div className="hidden lg:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Cliente
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Contacto
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Servicio
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Barbero
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                  >
                    Fecha/Hora
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
                  >
                    Estado
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase"
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No se encontraron reservas.
                    </td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr
                      key={reservation._id}
                      className={`hover:bg-gray-50 ${
                        reservation.state === "cancelada"
                          ? "bg-red-50"
                          : reservation.state === "completada"
                          ? "bg-green-50"
                          : reservation.state === "confirmada"
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">
                          {reservation.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500">
                          {reservation.phone}
                        </div>
                        <div className="text-xs text-gray-400">
                          {reservation.email || "No contiene correo"}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-500">
                          {reservation.service?.title || "No especificado"}
                          {reservation.service?.price && (
                            <span className="ml-1 text-xs font-semibold">
                              ${reservation.service.price}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {reservation.barber?.imageUrl && (
                            <img
                              src={reservation.barber.imageUrl}
                              alt=""
                              className="w-6 h-6 rounded-full mr-2"
                            />
                          )}
                          <span className="text-sm text-gray-500">
                            {reservation.barber?.name_barber
                              ? `${reservation.barber.name_barber} ${reservation.barber.last_name_barber}`
                              : "Sin asignar"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(reservation.date).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {reservation.hour}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            reservation.state
                          )}`}
                        >
                          {reservation.state}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center space-x-1">
                          {reservation.state !== "completada" &&
                            reservation.state !== "cancelada" && (
                              <div className="flex space-x-1">
                                <button
                                  onClick={() =>
                                    updateReservationStatus(
                                      reservation._id,
                                      "confirmada"
                                    )
                                  }
                                  className="p-1 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                                  title="Confirmar"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    updateReservationStatus(
                                      reservation._id,
                                      "completada"
                                    )
                                  }
                                  className="p-1 text-green-600 bg-green-100 rounded-md hover:bg-green-200"
                                  title="Completar"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() =>
                                    updateReservationStatus(
                                      reservation._id,
                                      "cancelada"
                                    )
                                  }
                                  className="p-1 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                                  title="Cancelar"
                                >
                                  <XIcon size={16} />
                                </button>
                              </div>
                            )}
                          <button
                            onClick={() =>
                              handleEditReservation(reservation._id)
                            }
                            className="p-1 text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200"
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => deleteReservations(reservation._id)}
                            className="p-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                            title="Eliminar"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Vista de tarjetas para móviles */}
          <div className="lg:hidden space-y-3">
            {reservations.length === 0 ? (
              <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">
                No se encontraron reservas.
              </div>
            ) : (
              reservations.map((reservation) => (
                <div
                  key={reservation._id}
                  className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${
                    reservation.state === "cancelada"
                      ? "border-red-500"
                      : reservation.state === "completada"
                      ? "border-green-500"
                      : reservation.state === "confirmada"
                      ? "border-blue-500"
                      : "border-yellow-500"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">
                          {reservation.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {reservation.phone}
                        </p>
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          reservation.state
                        )}`}
                      >
                        {reservation.state}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Servicio</p>
                        <p className="text-sm font-medium">
                          {reservation.service?.title || "No especificado"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Barbero</p>
                        <p className="text-sm font-medium">
                          {reservation.barber?.name_barber
                            ? `${reservation.barber.name_barber} ${reservation.barber.last_name_barber}`
                            : "Sin asignar"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Fecha</p>
                        <p className="text-sm font-medium">
                          {new Date(reservation.date).toLocaleDateString(
                            "es-ES",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Hora</p>
                        <p className="text-sm font-medium">
                          {reservation.hour}
                        </p>
                      </div>
                    </div>

                    {/* Notas (opcional - se muestra si hay notas) */}
                    {reservation.notes && (
                      <div className="mb-3 bg-gray-50 p-2 rounded">
                        <p className="text-xs text-gray-500">Notas</p>
                        <p className="text-sm">{reservation.notes}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mt-2">
                      {reservation.state !== "completada" &&
                        reservation.state !== "cancelada" && (
                          <>
                            <button
                              onClick={() =>
                                updateReservationStatus(
                                  reservation._id,
                                  "confirmada"
                                )
                              }
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                            >
                              <Check size={12} className="mr-1" /> Confirmar
                            </button>
                            <button
                              onClick={() =>
                                updateReservationStatus(
                                  reservation._id,
                                  "completada"
                                )
                              }
                              className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"
                            >
                              <Check size={12} className="mr-1" /> Completar
                            </button>
                            <button
                              onClick={() =>
                                updateReservationStatus(
                                  reservation._id,
                                  "cancelada"
                                )
                              }
                              className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                            >
                              <XIcon size={12} className="mr-1" /> Cancelar
                            </button>
                          </>
                        )}
                      <button
                        onClick={() => handleEditReservation(reservation._id)}
                        className="inline-flex items-center px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs hover:bg-indigo-200"
                      >
                        <Edit size={12} className="mr-1" /> Editar
                      </button>
                      <button
                        onClick={() => deleteReservations(reservation._id)}
                        className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                      >
                        <Trash size={12} className="mr-1" /> Eliminar
                      </button>
                    </div>
                  </div>
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
