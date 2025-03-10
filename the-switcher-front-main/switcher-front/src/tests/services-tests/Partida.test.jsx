import { describe, it, expect, vi } from "vitest";
import PartidaServices from "../../services/Partida"; 
import { client } from "../../services/ConfigAxios"; // Asegúrate de importar el cliente correctamente
import { apiBaseURL } from "../../services/ApiBase";

// Mock el cliente Axios
vi.mock("../../services/ConfigAxios", () => ({
  client: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("PartidaServices", () => {
  const partidaId = "12345"; // ID de partida de ejemplo
  const jugadorId = "67890"; // ID de jugador de ejemplo
  const nombre = "Jugador1";
  const password = "contraseña123";
  const nombrePartida = "PartidaTest";
  const minJugadores = 2;
  const maxJugadores = 4;

  afterEach(() => {
    // Limpiar las llamadas simuladas después de cada prueba
    vi.clearAllMocks();
  });

  it("should create a new player", async () => {
    // Arrange
    const mockResponse = { data: { success: true } };
    client.post.mockResolvedValue(mockResponse);

    // Act
    const response = await PartidaServices.crearJugador(nombre);

    // Assert
    expect(client.post).toHaveBeenCalledWith(`${apiBaseURL}jugador`, { nombre });
    expect(response).toEqual(mockResponse);
  });

  it("should call the API to list partidas", async () => {
    // Arrange
    const mockResponse = { data: [{ id: "1", name: "Partida 1" }] };
    client.get.mockResolvedValue(mockResponse);

    // Act
    const partidas = await PartidaServices.listPartidas();

    // Assert
    expect(client.get).toHaveBeenCalled();
    expect(partidas).toEqual(mockResponse.data);
  });

  it("should create a new partida", async () => {
    // Arrange
    const mockResponse = { data: { success: true } };
    client.post.mockResolvedValue(mockResponse);

    // Act
    const response = await PartidaServices.crearPartida(nombrePartida, minJugadores, maxJugadores, jugadorId, password);

    // Assert
    expect(client.post).toHaveBeenCalledWith(`${apiBaseURL}partida`, {
      nombre: nombrePartida,
      minJugadores: minJugadores,
      maxJugadores: maxJugadores,
      owner: jugadorId,
      password: password,
    });
    expect(response).toEqual(mockResponse);
  });

  it("should call the API to join a partida", async () => {
    // Arrange
    const mockResponse = { data: { success: true } };
    client.post.mockResolvedValue(mockResponse);

    // Act
    const response = await PartidaServices.unirJugadorPartida(jugadorId, partidaId, password);

    // Assert
    expect(client.post).toHaveBeenCalledWith(`${apiBaseURL}partida/unirse-partida`, {
      partida_id: partidaId,
      jugador_id: jugadorId,
      password: password,
    });
    expect(response).toEqual(mockResponse);
  });

  it("should log an error if joining a partida fails", async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, "log");
    client.post.mockRejectedValue(new Error("API Error"));

    // Act
    await PartidaServices.unirJugadorPartida(jugadorId, partidaId, password);

    // Assert
    expect(client.post).toHaveBeenCalled();

  });

  it("should call the API to start a partida", async () => {
    // Arrange
    const mockResponse = { data: { success: true } };
    client.post.mockResolvedValue(mockResponse);

    // Act
    const response = await PartidaServices.iniciarPartida(jugadorId, partidaId);

    // Assert
    expect(client.post).toHaveBeenCalledWith(`${apiBaseURL}partida/iniciar-partida`, {
      partida_id: partidaId,
      jugador_id: jugadorId,
    });
    expect(response).toEqual(mockResponse);
  });

  it("should call the API to send a message in a partida", async () => {
    // Arrange
    const mockResponse = { data: { success: true } };
    client.post.mockResolvedValue(mockResponse);

    // Act
    const response = await PartidaServices.enviarMensaje(jugadorId, partidaId, "Hola!");

    // Assert
    expect(client.post).toHaveBeenCalledWith(`${apiBaseURL}partida/difundir-mensaje`, {
      jugador_id: jugadorId,
      partida_id: partidaId,
      mensaje: "Hola!",
    });
    expect(response).toEqual(mockResponse);
  });
});
