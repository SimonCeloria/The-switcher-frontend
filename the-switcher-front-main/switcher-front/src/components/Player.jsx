import React from "react";
import "../Styles/Pallete.css";
import { EnemyHandMovement } from "./Cards/MovementList";
import FiguresList from "./Cards/FigureList";
import { DeckFigures } from "./Cards/DeckFigures";
import "../Styles/Turnero.css";

// TurnIcon component
const TurnIcon = () => (
  <img
    src="/poro.jpg"
    alt="TurnIcon"
    className="w-8 h-8 rounded-full object-cover"
  />
);

const Player = ({ player, isPlayerTurn, isMyLayout }) => (
  <div
    key={player.id_jugador}
    className={`relative flex left-2 flex-col w-full h-1/4 items-center mb-8 ${
      isMyLayout ? "caja-2" : "caja-1"
    } ${isPlayerTurn ? "" : "brightness-75"}`}
    style={{ maxHeight: "25%", minHeight: "21%" }}
  >
    {player.status === "Disconnected" ? (
      <img
        src="/disconnected.png"
        alt="Disconnected"
        className="h-[98%] w-full object-cover blur"
      />
    ) : (
      <>
        <div className="flex h-9 flex-row w-full">
          <div className="w-9 items-center justify-center">
            {isPlayerTurn && <TurnIcon />}
          </div>
          <div className="truncate">{player.name}</div>
        </div>
        <div className="absolute h-1/2 top-12 flex flex-row w-full">
          <div className="relative w-1/4 h-full flex items-center justify-center">
            {/* CARTAS */}
            {!isMyLayout && <EnemyHandMovement idPlayer={player.id_jugador} />}
          </div>
          <div className="flex flex-row w-1/2 items-center justify-center">
            {/* FIGURAS */}
            <FiguresList idPlayer={player.id_jugador} />
          </div>
          <div className="flex flex-row w-1/4 h-1/4 right-2">
            {/* MAZO */}
            <DeckFigures idPlayer={player.id_jugador} />
          </div>
        </div>
      </>
    )}
  </div>
);

export default Player;
