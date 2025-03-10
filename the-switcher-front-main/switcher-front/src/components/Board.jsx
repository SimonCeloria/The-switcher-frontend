import React, { useContext, useEffect, useState } from "react";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import "../Styles/Pallete.css";
import "../Styles/Fondo.css";
import "../Styles/animationtable.css";

const imageMap = {
  amarillo: "B.svg",
  azul: "D.svg",
  rojo: "A.svg",
  verde: "C.svg",
};

const boxShadowMap = {
  amarillo: "pulsate-amarillo",
  azul: "pulsate-azul",
  rojo: "pulsate-rojo ",
  verde: "pulsate-verde",
};

const Board = () => {
  const {
    fichas,
    highlightCoords,
    highlightFigsCoords,
    highlightFigs,
    isMyTurn,
    ganador,
    highlightMovsCoords,
  } = useContext(PartidaWSContext);
  const [winner, setWinner] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((prevKey) => prevKey + 1);
  }, [highlightMovsCoords, highlightFigsCoords]); // Retrigerear la animacion cuando highlightMovsCoords cambia

  if (!fichas || fichas.length === 0) {
    console.warn("No fichas available");
    return <div>Loading...</div>; //Esto podria ser en vez de "Loading...", un "Error en la conexión...", ya que no habrá fichas y no se podrá reconectar eso. (creería).
  }

  if (!Array.isArray(highlightFigsCoords)) {
    console.error("highlightFigsCoords is not an array:", highlightFigsCoords);
    return <div>Error: Invalid highlight data</div>;
  }

  const isHighlightedFig = (index) => {
    const result = highlightFigsCoords.flat().includes(index);
    return result;
  };

  const isPartialMovement = (ficha) => {
    return (
      Array.isArray(highlightMovsCoords) &&
      highlightMovsCoords.some(
        (move) => move.xCord === ficha.xCord && move.yCord === ficha.yCord
      )
    );
  };

  return (
    <div className="w-full h-full max-w-[70vh] max-h-[70vh] bg-[var(--Crema)] rounded-lg shadow-lg p-4 border-4 border-[var(--Marron2)] ring-4 ring-[var(--CremaChat)]">
      <div className="grid grid-rows-6 grid-cols-6 gap-1 h-full">
        {fichas.map((ficha, index) => {
          const isHighlighted = highlightCoords.includes(index);
          const isHighlightedFigs = isHighlightedFig(index);
          const isPartial = isPartialMovement(ficha);

          return (
            <div
              key={`${index}-${isPartial || isHighlightedFigs ? animKey : ""}`} // Reapply animation based on moveKey
              data-testid={`ficha-${index}`}
              className={`flex items-center justify-center rounded-sm shadow-sm relative 
              ${isHighlighted ? "highlight" : ""} ${
                isPartial ? "parcialMov-animation" : ""
              }`} //condicional para el resaltado y la pulsasion
              data-ficha-id={index} //Esto es posicion no id
              data-ficha-back-id={ficha.id}
              data-ficha-x={ficha.xCord}
              data-ficha-y={ficha.yCord}
              onMouseEnter={
                isMyTurn && !ganador.nombre
                  ? (e) => {
                      e.target.style.transform = "scale(1.1)"; // Efecto hover (agrandar)
                    }
                  : undefined
              }
              onMouseLeave={
                isMyTurn && !ganador.nombre
                  ? (e) => {
                      e.target.style.transform = "scale(1)"; // Vuelve al tamaño original
                    }
                  : undefined
              }
              style={{
                backgroundImage: `url(/${imageMap[ficha.color]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {isHighlighted && (
                <div
                  className="absolute inset-0 border-4 border-[var(--Marron1)] ring-4 ring-[var(--Marron)] rounded-sm pointer-events-none"
                  style={{ zIndex: 15 }}
                />
              )}
              {isHighlightedFigs && (
                <div
                  className={`absolute inset-0 rounded-sm pointer-events-none overflow-hidden h-[80%] w-[80%] left-2 top-2 ${
                    boxShadowMap[ficha.color]
                  }`}
                  style={{
                    zIndex: 10,
                  }}
                />
              )}
              {isPartial && (
                <div
                  className="absolute inset-0 rounded-sm pointer-events-none overflow-hidden"
                  style={{ zIndex: 12 }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Board;
