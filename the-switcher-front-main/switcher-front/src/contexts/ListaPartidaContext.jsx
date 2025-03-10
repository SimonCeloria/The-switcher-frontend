import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PartidaServices from "../services/Partida";

export const ListaPartidaContext = createContext();

export function ListaPartidaContextProvider(props) {
  const [showForm, setShowForm] = useState(false);
  const [gameList, setGameList] = useState([]);
  const [IdJugador, SetIdJugador] = useState(
    sessionStorage.getItem("idPlayer")
  );
  const navigate = useNavigate();

  const handleJoin = async (e, id_game, password) => {
    e.preventDefault();
    await PartidaServices.unirJugadorPartida(IdJugador, id_game, password).then(
      (response) => {
        sessionStorage.setItem("idPartida", response.data.partida_id);
      }
    );
    await PartidaServices.getPartida(id_game).then((partida) => {
      navigate(`/lobby/${partida.uui_partida}`);
    });
  };
  useEffect(() => {
    const idPlayer = sessionStorage.getItem("idPlayer");
    if (idPlayer && idPlayer !== "") {
      SetIdJugador(idPlayer);
    }
  }, []);

  return (
    <ListaPartidaContext.Provider
      value={{
        setShowForm: setShowForm,
        showForm: showForm,
        gameList: gameList,
        setGameList: setGameList,
        handleJoin: handleJoin,
        IdJugador: IdJugador,
        SetIdJugador: SetIdJugador,
      }}
    >
      {props.children}
    </ListaPartidaContext.Provider>
  );
}
