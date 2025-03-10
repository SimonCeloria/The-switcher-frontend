import React from "react";

const Popout = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // No renderiza nada si no está abierto

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className=" rounded-lg shadow-lg relative w-full max-w-md">
        {/* Botón de cierre */}

        {children}
        <button
          onClick={onClose}
          className="absolute right-1/4 z-10 w-5 top-5 text-red-600 hover:text-gray-900 text-3xl font-bold"
        >
          x
        </button>
      </div>
    </div>
  );
};

export default Popout;
