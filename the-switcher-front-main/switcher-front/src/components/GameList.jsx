import React, { useEffect, useState } from "react";
import { JoinGameButton } from "./Button/JoinGameButton";

const GamesList = ({
  games,
  filter,
  playerCount,
  showActiveOnly,
  showPrivateOnly,
}) => {
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    sessionStorage.removeItem("ganador");
    const filtered = games.filter((game) => {
      const matchesName = game.nombre
        .toLowerCase()
        .includes(filter.toLowerCase());
      const matchesPlayerCount =
        playerCount.length === 0 ||
        playerCount.includes(game.jugadores_partida.length);
      const matchesActiveStatus = showActiveOnly
        ? !game.iniciada && game.jugadores_partida.length < game.maxJugadores
        : true;

      const matchesPrivateStatus = showPrivateOnly
        ? game.password !== null
        : true;

      return (
        matchesName &&
        matchesPlayerCount &&
        matchesActiveStatus &&
        matchesPrivateStatus
      );
    });

    setFilteredGames(filtered);
  }, [games, filter, playerCount, showActiveOnly, showPrivateOnly]);

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {filteredGames.map((game) => (
        <div
          key={game.id}
          className="flex items-center p-4 bg-[var(--Crema)] bg-opacity-50 rounded-lg"
        >
          <div className="flex justify-between items-center flex-1">
            <span className="text-xl text-[var(--Marron)]">{game.nombre}</span>
            <span className="text-xl text-[var(--Marron)] mr-7">
              {game.jugadores_partida.length}/{game.maxJugadores}
            </span>
          </div>
          <div className="flex items-center">
            {game.password ? (
              <img src="/lock.png" alt="privado" />
            ) : (
              <img src="/unlock.png" alt="publico" />
            )}
            <div className="text-xl text-[var(--Marron)]">
              {game.password ? "Privada" : "Pública"}
            </div>
            <JoinGameButton
              id_game={game.id}
              privada={game.password !== null}
              disabled={
                game.jugadores_partida.length === game.maxJugadores ||
                game.iniciada
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default GamesList;
