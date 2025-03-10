import React, { useState, useContext } from "react";
import { ListaPartidaContext } from "../../contexts/ListaPartidaContext";

export function JoinGameButton({ id_game, privada, disabled }) {
  const mainContext = useContext(ListaPartidaContext);
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [error, setError] = useState("");

  const toggleMostrarContraseña = () => {
    setMostrarContraseña((prev) => !prev);
  };

  const handleJoinClick = async (e) => {
    e.preventDefault();
    try {
      await mainContext.handleJoin(e, id_game, password);
      setShowPopup(false);
      setError("");
    } catch (err) {
      setError("Contraseña incorrecta. Inténtalo de nuevo.");
    }
  };

  return (
    <>
      {showPopup && (
        <div className="fixed z-10 inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[var(--Crema)] p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl text-[var(--Marron)] font-bold mb-4 text-center">
              Partida privada
            </h2>
            <div className="relative">
              <input
                type={mostrarContraseña ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                className="border border-[var(--Marron)] p-2 rounded-lg w-full mb-4"
              />
              <button
                type="button"
                onClick={toggleMostrarContraseña}
                className="absolute right-3 top-2 text-xl"
              >
                {mostrarContraseña ? "🙈" : "👁️"}
              </button>
            </div>
            {error && (
              <p className="text-[var(--Rojo)] mb-4 text-center">{error}</p>
            )}
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 rounded-lg text-white bg-[var(--Rojo)] hover:bg-[var(--Rojo2)] transition duration-300"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={handleJoinClick}
                className="px-4 py-2 rounded-lg text-white bg-[var(--Celeste3)] hover:bg-[var(--Celeste2)] transition duration-300"
              >
                UNIRSE A LA PARTIDA
              </button>
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          if (privada) {
            setShowPopup(true);
          } else {
            mainContext.handleJoin(e, id_game, null);
          }
        }}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg text-white ms-5 me-1 ${
          disabled
            ? "bg-gray-400"
            : "bg-[var(--Celeste3)] hover:bg-[var(--Celeste2)] transition duration-300"
        }`}
      >
        UNIRSE
      </button>
    </>
  );
}
