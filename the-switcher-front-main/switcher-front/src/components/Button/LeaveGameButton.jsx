import React from "react";
import { useContext, useEffect } from "react";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

export function LeaveGameButton({ label, personalization }) {
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
      className={personalization}
      onClick={(e) => {
        gameContext.handleLeave(e);
      }}
    >
      {renderLabel()}
    </button>
  );
}
