import React from "react";
import { useContext, useEffect } from "react";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

export function StartGameButton({ disabled }) {
  const partida = useContext(PartidaWSContext);

  return (
    <button
      className={`px-12 py-3  font-bold rounded-md ${
        disabled
          ? "bg-gray-500 text-white"
          : "bg-[--Marron] hover:bg-[--Marron1] transition duration-300 text-white"
      }`}
      onClick={(e) => {
        partida.handleStart(e);
      }}
      disabled={disabled}
    >
      {"INICIAR PARTIDA"}
    </button>
  );
}

export default StartGameButton;
