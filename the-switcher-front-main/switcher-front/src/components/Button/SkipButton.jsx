import React from "react";
import { useContext } from "react";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";
import "../../Styles/Pallete.css";

export function SkipTurnButton() {
  const gameWSContext = useContext(PartidaWSContext);
  let turno_de,
    jugadorConTurno = null;
  if (
    gameWSContext.jugadores &&
    gameWSContext.currentTurn !== undefined &&
    gameWSContext.turnos.length > 0
  ) {
    turno_de = gameWSContext.turnos.find(
      (turno) => turno.turno == gameWSContext.currentTurn
    );
    jugadorConTurno = gameWSContext.jugadores.find(
      (jugador) => jugador.id == turno_de.jugador_id
    );
  }

  // Create a mapping of player IDs to their turn numbers
  const turnMapping = {};
  gameWSContext.turnos.forEach((turno) => {
    turnMapping[turno.jugador_id] = turno.turno;
  });

  // Sort players by their turn number
  const sortedJugadores = [...gameWSContext.jugadores].sort((a, b) => {
    return turnMapping[a.id] - turnMapping[b.id];
  });

  return (
    <div className="flex flex-col items-center space-y-1">
      <button
        className={`py-3 px-3 text-white font-bold rounded-md transition duration-300 ${
          gameWSContext.isMyTurn && !gameWSContext.ganador.nombre
            ? "bg-[var(--Amarillo)] hover:bg-[var(--Celeste3)]"
            : "bg-gray-500 cursor-not-allowed"
        }`}
        type="button"
        onClick={(e) => gameWSContext.handleSkip(e)}
        disabled={!gameWSContext.isMyTurn || gameWSContext.ganador.nombre}
      >
        PASAR TURNO
      </button>
    </div>
  );
}
