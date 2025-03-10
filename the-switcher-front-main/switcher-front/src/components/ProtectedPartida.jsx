import { useParams, Navigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { PartidaContext } from "../contexts/PartidaContext";

export const ProtectedPartida = ({ children }) => {
  const { uuidPartida } = useParams(); // obtengo uuid de la partida a través de la url
  const partidaParent = useContext(PartidaContext); // context para gestionar la partida desde el parent
  const idPartidaStorage = sessionStorage.getItem("idPartida");
  const regex = /-(\d+)$/;
  const match = uuidPartida.match(regex);
  const idPartidaUrl = match ? match[1] : null; //id de la partida

  useEffect(() => {
    if (idPartidaUrl !== idPartidaStorage) {
      // actualizar sessionStorage y el context si no coinciden
      sessionStorage.setItem("idPartida", idPartidaUrl);
      partidaParent.setIdPartida(idPartidaUrl);
    } else {
      partidaParent.setIdPartida(idPartidaStorage);
    }
  }, [idPartidaUrl, idPartidaStorage, partidaParent.setIdPartida]);

  if (!idPartidaUrl) {
    //en caso de que no haya una uuid en la partida lo redirige a play
    return <Navigate to="/play" />;
  }

  return children;
};
