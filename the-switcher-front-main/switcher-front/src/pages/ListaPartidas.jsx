import React, { useState, useContext } from "react";
import { HeaderGame } from "../components/Header";
import GamesList from "../components/GameList";
import ToggleAnimationButton from "../components/Button/ToggleAnimationButton";
import CreateGameContainer from "../containers/CreateGameContainer";
import { CancelledGame } from "../components/CancelledGame";
import { ListaPartidaContext } from "../contexts/ListaPartidaContext";

const ListaPartidasComp = ({
  filter,
  setFilter,
  playerCount,
  setPlayerCount,
  cancelled,
  LocalAnimated,
  setLocalAnimated,
}) => {
  const crearPartida = useContext(ListaPartidaContext);
  const [showActiveOnly, setShowActiveOnly] = useState(false); //filtraje en falso por defecto
  const [showPrivateOnly, setShowPrivateOnly] = useState(false); //idem a activas

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-4 ${
        LocalAnimated ? "animated-bg" : "solid-bg"
      }`}
    >
      <ToggleAnimationButton toggle={setLocalAnimated} />
      <div className="container mx-auto px-4 py-8">
        <HeaderGame />
        <div className="bg-[var(--Celeste3)] bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-6 mb-8 border-2 border-black">
          <nav className="flex justify-between items-center mb-6">
            <div></div> {/*IMPORTANTE, NO BORRAR*/}
            <div className="text-3xl font-extrabold text-[var(--Marron)]">
              PARTIDAS
            </div>
            <div className="flex space-x-4">
              <button
                className="px-4 py-2 bg-[var(--Marron)] text-white rounded-md hover:bg-[var(--Marron2)] transition duration-300"
                onClick={() => crearPartida.setShowForm(true)}
              >
                CREAR
              </button>
            </div>
          </nav>

          {/* Input de filtro */}
          <input
            type="text"
            placeholder="Buscar partida por su nombre"
            className="w-full mb-4 p-2 border border-[var(--Marron)] rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--Marron1)] bg-[var(--Crema)] placeholder-[var(--Marron2)]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />

          {/* Botones de filtrado por cantidad de jugadores */}
          <div className="flex space-x-4 mb-4">
            {[1, 2, 3, 4].map((count) => (
              <button
                key={count}
                className={`px-4 py-2 rounded-md border-2 transition-all duration-200
                  ${
                    playerCount.includes(count)
                      ? "bg-[var(--Marron1)] text-white border-[var(--Marron)] hover:bg-[var(--Marron2)] hover:border-[var(--Marron1)]"
                      : "bg-[var(--Crema)] text-black border-[var(--Marron)] hover:bg-[var(--Marron2)] hover:text-white hover:border-[var(--Marron)]"
                  }`}
                onClick={() => {
                  if (playerCount.includes(count)) {
                    setPlayerCount(playerCount.filter((num) => num !== count));
                  } else {
                    setPlayerCount([...playerCount, count]);
                  }
                }}
              >
                {count} Jugadores
              </button>
            ))}

            {/* Botón de filtro de partidas activas */}
            <button
              className={`px-4 py-2 rounded-md border-2 transition-all duration-200 ${
                showActiveOnly
                  ? "bg-[var(--Marron1)] text-white border-[var(--Marron)] hover:bg-[var(--Marron2)]"
                  : "bg-[var(--Crema)] text-black border-[var(--Marron)] hover:bg-[var(--Marron2)] hover:text-white"
              }`}
              onClick={() => {
                setShowActiveOnly(!showActiveOnly); //linea 88
              }}
            >
              Activas
            </button>

            {/* Botón de filtro para partidas privadas */}
            <button
              className={`px-4 py-2 rounded-md border-2 transition-all duration-200 ${
                showPrivateOnly
                  ? "bg-[var(--Marron1)] text-white border-[var(--Marron)] hover:bg-[var(--Marron2)]"
                  : "bg-[var(--Crema)] text-black border-[var(--Marron)] hover:bg-[var(--Marron2)] hover:text-white"
              }`}
              onClick={() => setShowPrivateOnly(!showPrivateOnly)}
            >
              Privadas
            </button>
          </div>

          <GamesList
            games={crearPartida.gameList}
            filter={filter}
            playerCount={playerCount}
            showActiveOnly={showActiveOnly}
            showPrivateOnly={showPrivateOnly}
          />
        </div>

        {/* Modal para crear partida */}
        {crearPartida.showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 border-2 border-black">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <CreateGameContainer />
            </div>
          </div>
        )}

        {/* Componente para partida cancelada */}
        {cancelled && <CancelledGame />}
      </div>
    </div>
  );
};

export default ListaPartidasComp;
