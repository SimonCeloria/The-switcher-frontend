import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ListaPartidaContext } from "../contexts/ListaPartidaContext";
import PartidaServices from "../services/Partida";
import CreateGameForm from "../components/CreateGameForm";

const CreateGameContainer = () => {
  const crearPartida = useContext(ListaPartidaContext);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      const resp = await PartidaServices.crearPartida(
        data.nombrePartida,
        data.cantMin,
        data.cantMax,
        crearPartida.IdJugador,
        data.esPrivada ? data.contraseña : null
      );

      sessionStorage.setItem("idPartida", resp.data.id);
      crearPartida.setShowForm(false);
      navigate(`/lobby/${resp.data.uui_partida}`);
    } catch (e) {
      crearPartida.setShowForm(false);
      console.error("Error al crear la partida:", e);
    }
  };

  // Función para cerrar el formulario modal
  const handleClose = () => {
    crearPartida.setShowForm(false);
  };

  return (
    <CreateGameForm
      handleSubmit={handleSubmit}
      handleClose={handleClose}
      showForm={crearPartida.showForm}
    />
  );
};

export default CreateGameContainer;
