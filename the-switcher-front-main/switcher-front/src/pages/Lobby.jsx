import { HeaderGame } from "../components/Header";
import { LeaveGameButton } from "../components/Button/LeaveGameButton";
import { useContext, useState } from "react";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import StartGameButton from "../components/Button/StartGameButton";
import "../Styles/AnimatedBG.css";
import "../Styles/Pallete.css";
import ToggleAnimationButton from "../components/Button/ToggleAnimationButton";
import { isAnimated } from "../Styles/AnimationVariable";
import Chat from "../components/Chat/Chat";

export const LobbyPage = () => {
  const partidaContext = useContext(PartidaWSContext);
  const isOwner =
    partidaContext.partida.owner === parseInt(partidaContext.idJugador);
  const [LocalAnimated, setLocalAnimated] = useState(isAnimated);

  return (
    <div
      className={`h-screen w-screen flex justify-center items-center ${
        LocalAnimated ? "animated-bg" : "solid-bg"
      }`}
    >
      <ToggleAnimationButton toggle={setLocalAnimated} />

      <div className="w-[65%] h-full relative flex justify-center items-center">
        {/* LOBBY CONTAINER */}
        <div className="absolute w-full h-[75%] bg-[--Celeste3] border-2 border-[--Marron] rounded-md p-8 flex flex-col justify-between">
          {/* TITULO DE LA PARTIDA */}
          <div className="text-5xl text-[var(--Marron)] bg-[--Crema] pt-2 pb-2 border-2 border-[--Marron] font-bold text-center m-4">
            {partidaContext.partida.nombre}
          </div>

          {/* JUGADORES */}
          <div className="absolute w-[45%] h-[60%] left-12 top-[21.5%]">
            {partidaContext.jugadores.map((jugador) => (
              <div
                key={jugador.id}
                className="bg-[var(--Crema)] border-2 border-[--Marron] my-3 text-center rounded-md py-6 flex items-center justify-center relative text-xl font-extrabold text-[var(--Marron)]"
              >
                {jugador.id === partidaContext.partida.owner && (
                  <span className="absolute left-5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#000000"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-crown"
                    >
                      <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
                      <path d="M5 21h14" />
                    </svg>
                  </span>
                )}
                <span>{jugador.nombre}</span>
              </div>
            ))}

            {/* BOTONES */}
            {!isOwner && (
              <div className="top-[5%] relative flex justify-center items-center space-x-4">
                <LeaveGameButton
                  label={"ABANDONAR PARTIDA"}
                  personalization={
                    "bg-[#7e7e7e] py-3 px-20 text-white font-bold rounded-md hover:bg-[--Rojo] transition duration-200"
                  }
                />
              </div>
            )}
            {isOwner && (
              <div className="top-[5%] relative flex justify-center items-center space-x-4">
                <StartGameButton
                  disabled={
                    partidaContext.jugadores.length <
                    partidaContext.partida.minJugadores
                  }
                />
                <LeaveGameButton
                  label={"CANCELAR PARTIDA"}
                  personalization={
                    " bg-[#7e7e7e] py-3 px-9 text-white font-bold rounded-md hover:bg-[--Rojo] transition duration-200"
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* CHAT */}
        <div className="absolute top-[30%] right-[4.4%] w-[45%] h-[50%]">
          <Chat />
        </div>
      </div>
    </div>
  );
};
