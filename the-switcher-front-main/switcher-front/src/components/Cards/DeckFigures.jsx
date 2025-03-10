import React, { useContext, useEffect, useState } from "react";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

const CARDWIDTH = "60px";

export const DeckFigures = ({ idPlayer }) => {
  const { figuras } = useContext(PartidaWSContext);
  const FigLen = figuras[idPlayer].enMazo;
  const [isBlock, setIsBlock] = useState(false);

  useEffect(() => {
    const jugadorFiguras = figuras[idPlayer]?.enMano || []; // Verificación segura

    const hasBlockedFigures = jugadorFiguras.some(
      (figure) => figure.bloqueada === true
    );

    setIsBlock(hasBlockedFigures);
  }, [figuras, idPlayer]);

  const renderCartas = (isBlock) => {
    if (FigLen === 0) {
      return null;
    }

    return (
      <div
        style={{
          right: "75px",
          bottom: "65px",
          position: "absolute",
        }}
      >
        {Array.from({ length: FigLen }).map((_, index) => (
          <div
            key={index}
            style={{
              width: CARDWIDTH,
              height: CARDWIDTH,
              backgroundColor: "#111",
              border: "0.5px solid #777",
              position: "absolute",
              bottom: `${index * 1 - 80}px`,
              zIndex: index,
            }}
          >
            <img
              src={"/back.svg"}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="back"
            />
            {isBlock ? (
              <img
                src={"/lock.png"}
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "7%",
                  width: "90%",
                  height: "90%",
                }}
                alt="lock"
              />
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  return <div>{renderCartas(isBlock)}</div>;
};
