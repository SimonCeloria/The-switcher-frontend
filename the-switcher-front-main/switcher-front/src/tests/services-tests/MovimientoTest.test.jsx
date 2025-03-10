import { describe, it, expect, vi } from "vitest";
import MovServices from "../../services/Movimiento"; 
import { client } from "../../services/ConfigAxios"; // Adjust to import `client` correctly
import { apiBaseURL } from "../../services/ApiBase";
// Mock the Axios client
vi.mock("../../services/ConfigAxios", () => ({
  client: {
    post: vi.fn(), // Ensure post is a mock function
  },
}));

describe("MovServices", () => {
  const partidaId = "12345"; // Example partida ID
  const ficha1 = 1
  const ficha2 = 2
  const carta = 3;

  afterEach(() => {
    // Clear mock calls after each test
    vi.clearAllMocks();
  });

  it("should call the API to rollback the movement", async () => {
    // Arrange
    const mockResponse = { data: { success: true } };
    client.post.mockResolvedValue(mockResponse); 

    // Act
    const response = await MovServices.rollback(partidaId);

    // Assert
    expect(client.post).toHaveBeenCalledWith(`${apiBaseURL}movimiento/deshacer`, {
      partida_id: partidaId,
    });
    expect(response).toEqual(mockResponse); 
  });

  it("should log an error if the API call fails", async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, "log");
    client.post.mockRejectedValue(new Error("API Error")); 
    // Act
    await MovServices.rollback(partidaId);

    // Assert
    expect(client.post).toHaveBeenCalled(); 
    expect(consoleSpy).toHaveBeenCalledWith("error while rollbacking mov"); 
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should call the API to make a movement", async () => {
    // Arrange
    const mockResponse = { data: { success: true } };
    client.post.mockResolvedValue(mockResponse); 

    // Act
    const response = await MovServices.hacerMovimientoPartida(ficha1, ficha2, carta);

    // Assert
    expect(client.post).toHaveBeenCalledWith(`${apiBaseURL}movimiento`, {
      carta_mov: carta,
      ficha1: ficha1,
      ficha2: ficha2,
    });
    expect(response).toEqual(mockResponse); 
  });

  it("should log an error if the API call fails (hacerMovimiento)", async () => {
    // Arrange
    const consoleSpy = vi.spyOn(console, "log"); 
    client.post.mockRejectedValue(new Error("API Error")); 
    // Act
    await MovServices.hacerMovimientoPartida(partidaId);

    // Assert
    expect(client.post).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("error al realizar un movimiento");
    expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error)); 
  });
});
