import React, { createContext, useEffect, useState, useContext } from "react";
import useWebSocket from "react-use-websocket";
import PartidaServices from "../services/Partida";
import MovServices from "../services/Movimiento";
import { useNavigate } from "react-router-dom";
import { PartidaContext } from "./PartidaContext";
import { set } from "react-hook-form";
import { apiBaseURL } from "../services/ApiBase";

// INITIAL CONTEXT
const PLAYER_ONE_TURN = 1;
const INITIAL_VALUE_MYTURN = 0;
const INITIAL_VALUE_IS_MY_TURN = false;
const INITIAL_VALUE_ONLY_ONE_EXC_FLAG = true;
const INITIAL_CURRENT_TURN = 1;

export const PartidaWSContext = createContext();

export const PartidaWSContextProvider = (props) => {
  const parent = useContext(PartidaContext);
  const [idJugador, setIdJugador] = useState(
    sessionStorage.getItem("idPlayer")
  ); //TODO: chequear valores de idJugador
  const [idPartida, setIdPartida] = useState(parent.idPartida);
  const [jugadores, setJugadores] = useState([]);
  const [ganador, setGanador] = useState({});
  const [turnos, setTurnos] = useState([]);
  const [MyTurn, setMyTurn] = useState(INITIAL_VALUE_MYTURN);
  const [isMyTurn, setIsMyTurn] = useState(INITIAL_VALUE_IS_MY_TURN);
  const [currentTurn, setCurrentTurn] = useState(INITIAL_CURRENT_TURN);
  const [turnoNuevo, setTurnoNuevo] = useState(false);
  const [fichas, setFichas] = useState([]);
  const [partida, setPartida] = useState({});
  const [UUID, setUUID] = useState("invalid");
  const [OnlyOneExcFlag, setFlag] = useState(INITIAL_VALUE_ONLY_ONE_EXC_FLAG);
  const [colorBloqueado, setUltimoColor] = useState("none");

  const [movimientos, setMovimientos] = useState([]);
  const [figuras, setFiguras] = useState(
    JSON.parse(sessionStorage.getItem("figuras"))
  );

  const [amountMovs, setAmountMovs] = useState([]);

  const [highlightFigs, setHighlightFigs] = useState({});
  const [highlightCoords, setHighlightCoords] = useState([]);
  const [highlightFigsCoords, setHighlightFigsCoords] = useState([]);
  const [highlightMovsCoords, setHighlightMovsCoords] = useState([]);

  const [mensajes, setMensajes] = useState([]);

  const cleanSession = () => {
    sessionStorage.removeItem("jugadores");
    sessionStorage.removeItem("fichas");
    sessionStorage.removeItem("turnos");
    sessionStorage.removeItem("currentTurn");
    sessionStorage.removeItem("figuras");
    sessionStorage.removeItem("movimientos");
    sessionStorage.removeItem("esmiturno");
    sessionStorage.removeItem("onlyoneexcflag");
    sessionStorage.removeItem("ganador");
    sessionStorage.removeItem("highlightFigsCoords");
    sessionStorage.removeItem("highlightFigs");
    sessionStorage.removeItem("amountMovs");
    sessionStorage.removeItem("highlightMovsCoords");
    sessionStorage.removeItem("colorBloqueado");
    sessionStorage.removeItem("tiempoFaltante");
    sessionStorage.removeItem("fechaAlEmpezar");
  };

  useEffect(() => {
    const savedJugadores = sessionStorage.getItem("jugadores");
    const savedFichas = sessionStorage.getItem("fichas");
    const savedTurnos = sessionStorage.getItem("turnos");
    const savedCurrentTurn = sessionStorage.getItem("currentTurn");
    const savedFiguras = sessionStorage.getItem("figuras");
    const savedMovimientos = sessionStorage.getItem("movimientos");
    const savedIsMyTurn = sessionStorage.getItem("esmiturno");
    const savedOnlyOneExcFlag = sessionStorage.getItem("onlyoneexcflag");
    const savedGanador = sessionStorage.getItem("ganador");
    const savedhighlightFigsCoords = sessionStorage.getItem(
      "highlightFigsCoords"
    );
    const savedAmountMovs = sessionStorage.getItem("amountMovs");
    const savedhighlightMovsCoords = sessionStorage.getItem(
      "highlightMovsCoords"
    );
    const savedhighlightFigs = sessionStorage.getItem("highlightFigs");
    const savedColorBloqueado = sessionStorage.getItem("colorBloqueado");

    if (savedJugadores) setJugadores(JSON.parse(savedJugadores));
    if (savedFichas) setFichas(JSON.parse(savedFichas));
    if (savedTurnos) setTurnos(JSON.parse(savedTurnos));
    if (savedCurrentTurn) setCurrentTurn(JSON.parse(savedCurrentTurn));
    if (savedFiguras) setFiguras(JSON.parse(savedFiguras));
    if (savedMovimientos) setMovimientos(JSON.parse(savedMovimientos));
    if (savedIsMyTurn) setIsMyTurn(JSON.parse(savedIsMyTurn));
    if (savedOnlyOneExcFlag) setFlag(JSON.parse(savedOnlyOneExcFlag));
    if (savedGanador) setGanador(JSON.parse(savedGanador));
    if (savedhighlightFigsCoords)
      setHighlightFigsCoords(JSON.parse(savedhighlightFigsCoords));
    if (savedAmountMovs) setAmountMovs(JSON.parse(savedAmountMovs));
    if (savedhighlightMovsCoords)
      setHighlightMovsCoords(JSON.parse(savedhighlightMovsCoords));
    if (savedhighlightFigs) setHighlightFigs(JSON.parse(savedhighlightFigs));
    if (savedColorBloqueado) setUltimoColor(JSON.parse(savedColorBloqueado));
  }, []);

  useEffect(() => {
    sessionStorage.setItem("ganador", JSON.stringify(ganador));
  }),
    [ganador];

  useEffect(() => {
    sessionStorage.setItem("jugadores", JSON.stringify(jugadores));
  }, [jugadores]);

  useEffect(() => {
    sessionStorage.setItem(
      "highlightFigsCoords",
      JSON.stringify(highlightFigsCoords)
    );
  }, [highlightFigsCoords]);

  useEffect(() => {
    sessionStorage.setItem("highlightFigs", JSON.stringify(highlightFigs));
  }, [highlightFigs]);

  useEffect(() => {
    sessionStorage.setItem("colorBloqueado", JSON.stringify(colorBloqueado));
  }, [colorBloqueado]);

  useEffect(() => {
    sessionStorage.setItem(
      "highlightMovsCoords",
      JSON.stringify(highlightMovsCoords)
    );
  }, [highlightMovsCoords]);

  useEffect(() => {
    sessionStorage.setItem("fichas", JSON.stringify(fichas));
  }, [fichas]);

  useEffect(() => {
    sessionStorage.setItem("turnos", JSON.stringify(turnos));
  }, [turnos]);

  useEffect(() => {
    sessionStorage.setItem("currentTurn", JSON.stringify(currentTurn));
  }, [currentTurn]);

  useEffect(() => {
    sessionStorage.setItem("figuras", JSON.stringify(figuras));
  }, [figuras]);

  useEffect(() => {
    sessionStorage.setItem("movimientos", JSON.stringify(movimientos));
  }, [movimientos]);

  useEffect(() => {
    sessionStorage.setItem("esmiturno", JSON.stringify(isMyTurn));
  }, [isMyTurn]);

  useEffect(() => {
    sessionStorage.setItem("onlyoneexcflag", JSON.stringify(OnlyOneExcFlag));
  }, [OnlyOneExcFlag]);
  useEffect(() => {
    sessionStorage.setItem("amountMovs", JSON.stringify(amountMovs));
  }, [amountMovs]);
  /////////
  const navigate = useNavigate();
  useEffect(() => {
    PartidaServices.listJugadoresPartida(idPartida).then((resp) => {
      setJugadores(resp);
    });
    PartidaServices.getPartida(idPartida).then((resp) => {
      setPartida(resp);
      setUUID(resp.uui_partida);
    });
  }, []);

  const handleLeave = async (e) => {
    e.preventDefault();
    await PartidaServices.abandonarPartida(idJugador, idPartida).then(
      (resp) => {
        // Clean the session storage for the 7 set states
        cleanSession();
        navigate("/play");
      }
    );
  };

  const handleStart = async (e) => {
    e.preventDefault();
    await PartidaServices.iniciarPartida(idJugador, idPartida).then(() => {
      console.log("Cree partida");
    });
  };

  const handleMsg = async (msg, isLog) => {
    await PartidaServices.enviarMensaje(idJugador, idPartida, msg, isLog).then(
      () => {
        console.log("Envie un mensaje");
      }
    );
  };

  const handleSkip = async (e) => {
    e.preventDefault();
    await PartidaServices.pasarTurno(idJugador, idPartida)
      .then(() => {
        return PartidaServices.listJugadoresPartida(idPartida);
      })
      .then((resp) => {
        setJugadores(resp);
      });
  };

  const handleRollback = async (e) => {
    e.preventDefault();
    await MovServices.rollback(idPartida).then((resp) => {
      console.log("Rollback realizado");
    });
  };

  //funcion establecer resaltado
  const updateHighlightCoords = (newHighlightCoords) => {
    setHighlightCoords(newHighlightCoords);
  };
  const updateHighlightMovsCoords = (newHighlightCoords) => {
    setHighlightMovsCoords(newHighlightCoords);
  };

  const WS_URL = `ws://${
    import.meta.env.VITE_IP
  }:8080/partida/${idPartida}/${idJugador}`;

  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => console.log("WebSocketPartida Connected"),
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      if (data.type == "jugadores_partida") {
        setJugadores(data.data);
      }
      if (data.type == "ganador") {
        setGanador(data.data);
        const logGanador = {
          mensaje: `El ganador es ${data.data.nombre}`,
          ganador: true,
          is_log: true,
        };
        setMensajes((prevMensajes) => [...prevMensajes, logGanador]);
      }
      if (data.type == "fichas") {
        setFichas(data.data);
        navigate(`/game/${UUID}`);
      }
      if (data.type == "cancelar_partida") {
        const owner = data.data.owner;
        if (idJugador != owner) {
          cleanSession();
          navigate("/play", { state: { cancel: true } });
        }
      }

      if (data.type == "turnos") {
        setTurnoNuevo(true);
        setTurnos(data.data);
      }
      if (data.type == "turno_actual") {
        let CurrentTurn = data.data;
        setCurrentTurn(CurrentTurn);
        setIsMyTurn(MyTurn == CurrentTurn);
        sessionStorage.setItem("esmiturno", MyTurn == CurrentTurn);
        setTurnoNuevo(true);
      }
      if (data.type === "cartas_figura") {
        const {
          "id jugador": idJugador,
          "en mano": enMano,
          "en mazo": enMazo,
        } = data.data;

        // Actualiza el estado usando el id del jugador como clave
        setFiguras((prevFiguras) => ({
          ...prevFiguras,
          [idJugador]: { enMano, enMazo },
        }));
      }
      if (data.type == "cartas_movimiento") {
        setMovimientos(data.data);
      }
      if (data.type === "cantidad_movimientos") {
        const { "id jugador": idJugador, cantidad: cantidad } = data.data;

        // Actualiza el estado usando el id del jugador como clave
        setAmountMovs((prevAmountMovs) => ({
          ...prevAmountMovs,
          [idJugador]: { cantidad },
        }));
      }
      if (data.type == "figuras_tablero") {
        const figuras = data.data;
        const coord = figuras.map((figura) => figura.fichas);
        setHighlightFigsCoords(coord);
        setHighlightFigs(figuras);
      }

      if (data.type == "ultimo_movimiento_parcial") {
        const { fichas } = data.data;
        const coords = fichas.map(({ xCord, yCord }) => ({ xCord, yCord }));
        setHighlightMovsCoords(coords);
      }

      if (data.type == "ultima_figura") {
        const discards = data.data;
        const jugador = jugadores.find(
          (jugador) => jugador.id === discards.carta.jugador_id
        );
        if (discards.carta && discards.carta.figura) {
          const logFigura = {
            jugador_id: discards.carta.jugador_id,
            figura: discards.carta.figura.img_url,
            mensaje: `${jugador.nombre} completo la figura`,
            is_log: true,
          };
          setMensajes((prevMensajes) => [...prevMensajes, logFigura]);
        } else {
          console.error(
            "Figura o carta no definida en ultima_figura:",
            discards.carta
          );
        }
      }

      if (data.type == "abandono_partida") {
        const abandono = data.data;
        const logAbandono = {
          abandono: true,
          jugador_id: abandono.jugador_id,
          mensaje: `${abandono.nombre} abandono la partida`,
          is_log: true,
        };
        setMensajes((prevMensajes) => [...prevMensajes, logAbandono]);
      }

      if (data.type == "figura_bloqueada") {
        const bloqueada = data.data;
        const jugador = jugadores.find(
          (jugador) => jugador.id === bloqueada.id_jugador
        );
        const jugadorBloqueado = jugadores.find(
          (jugador) => jugador.id === bloqueada.id_bloqueado
        );
        const logFigura = {
          jugador_bloqueado_id: bloqueada.id_bloqueado,
          jugador_id: bloqueada.id_jugador,
          figura: bloqueada.figura_url,
          mensaje: `${jugador.nombre} bloqueo una figura de ${jugadorBloqueado.nombre}`,
          is_log: true,
        };
        setMensajes((prevMensajes) => [...prevMensajes, logFigura]);
      }

      if (data.type == "carta_usada") {
        const movimiento = data.data;
        const jugador = jugadores.find(
          (jugador) => jugador.id === movimiento.id_jugador
        );
        const logMovimiento = {
          jugador_id: movimiento.id_jugador,
          carta: movimiento.carta_url,
          mensaje: `${jugador.nombre} utilizó la carta`,
          is_log: true,
        };
        setMensajes((prevMensajes) => [...prevMensajes, logMovimiento]);
      }

      if (data.type == "color_bloqueado") {
        const colorBloqueado = data.data;
        setUltimoColor(colorBloqueado);
      }

      if (data.type == "mensaje_chat") {
        const newMsg = data.data;
        if (data.data.mensaje === "/rickroll") {
          console.log("Rickrolled");
          const audio = new Audio("/sounds/Rickroll.mp3");
          audio.volume = 0.3;
          audio.play();
        }
        setMensajes((prevMensajes) => [...prevMensajes, newMsg]);
      }
    },
    onClose: () => console.log("WebSocketPartida Disconnected"),
    onError: (error) => console.error(`WebSocket Error: ${error}`),
    shouldReconnect: (closeEvent) => true, // Reintenta reconectar en caso de fallo
  });

  useEffect(() => {
    if (MyTurn == PLAYER_ONE_TURN && OnlyOneExcFlag) {
      //Solo el jugador 1 va a entrar aca la primera vez
      setFlag(false);
      setIsMyTurn(true);
    }
  }, [MyTurn, OnlyOneExcFlag]);

  useEffect(() => {
    turnos.map((turno) => {
      if (turno.jugador_id == idJugador) {
        setMyTurn(turno.turno);
      }
    });
  }, [turnos]);

  return (
    <PartidaWSContext.Provider
      value={{
        //Variables
        idJugador,
        jugadores,
        ganador,
        MyTurn,
        isMyTurn,
        turnos,
        currentTurn,
        turnoNuevo,
        partida,
        UUID,
        fichas,
        movimientos,
        figuras,
        amountMovs,
        highlightCoords,
        highlightFigsCoords,
        highlightMovsCoords,
        highlightFigs,
        mensajes,
        colorBloqueado,
        //Funciones
        setJugadores,
        setMensajes,
        setTurnoNuevo,
        handleMsg,
        setUUID,
        handleSkip,
        handleLeave,
        handleStart,
        handleRollback,
        updateHighlightCoords,
        updateHighlightMovsCoords,
      }}
    >
      {props.children}
    </PartidaWSContext.Provider>
  );
};
