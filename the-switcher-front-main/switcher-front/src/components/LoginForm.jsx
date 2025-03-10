import React from "react";
import "../Styles/Pallete.css";

const LoginForm = ({
  name,
  handleName,
  errors,
  register,
  handleSubmit,
  serverError,
  onEnter,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          {...register("nombre", {
            required: "Introduzca su nombre",
            validate: {
              minLength: (value) =>
                value.trim().length >= 3 ||
                "El nombre debe tener al menos 3 caracteres.",
              maxLength: (value) =>
                value.trim().length <= 20 ||
                "El nombre debe tener 20 caracteres o menos.",
            },
          })}
          className={`w-full px-4 py-2 bg-[var(--Crema)] bg-opacity-50 text-[var(--Marron)] placeholder-[var(--Marron2)] border border-[var(--Marron)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Rojo)]-400${
            errors.nombre ? "border-red-500" : ""
          }`}
          placeholder="Introduzca su nombre"
          type="text"
          name="nombre"
          value={name}
          onChange={handleName}
          onKeyDown={onEnter}
        />
        {!errors.nombre && serverError && (
          <span className="text-red-500 text-sm mt-1">{serverError}</span>
        )}

        {errors.nombre && (
          <span className="text-red-500 text-sm mt-1">
            {errors.nombre.message}
          </span>
        )}
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-gradient-to-r from-[var(--Marron)] to-[var(--Amarillo)] text-white font-semibold rounded-md hover:from-[var(--Marron)]-600 hover:to-[var(--Amarillo)]-600 focus:outline-none focus:ring-2 focus:ring-[var(--Rojo)] focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!name}
      >
        Iniciar sesión
      </button>
    </form>
  );
};

export default LoginForm;
