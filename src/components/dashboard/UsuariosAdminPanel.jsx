import React, { useState } from "react";
import {
  Trash2,
  Edit,
  Plus,
  X,
  Save,
  User,
  Shield,
  Check,
  AlertCircle,
} from "lucide-react";
import { useBarbers } from "../../context/BarberContext"; // Usando tu contexto existente
import Swal from "sweetalert2";

import { useUsers } from "../../context/UserContext";

const UsuariosAdminPanel = () => {
  const { users, loading, error, addUser, editUser, removeUser } = useUsers();

  const { barber } = useBarbers();

  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleEditUser = (user) => {
    setEditingUser({ ...user });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (user) => {
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
        await removeUser(user._id);

        Swal.fire({
          title: "¡Eliminado!",
          text: "El usuario ha sido eliminado.",
          icon: "success",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      Swal.fire({
        title: "Error",
        text: `¡No se pudo eliminar el usuario! ${error}`,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { key: "name", label: "Nombre" },
      { key: "email", label: "Email" },
      { key: "role", label: "Rol" },
    ];

    if (!editingUser.password && !editingUser._id) {
      return "La contraseña es obligatoria para nuevos usuarios";
    }

    for (const field of requiredFields) {
      if (!editingUser[field.key]) {
        return `El campo ${field.label} es obligatorio`;
      }
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editingUser.email)) {
      return "El formato del email no es válido";
    }

    // Si el rol es barbero, verificar que tenga un id_barber
    if (editingUser.role === "barbero" && !editingUser.id_barber) {
      return "Debe seleccionar un barbero asociado";
    }

    return null;
  };

  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setEditingUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (e) => {
    const value = e.target.value;
    setEditingUser((prev) => ({
      ...prev,
      role: value,
      // Si el rol no es barbero, limpiamos el id_barber
      id_barber: value === "barbero" ? prev.id_barber : null,
    }));
  };

  const handleBarberChange = (e) => {
    const value = e.target.value;
    setEditingUser((prev) => ({
      ...prev,
      id_barber: value,
    }));
  };

  const handleToggleActive = (e) => {
    const checked = e.target.checked;
    setEditingUser((prev) => ({
      ...prev,
      isActive: checked,
    }));
  };

  const saveChanges = async () => {
    const validationError = validateForm();
    if (validationError) {
      setSubmitError(validationError);
      return;
    }

    setSubmitError(null);

    try {
      if (editingUser._id) {
        // Actualizar usuario existente
        console.log("Actualizando usuario con datos:", editingUser);
        await editUser(editingUser._id, editingUser);
        await Swal.fire({
          icon: "success",
          title: "Usuario Actualizado Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // Agregar nuevo usuario
        await addUser(editingUser);
        await Swal.fire({
          icon: "success",
          title: "Usuario Creado Exitosamente",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `¡Algo salió mal! ${error}`,
        confirmButtonColor: "#d33",
        confirmButtonText: "OK",
      });
    }
  };

  const addNewUser = () => {
    const newUser = {
      name: "",
      phone: "",
      email: "",
      password: "",
      role: "",
      isActive: true,
    };
    setEditingUser(newUser);
    setIsModalOpen(true);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="text-purple-500" />;
      case "superadmin":
        return <Shield className="text-red-500" />;
      case "barbero":
        return <User className="text-blue-500" />;
      case "recepcionista":
        return <User className="text-green-500" />;
      default:
        return <User className="text-gray-500" />;
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "superadmin":
        return "bg-red-100 text-red-800";
      case "barbero":
        return "bg-blue-100 text-blue-800";
      case "recepcionista":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      <header className="sticky top-0 z-30 flex items-center justify-between h-16 pr-4 pl-20 bg-white shadow-md">
        <h1 className="text-xl font-bold">Administración de Usuarios</h1>
        <div className="flex justify-between items-center">
          <button
            onClick={addNewUser}
            className="flex items-center text-sm font-medium bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            <Plus className="mr-2" size={16} /> Agregar Usuario
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 m-3">
        {users.length === 0 ? (
          <div className="col-span-3 text-center p-6 bg-gray-100 rounded-lg">
            No hay usuarios registrados.
          </div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="border rounded-lg p-4 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  {user.name}
                  {!user.isActive && (
                    <span className="ml-2 text-xs text-white bg-gray-500 px-2 py-1 rounded-full">
                      Inactivo
                    </span>
                  )}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUser(user)}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2 flex items-center space-x-2 mb-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getRoleBadgeClass(
                      user.role
                    )}`}
                  >
                    {user.role}
                  </span>
                  <span className="text-gray-500">{user.email}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Teléfono:</span>{" "}
                    {user.phone || "No registrado"}
                  </p>
                  {user.role === "barbero" && user.id_barber && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Barbero:</span>{" "}
                      {barber.find((b) => b._id === user.id_barber)?.nombre ||
                        "No encontrado"}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-end">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingUser._id ? "Editar Usuario" : "Nuevo Usuario"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-red-500 hover:text-red-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Nombre</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingUser.name || ""}
                  onChange={(e) => handleInputChange(e, "name")}
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border rounded p-2"
                  value={editingUser.email || ""}
                  onChange={(e) => handleInputChange(e, "email")}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Teléfono</label>
                <input
                  className="w-full border rounded p-2"
                  value={editingUser.phone || ""}
                  onChange={(e) => handleInputChange(e, "phone")}
                  placeholder="Número de teléfono"
                />
              </div>

              {!editingUser._id && (
                <div>
                  <label className="block mb-2 font-medium">Contraseña</label>
                  <input
                    type="password"
                    className="w-full border rounded p-2"
                    value={editingUser.password || ""}
                    onChange={(e) => handleInputChange(e, "password")}
                    placeholder="Contraseña"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Requerido para nuevos usuarios.
                  </p>
                </div>
              )}

              {editingUser._id && (
                <div>
                  <label className="block mb-2 font-medium">
                    Nueva Contraseña (opcional)
                  </label>
                  <input
                    type="password"
                    className="w-full border rounded p-2"
                    value={editingUser.password || ""}
                    onChange={(e) => handleInputChange(e, "password")}
                    placeholder="Dejar en blanco para mantener la actual"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Dejar en blanco para mantener la contraseña actual.
                  </p>
                </div>
              )}

              <div>
                <label className="block mb-2 font-medium">Rol</label>
                <select
                  className="w-full border rounded p-2"
                  value={editingUser.role || ""}
                  onChange={handleRoleChange}
                >
                  <option value="">Selecciona un rol</option>
                  <option value="admin">Administrador</option>
                  <option value="superadmin">Super Administrador</option>
                  <option value="barbero">Barbero</option>
                  <option value="recepcionista">Recepcionista</option>
                </select>
              </div>

              {editingUser.role === "barbero" && (
                <div>
                  <label className="block mb-2 font-medium">
                    Barbero Asociado
                  </label>
                  <select
                    className="w-full border rounded p-2"
                    value={editingUser?.id_barber || ""}
                    onChange={handleBarberChange}
                  >
                    <option value="">Selecciona un barbero</option>
                    {barber.map((barber) => (
                      <option key={barber._id} value={barber._id}>
                        {barber.nombre} {barber.apellido}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingUser.isActive}
                  onChange={handleToggleActive}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 font-medium">
                  Usuario Activo
                </label>
              </div>

              {/* Mensaje de error si hay */}
              {submitError && (
                <div className="bg-red-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error al guardar el usuario
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{submitError}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex items-center bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                <X className="mr-2" size={16} /> Cancelar
              </button>
              <button
                onClick={saveChanges}
                className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                <Save className="mr-2" size={16} /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuariosAdminPanel;
