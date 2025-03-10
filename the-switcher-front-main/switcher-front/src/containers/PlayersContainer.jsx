import React, { useState, useEffect, useContext } from "react";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import Player from "../components/Player";

const PlayersContainer = () => {
  const gameWSContext = useContext(PartidaWSContext);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const newPlayers = gameWSContext.turnos.map((jugador) => {
      const isConnected = gameWSContext.jugadores.some(
        (player) => player.id === jugador.jugador_id
      );
      return {
        name: jugador.nombre,
        turno: jugador.turno,
        id_jugador: jugador.jugador_id,
        status: isConnected ? "Connected" : "Disconnected",
      };
    });

    setPlayers(newPlayers);
  }, [gameWSContext.turnos, gameWSContext.jugadores]);

  return (
    <div className="absolute w-full h-full flex flex-col">
      {players.map((player) => {
        return (
          <Player
            key={player.id_jugador}
            player={player}
            isPlayerTurn={player.turno == gameWSContext.currentTurn}
            isMyLayout={player.id_jugador == gameWSContext.idJugador}
          />
        );
      })}
    </div>
  );
};

export default PlayersContainer;
