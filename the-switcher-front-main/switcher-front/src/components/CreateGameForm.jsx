// CreateGameForm.jsx
import React from "react";
import { CreateFormContainer } from "../containers/CreateFormContainer"; // Componente con el formulario de creación

const CreateGameForm = ({ handleSubmit, handleClose, showForm }) => {
  if (!showForm) return null; // Si showForm es false, no mostrar nada

  return (
    <div className="relative">
      {/* Fondo semitransparente para el modal */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={handleClose} // Cerrar al hacer clic fuera del formulario
      ></div>

      {/* Contenido del modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-full max-w-md p-8 bg-[var(--Crema)] rounded-lg border-4 border-[var(--Celeste3)] relative">
          {/* Formulario de creación de partida */}
          <CreateFormContainer handleSubmitExt={handleSubmit} />
          {/* Botón para cerrar el modal */}
          <button
            className="mt-3 w-full hover:text-white bg-[#9b9898] hover:bg-gray-500focus:ring-4 focus:outline-none focus:ring-red-300 font-small rounded-lg text-sm px-3.5 py-2 text-center me-2 mb-2 dark:text-white dark:hover:text-white dark:hover:bg-red-900 dark:focus:ring-red-900"
            onClick={handleClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGameForm;
