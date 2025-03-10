import React from "react";
import { useContext, useEffect } from "react";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

export function RollbackMovButton({ label, disabled }) {
  const renderLabel = () => {
    if (typeof label === "string" || React.isValidElement(label)) {
      return label;
    } else {
      console.error("Invalid label prop: ", label);
      return null;
    }
  };

  const gameContext = useContext(PartidaWSContext);
  return (
    <button
      className={`${
        disabled
          ? "bg-gray-400"
          : "bg-[var(--Rojo)] hover:bg-[var(--Amarillo)]  transition duration-300"
      }   py-3 px-3 text-white font-bold rounded-md mb-3`}
      onClick={(e) => {
        gameContext.handleRollback(e);
      }}
      disabled={disabled}
    >
      {renderLabel()}
    </button>
  );
}
