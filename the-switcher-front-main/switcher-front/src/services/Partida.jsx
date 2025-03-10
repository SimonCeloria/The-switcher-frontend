import { client } from "./ConfigAxios";
import { apiBaseURL } from "./ApiBase";

const PartidaServices = {
  crearJugador: async (nombre) => {
    const response = await client
      .post(`${apiBaseURL}jugador`, {
        nombre: nombre,
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  },
  listPartidas: async () => {
    const response = await client.get("partida");
    return response.data;
  },
  crearPartida: async (
    nombrePartida,
    minJugadores,
    maxJugadores,
    owner,
    password
  ) => {
    const resp = await client
      .post(`${apiBaseURL}partida`, {
        nombre: nombrePartida,
        minJugadores: minJugadores,
        maxJugadores: maxJugadores,
        owner: owner,
        password: password,
      })
      .catch(() => {
        console.log("errors");
      });
    return resp;
  },
  unirJugadorPartida: async (jugadorId, partidaId, password) => {
    try {
      const response = await client.post(
        `${apiBaseURL}partida/unirse-partida`,
        {
          partida_id: partidaId,
          jugador_id: jugadorId,
          password: password,
        }
      );
      return response;
    } catch (error) {
      console.error("Error en unirJugadorPartida:", error);
      return undefined;
    }
  },

  iniciarPartida: async (jugadorId, partidaId) => {
    const response = await client
      .post(`${apiBaseURL}partida/iniciar-partida`, {
        partida_id: partidaId,
        jugador_id: jugadorId,
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  },
  pasarTurno: async (jugadorId, partidaId) => {
    const response = await client
      .post(`${apiBaseURL}pasar-turno/${partidaId}/${jugadorId}`, {
        partida_id: partidaId,
        jugador_id: jugadorId,
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  },
  abandonarPartida: async (jugadorId, partidaId) => {
    const response = await client
      .post(`${apiBaseURL}partida/abandonar-partida`, {
        partida_id: partidaId,
        jugador_id: jugadorId,
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  },
  enviarMensaje: async (jugadorId, partidaId, msg) => {
    const response = await client
      .post(`${apiBaseURL}partida/difundir-mensaje`, {
        jugador_id: jugadorId,
        partida_id: partidaId,
        mensaje: msg,
      })
      .catch((e) => {
        console.log(e);
      });
    return response;
  },
  listJugadoresPartida: async (id_game) => {
    const response = await client({
      method: "GET",
      url: `jugadores-partida/${id_game}`,
    });
    return response.data;
  },
  getPartida: async (id_game) => {
    const response = await client({
      method: "GET",
      url: `partida/${id_game}`,
    });
    return response.data;
  },
};

export default PartidaServices;
