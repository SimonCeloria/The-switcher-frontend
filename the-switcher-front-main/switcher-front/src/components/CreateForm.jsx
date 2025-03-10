import React from "react";
import { useState } from "react";
import { CreateGameButton } from "./Button/CreateGameButton";

export const CreateForm = ({
  register,
  handleSubmit,
  onEnter,
  errors,
  handleMinPlayersClick,
  handleMaxPlayersClick,
  handleName,
  cantMin,
  cantMax,
  esPrivada,
  contraseña,
  handlePrivacidadChange,
  handleContraseñaChange,
}) => {
  const [mostrarContraseña, setMostrarContraseña] = useState(false);

  const toggleMostrarContraseña = () => {
    setMostrarContraseña((prev) => !prev);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      data-testid="create-game-form"
    >
      {/* Name Input */}
      <div className="flex flex-col">
        <label className="block text-center text-[var(--Marron)] font-bold text-lg mb-1 mx-auto">
          NOMBRE DE LA PARTIDA
        </label>
        <input
          {...register("nombrePartida", {
            required: "Por favor, introduce un nombre de partida",
            validate: {
              minLength: (value) =>
                value.trim().length >= 3 ||
                "El nombre debe tener al menos 3 caracteres",
              maxLength: (value) =>
                value.trim().length <= 40 ||
                "El nombre debe tener 40 caracteres o menos.",
            },
          })}
          className={`p-2 border border-[var(--Celeste3)] bg-[var(--Celeste1)] text-center rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Celeste1)] placeholder-[#7e7e7e]${
            errors.nombrePartida ? "border-red-500" : ""
          }`}
          placeholder="Introduce el nombre de la partida"
          type="text"
          name="nombrePartida"
          onChange={handleName}
          onKeyDown={onEnter}
        />
        {errors.nombrePartida && (
          <span className="text-red-500 text-sm mt-1">
            {errors.nombrePartida.message}
          </span>
        )}
      </div>
      {/* Privacidad inputt */}
      <div className="flex flex-col">
        <label className="block text-center text-[var(--Marron)] font-bold text-lg mb-1 mx-auto">
          TIPO DE PARTIDA
        </label>
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              esPrivada
                ? "bg-[var(--Celeste1)] text-[var(--Marron)]"
                : "bg-[var(--Celeste3)] text-white"
            }`}
            onClick={() => handlePrivacidadChange(false)}
          >
            Pública
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-md ${
              esPrivada
                ? "bg-[var(--Celeste3)] text-white"
                : "bg-[var(--Celeste1)] text-[var(--Marron)]"
            }`}
            onClick={() => handlePrivacidadChange(true)}
          >
            Privada
          </button>
        </div>
      </div>

      {/* Password Input */}
      {esPrivada && (
        <div className="flex flex-col relative">
          <label className="block text-center text-[var(--Marron)] font-bold text-lg mb-1 mx-auto">
            CONTRASEÑA
          </label>
          <input
            type={mostrarContraseña ? "text" : "password"}
            name="contraseña"
            value={contraseña}
            onChange={handleContraseñaChange}
            className="p-2 border border-[var(--Celeste3)] bg-[var(--Celeste1)] text-center rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Celeste1)]"
            placeholder="Introduce la contraseña"
            required={esPrivada}
          />
          <button
            type="button"
            onClick={toggleMostrarContraseña}
            className="absolute right-3 top-10"
          >
            {mostrarContraseña ? "🙈" : "👁️"}
          </button>
        </div>
      )}

      {/* Min Players Selection */}
      <div className="flex flex-col">
        <label className="block text-center text-[var(--Marron)] font-bold text-lg mb-1 mx-auto">
          CANTIDAD MÍNIMA DE JUGADORES:
        </label>
        <div className="flex justify-center space-x-4">
          {[2, 3, 4].map((minPlayers) => (
            <button
              key={minPlayers}
              type="button"
              className={`px-4 py-2 rounded-md ${
                cantMin === minPlayers
                  ? "bg-[var(--Celeste3)] text-[var(--Marron)]"
                  : "bg-[var(--Celeste1)] hover:bg-[var(--Celeste2)]"
              }`}
              onClick={() => handleMinPlayersClick(minPlayers)}
            >
              {minPlayers}
            </button>
          ))}
        </div>
      </div>

      {/* Max Players Selection */}
      <div className="flex flex-col">
        <label className="block text-center text-[var(--Marron)] font-bold text-lg mb-1 mx-auto">
          CANTIDAD MÁXIMA DE JUGADORES:
        </label>
        <div className="flex justify-center space-x-4">
          {[2, 3, 4].map((maxPlayers) => (
            <button
              key={maxPlayers}
              type="button"
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                cantMax === maxPlayers
                  ? "bg-[var(--Celeste3)] text-[var(--Marron)]"
                  : "bg-[var(--Celeste1)] hover:bg-[var(--Celeste2)]"
              }`}
              onClick={() => handleMaxPlayersClick(maxPlayers)}
            >
              {maxPlayers}
            </button>
          ))}
        </div>
      </div>
      <CreateGameButton />
    </form>
  );
};
