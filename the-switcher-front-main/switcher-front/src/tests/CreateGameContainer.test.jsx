import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import CreateGameContainer from "../containers/CreateGameContainer";
import { ListaPartidaContext } from "../contexts/ListaPartidaContext";
import { MemoryRouter } from "react-router-dom";
import PartidaServices from "../services/Partida";

vi.mock("../services/Partida", () => ({
  default: {
    crearPartida: vi.fn(),
  },
}));

const mockedUseNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual, 
    useNavigate: () => mockedUseNavigate, 
  };
});

const mockSetItem = vi.fn();
global.sessionStorage = {
  setItem: mockSetItem,
};

// Mock CreateGameForm
vi.mock("../components/CreateGameForm", () => ({
  __esModule: true,
  default: ({ handleSubmit, handleClose }) => {
    const mockData = {
      nombrePartida: "Test Game",
      cantMin: 2,
      cantMax: 4,
      esPrivada: false,
      contraseña: "",
    };

    return (
      <div>
        Mock CreateGameForm
        <button onClick={() => handleSubmit(mockData)}>Submit</button>
        <button onClick={handleClose}>Close</button>
      </div>
    );
  },
}));

// Mock ListaPartidaContext
const setShowForm = vi.fn();
const mockListaPartidaContext = {
  IdJugador: "1",
  listaPartida: [],
  setListaPartida: vi.fn(),
  setShowForm,
  showForm: true,
};

describe("CreateGameContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should handle form input change and submit correctly", async () => {
    PartidaServices.crearPartida.mockResolvedValue({
      data: { id: 1, uui_partida: "partida123" },
    });

    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockListaPartidaContext}>
          <CreateGameContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(PartidaServices.crearPartida).toHaveBeenCalledWith(
        "Test Game",
        2,
        4,
        "1", 
        null
      );
    });

    expect(mockSetItem).toHaveBeenCalledWith("idPartida", 1);
    expect(mockListaPartidaContext.setShowForm).toHaveBeenCalledWith(false);
    expect(mockedUseNavigate).toHaveBeenCalledWith("/lobby/partida123");
  });

  it("should handle an exception correctly", async () => {
    PartidaServices.crearPartida.mockRejectedValueOnce(new Error("Test error"));

    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockListaPartidaContext}>
          <CreateGameContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Submit"));
    
    await waitFor(() => {
      expect(mockListaPartidaContext.setShowForm).toHaveBeenCalledWith(false);
      expect(console.error).toHaveBeenCalledWith(
        "Error al crear la partida:",
        new Error("Test error")
      );
    });
  });

  it("should close the form when handleClose is called", async () => {
    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockListaPartidaContext}>
          <CreateGameContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Close"));

    await waitFor(() => {
      expect(mockListaPartidaContext.setShowForm).toHaveBeenCalledWith(false);
    });
  });
});
