import React, { useState, useEffect, useContext, useRef } from "react";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import "../Styles/Temporizador.css";

const CountdownTimer = () => {
  const partidaContext = useContext(PartidaWSContext);
  const dosMinutos = 119; // 2 minutos menos 1 segundo asi se ve el 0:00

  // ver si esta en sessionStorage tiempoFaltante
  const [tiempoFaltante, setTiempoFaltante] = useState(
    sessionStorage.getItem("tiempoFaltante")
      ? parseInt(sessionStorage.getItem("tiempoFaltante"), 10)
      : dosMinutos
  );

  // ver si esta en sessionStorage fechaAlEmpezar
  const fechaAlEmpezar = useRef(
    sessionStorage.getItem("fechaAlEmpezar")
      ? parseInt(sessionStorage.getItem("fechaAlEmpezar"), 10)
      : Date.now()
  );

  // Reset temporizador al empezar un nuevo turno
  useEffect(() => {
    if (partidaContext.turnoNuevo) {
      setTiempoFaltante(dosMinutos);
      fechaAlEmpezar.current = Date.now();
      sessionStorage.setItem("fechaAlEmpezar", fechaAlEmpezar.current);
      partidaContext.setTurnoNuevo(false);
    }
  }, [partidaContext.turnoNuevo]);

  // Update tiempoFaltante every second
  useEffect(() => {
    const segundero = setInterval(() => {
      const elapsedTime = Math.floor(
        (Date.now() - fechaAlEmpezar.current) / 1000
      );
      const tiempoRestante = dosMinutos - elapsedTime;
      if (partidaContext.ganador.nombre) {
        clearInterval(segundero); // Parar si hay un ganador
      } else {
        if (tiempoRestante >= 0) {
          setTiempoFaltante(tiempoRestante);
        } else {
          setTiempoFaltante(0);
          clearInterval(segundero); // Parar si llega a 0
        }
      }
    }, 1000);

    return () => clearInterval(segundero);
  }, [partidaContext.turnoNuevo, partidaContext.ganador.nombre]);

  useEffect(() => {
    sessionStorage.setItem("tiempoFaltante", tiempoFaltante); // Guardar en sessionStorage para persistencia
  }, [tiempoFaltante]);

  // Actualizar variables CSS
  useEffect(() => {
    document.documentElement.style.setProperty("--t", tiempoFaltante);
    document.documentElement.style.setProperty(
      "--blink-animation",
      tiempoFaltante <= 10 ? "blink 1s step-start infinite" : "none"
    );
  }, [tiempoFaltante]);

  // Color de texto, rojo si queda menos de 30 segundos
  const estiloDeTemporizador = {
    color: tiempoFaltante <= 30 ? "crimson" : "black",
  };

  const d = 100,
    o = -0.5 * d;
  const sw = 0.1 * d,
    r = 0.5 * (d - sw);

  return (
    <div
      className="countdown-timer countdown"
      style={estiloDeTemporizador}
      data-testid="countdown-timer"
    >
      <svg viewBox={`${o} ${o} ${d} ${d}`} strokeWidth={sw}>
        <circle r={r}></circle>
        <circle r={r} pathLength="1"></circle>
      </svg>
    </div>
  );
};

export default CountdownTimer;
