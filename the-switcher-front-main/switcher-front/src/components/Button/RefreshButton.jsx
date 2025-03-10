import PartidaServices from "../../services/Partida";
import { ListaPartidaContext } from "../../contexts/ListaPartidaContext";
import { useContext } from "react";

export function RefreshPartidasButton() {
  const listContext = useContext(ListaPartidaContext);

  const fetchGames = async (e) => {
    e.preventDefault();
    try {
      const response = await PartidaServices.listPartidas();
      listContext.setGameList(response);
    } catch (error) {
      console.log("Error al obtener partidas:", error);
    }
  };

  return (
    <button
      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
      onClick={(e) => {
        fetchGames(e);
      }}
    >
      REFRESCAR
    </button>
  );
}
