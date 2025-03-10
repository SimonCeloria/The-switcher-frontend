// CardMovementContainer.jsx
import React from "react";
import { CardMovUser } from "../components/Cards/CardMovement";
import { useContext, useState, useEffect } from "react";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import { Toaster } from "react-hot-toast";
import { ErrorNotificationMov } from "./CardUtils";

import {
  GetFichaInfo,
  isValidFicha,
  ShowMovs,
  GetMovCoords,
} from "./CardUtils";
import MovServices from "../services/Movimiento";

export const waitForFirstEvent = (eventType) => {
  return new Promise((resolve) => {
    document.addEventListener(eventType, resolve, { once: true });
  });
};

export const CardMovementContainer = ({
  movement,
  index,
  selectedCard,
  waitingForEvent,
  onCardClick,
  onEventComplete,
  isMyTurn,
}) => {
  const { updateHighlightCoords, ganador } = useContext(PartidaWSContext);
  const [waitingForSecondClick, setWaitingForSecondClick] = useState(false); // Flag para saber si espero un segundo click
  const [firstFicha, setFirstFicha] = useState(null); // Ficha seleccionada en el primer click (id)
  const [validMovs, setValidMovs] = useState([]); // Movimientos validos retornados por ShowMovs

  useEffect(() => {
    if (!waitingForEvent) {
      updateHighlightCoords([]);
    }
  }, [waitingForEvent]);

  const RealizeMovement = async () => {
    const event = await waitForFirstEvent("click");
    const fichaElement = event.target.closest("[data-ficha-id]"); // Obtiene la ficha clickeada en base a
    if (fichaElement) {
      // un atributo en el tablero
      const ficha = GetFichaInfo(fichaElement); // Obtiene la informacion de la ficha clickeada
      const secondFicha = ficha.id; // ID de la ficha clickeada
      if (isValidFicha(ficha.pos, validMovs)) {
        MovServices.hacerMovimientoPartida(
          firstFicha,
          secondFicha,
          movement.id
        ); // El POST se basa en los IDs de las fichas y la carta
      } else {
        ErrorNotificationMov("Ficha invalida");
        //TODO: Si no es valido, aviso al usuario pero bien si es que el PO lo decide
      }
      updateHighlightCoords([]);
    }
    onEventComplete();
    setFirstFicha(null);
    setWaitingForSecondClick(false);
  };

  useEffect(() => {
    if (waitingForSecondClick) {
      RealizeMovement();
    }
  }, [waitingForSecondClick]);

  const handleClick = async () => {
    if (!isMyTurn || waitingForEvent || ganador.nombre) return;
    onCardClick(index);
    setTimeout(async () => {
      const event = await waitForFirstEvent("click");
      const fichaElement = event.target.closest("[data-ficha-id]");
      if (fichaElement) {
        const ficha = GetFichaInfo(fichaElement);
        const pivot = {
          // Coordenadas de la ficha clickeada enviadas por el back
          x: parseInt(ficha.coordenadas.x), // las coordenadas se obtienen en GetFichaInfo
          y: parseInt(ficha.coordenadas.y),
        };
        const isSpecial = movement.movimiento.special_move;
        const CardMovCoords = GetMovCoords(movement); // Coordenadas de la carta clickeada enviadas por el back
        const validMovs = ShowMovs({
          // Show movs utiliza: (En teoria toda info del back)
          cardmov: CardMovCoords, // Las coordenadas de la carta clickeada
          pivot: pivot, // Las coordenadas de la ficha clickeada
          isSpecial, // Si el movimiento es especial
          updateHighlightCoords, // La funcion para actualizar las coordenadas resaltadas
        });
        setValidMovs(validMovs);
        setWaitingForSecondClick(true);
        setFirstFicha(ficha.id);
      } else if (event.target.closest(".card")) {
        onEventComplete();
      } else {
        onEventComplete();
      }
    }, 100);
  };

  return (
    <div>
      <Toaster />
      <CardMovUser
        img_url={movement.movimiento.img_url}
        movetype={movement.movimiento.movement}
        handleClick={handleClick}
        clicked={selectedCard === index}
        isUsed={movement.in_use}
        ganador={ganador}
      />
    </div>
  );
};

export default CardMovementContainer;
