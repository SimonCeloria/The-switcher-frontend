import React, { useContext } from "react";
import Board from "../components/Board";
import { SkipTurnButton } from "../components/Button/SkipButton";
import { LeaveGameButton } from "../components/Button/LeaveGameButton";
import { RollbackMovButton } from "../components/Button/RollbackMovButton";
import { Win } from "../components/WinGame";
import MovementList from "../components/Cards/MovementList";
import "../Styles/Fondo.css";
import "../Styles/Pallete.css";
import PlayersContainer from "../containers/PlayersContainer";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import Chat from "../components/Chat/Chat";
import UltimoColor from "../components/UltimoColor";
import CountdownTimer from "../components/Temporizador";

export const Game = () => {
  const partidaContext = useContext(PartidaWSContext);

  return (
    <div className="h-screen w-screen flex justify-center items-center static-bg overflow-hidden board-image">
      <div className="w-full h-full relative flex justify-between">
        {/* MOVIMIENTOS */}
        <div className="absolute bottom-2 right-2 h-1/4 z-50 w-[28%] flex flex-col items-end justify-end">
          <RollbackMovButton
            label={"Deshacer movimiento"}
            disabled={!partidaContext.isMyTurn || partidaContext.ganador.nombre}
          />
          <MovementList />
        </div>

        {/* JUGADORES */}
        <div className="absolute w-[28%] h-[80%] z-50 max-w-4xl max-h-4xl left-2 top-20 bottom-20">
          <PlayersContainer />
        </div>

        {/* TABLERO DE JUEGO */}
        <div className="absolute w-[10%] h-[10%] z-50 flex items-center justify-center top-4 right-[28%]">
          <CountdownTimer />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Board />
        </div>
        <div className="absolute top-[92.5%] right-[43.2%] transform -translate-y-1/2 z-30">
          <UltimoColor />
        </div>
        <div className="flex-grow flex items-center justify-center">
          <Win />
        </div>
        {/* CHAT */}
        <div className="absolute top-4 right-4 z-60 w-[28%] h-[50%]">
          <Chat />
        </div>
        {/* BOTONES */}
        <div className="absolute top-4 left-4 z-50 flex items-center space-x-4">
          <LeaveGameButton
            label={"ABANDONAR"}
            personalization={
              " bg-[var(--Rojo)]  py-3 px-3 text-white font-bold rounded-md hover:bg-[var(--Amarillo)]  transition duration-300"
            }
          />
        </div>
        <div className="absolute bottom-4 left-4 z-50 flex items-center space-x-4">
          <SkipTurnButton />
        </div>
      </div>
    </div>
  );
};

export default Game;
