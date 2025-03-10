import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PartidaServices from "../services/Partida";
import useWebSocket from "react-use-websocket";
import { ListaPartidaContext } from "../contexts/ListaPartidaContext";
import ListaPartidasComp from "../pages/ListaPartidas";
import { isAnimated } from "../Styles/AnimationVariable";

const ListaPartidasContainer = () => {
  const crearPartida = useContext(ListaPartidaContext);
  const [filter, setFilter] = useState("");
  const [playerCount, setPlayerCount] = useState([]);
  const [cancelled, setCancelled] = useState(false);
  const [LocalAnimated, setLocalAnimated] = useState(isAnimated);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.cancel) {
      setCancelled(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchGames();
  }, []);

  const WS_URL = `ws://${import.meta.env.VITE_IP}:8080/global/${
    crearPartida.IdJugador
  }`;
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WS_URL,
    {
      shouldReconnect: (closeEvent) => true,
      onOpen: () => console.log("WebSocketPartida Connected"),
      onMessage: (message) => {
        const data = JSON.parse(message.data);
        console.log(`Got a new message: ${data}`);
        if (data != null && data.type === "update game list") {
          crearPartida.setGameList(data.data);
        }
      },
      onClose: () => console.log("WebSocketPartida Disconnected"),
      onError: (error) => console.error(error),
    }
  );

  const fetchGames = async () => {
    try {
      const response = await PartidaServices.listPartidas();
      crearPartida.setGameList(response);
    } catch (error) {
      console.log("Error al obtener partidas:", error);
    }
  };

  return (
    <ListaPartidasComp
      filter={filter}
      setFilter={setFilter}
      playerCount={playerCount}
      setPlayerCount={setPlayerCount}
      cancelled={cancelled}
      LocalAnimated={LocalAnimated}
      setLocalAnimated={setLocalAnimated}
    />
  );
};

export default ListaPartidasContainer;
