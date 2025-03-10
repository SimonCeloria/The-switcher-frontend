import React, { useState, useContext, useEffect } from "react";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import { client } from "../services/ConfigAxios";
import { apiBaseURL } from "../services/ApiBase";

import CardFigureUser from "../components/Cards/CardFigure";

import {
  GetFichaInfo,
  GetFigure,
  ErrorNotificationFig,
  isValidFigure,
  isValidBlock,
} from "./CardUtils";

const CardFigureContainer = ({
  figure,
  index,
  selectedCard,
  waitingForEvent,
  onCardClick,
  onEventComplete,
  isMyTurn,
  handLength,
}) => {
  const { highlightFigs, ganador, fichas, figuras, idJugador } =
    useContext(PartidaWSContext);
  const handleClick = async () => {
    if (!isMyTurn || waitingForEvent || ganador.nombre) return;

    // Seleccionar la carta
    onCardClick(index);

    setTimeout(async () => {
      // Espera el clic en la ficha
      const event = await waitForFirstEvent("click");
      const fichaElement = event.target.closest("[data-ficha-id]");
      var isBlock = false;

      if (fichaElement) {
        //agarro la ficha
        const ficha = GetFichaInfo(fichaElement);
        //agarro figura
        const figuraId = figure.id;
        const figuraPlayerId = figure.jugador_id;
        figuraPlayerId === Number(idJugador) ? null : (isBlock = true);

        // Comprobar si la ficha pertenece a alguna figura
        const figureComplete = GetFigure(ficha.coordenadas, highlightFigs);
        if (
          figureComplete &&
          isValidFigure(figureComplete.nombre, figure.figura.shape)
        ) {
          // La ficha es válida, enviar al backend
          UseFig(
            figureComplete.fichas,
            figuraId,
            fichas,
            isBlock,
            figuras,
            figuraPlayerId,
            idJugador
          );
        } else {
          figureComplete
            ? ErrorNotificationFig("No concuerda la figura")
            : ErrorNotificationFig("Uso de figura invalido");
        }

        // Completar el evento
        onEventComplete();
      } else {
        onEventComplete();
      }
    }, 100);
  };

  const waitForFirstEvent = (eventType) => {
    return new Promise((resolve) => {
      document.addEventListener(eventType, resolve, { once: true });
    });
  };

  return (
    <CardFigureUser
      block={figure.bloqueada}
      figuretype={figure.figura.img_url}
      handleClick={handleClick}
      clicked={selectedCard === index}
      ganador={ganador}
      handLength={handLength}
    />
  );
};

export default CardFigureContainer;

const UseFig = async (
  fichasFigure,
  figureId,
  fichas,
  isBlock,
  figuras,
  figuraPlayerId,
  idJugador
) => {
  const lista_fichas = [];
  fichasFigure.map((elem) => {
    lista_fichas.push(fichas[elem].id);
  });
  const requestBody = {
    carta_figura: Number(figureId),
    lista_fichas: lista_fichas,
  };
  console.log(idJugador);
  isBlock
    ? isValidBlock(figuras, figuraPlayerId)
      ? BlockFig(requestBody, idJugador)
      : null
    : DiscardFig(requestBody);
};

const BlockFig = async (requestBody, idJugador) => {
  try {
    requestBody = { ...requestBody, jugador_id: Number(idJugador) };
    console.log("Request body", requestBody);
    const response = await client.post(
      `${apiBaseURL}bloquear_figura`,
      requestBody
    );

    return response;
  } catch (error) {
    console.error(
      "Error al realizar el movimiento:",
      error.response ? error.response.data : error.message
    );
  }
};

const DiscardFig = async (requestBody) => {
  try {
    const response = await client.post(`${apiBaseURL}figura`, requestBody);

    return response;
  } catch (error) {
    console.error(
      "Error al realizar el movimiento:",
      error.response ? error.response.data : error.message
    );
  }
};
