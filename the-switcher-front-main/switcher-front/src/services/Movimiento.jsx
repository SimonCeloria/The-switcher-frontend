import { client } from "./ConfigAxios";
import { apiBaseURL } from "./ApiBase";

const MovServices = {
  rollback: async (partida_id) => {
    const resp = await client
      .post(`${apiBaseURL}movimiento/deshacer`, {
        partida_id: partida_id,
      })
      .catch((error) => {
        console.log("error while rollbacking mov");
        console.log(error);
      });
    return resp;
  },

  hacerMovimientoPartida: async (ficha1, ficha2, carta) => {
    const response = await client
      .post(`${apiBaseURL}movimiento`, {
        carta_mov: parseInt(carta),
        ficha1: parseInt(ficha1),
        ficha2: parseInt(ficha2),
      })
      .catch((error) => {
        console.log("error al realizar un movimiento");
        console.log(error);
      });
    return response;
  },
};

export default MovServices;
