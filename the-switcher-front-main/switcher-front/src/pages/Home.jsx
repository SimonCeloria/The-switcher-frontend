import React, { useState } from "react";
import LoginContainer from "../containers/LoginContainer";
import { HeaderGame } from "../components/Header";
import "../Styles/AnimatedBG.css";
import "../Styles/Pallete.css";
import ToggleAnimationButton from "../components/Button/ToggleAnimationButton";
import { isAnimated } from "../Styles/AnimationVariable";

const Home = () => {
  const [LocalAnimated, setLocalAnimated] = useState(isAnimated);

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center p-4 ${
        LocalAnimated ? "animated-bg" : "solid-bg"
      }`}
    >
      <ToggleAnimationButton toggle={setLocalAnimated} />
      <div className="w-auto bg-[var(--Celeste2)] bg-opacity-100 backdrop-filter backdrop-blur-lg rounded-xl shadow-2xl p-8 border-2 border-black">
        <HeaderGame />
        <LoginContainer />
        <p className="text-[var(--Marron)] text-center mt-6 text-sm">
          Introduzca su nickname con el que será identificado en el juego por
          los otros jugadores.
        </p>
      </div>
    </div>
  );
};

export default Home;
