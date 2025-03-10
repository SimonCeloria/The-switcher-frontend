import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginContainer from "../containers/LoginContainer";
import "@testing-library/jest-dom";
import PartidaServices from '../services/Partida';

import { client } from "../services/ConfigAxios"; // Mock client
import { data } from "autoprefixer";
vi.mock("../services/ConfigAxios", () => ({
  client: {
    post: vi.fn(),
  },
}));

vi.mock('../services/Partida', () => ({
  __esModule: true,
  default: {
    crearJugador: vi.fn(),
  },
}));
// Mock de react-router-dom
const mockedUseNavigate = vi.fn(); // Crea un mock para useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockedUseNavigate, // Retorna el mock
  };
});

vi.mock("../components/LoginForm", () => ({
  default: ({ name, handleName, handleSubmit, onEnter, serverError }) => (
    <form onSubmit={handleSubmit} data-testid="login-form">
      <input
        placeholder="Introduzca su nombre"
        type="text"
        name="nombre"
        value={name}
        onChange={handleName}
        onKeyDown={onEnter}
      />
      {serverError && <p>{serverError}</p>}
      <button type="submit">Iniciar sesión</button>
    </form>
  ),
}));

describe("LoginContainer", () => {
  beforeEach(() => {
    // Resetea los mocks antes de cada prueba
    vi.clearAllMocks();
    sessionStorage.clear(); // Limpia el sessionStorage antes de cada test
  });

  it("Llama setName al cambiar el input", async () => {
    const { container } = render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    const input = container.querySelector("input");

    fireEvent.change(input, { target: { value: "Juan" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input.value).toBe("Juan");
    });
  });

  it("Crea un jugador y redirige a /play", async () => {
    client.post.mockResolvedValue({ data: { id: 1 } });

    const { container } = render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    const input = container.querySelector("input");
    const form = container.querySelector("form");

    fireEvent.change(input, { target: { value: "      Juan   " } });
    fireEvent.blur(input);

    fireEvent.submit(form);
    PartidaServices.crearJugador.mockResolvedValueOnce({ data: {id:1} });

    await waitFor(() => {
      expect(sessionStorage.getItem("idPlayer")).toBe("1");
      expect(PartidaServices.crearJugador).toHaveBeenCalledWith(
        "Juan"
      );
      expect(mockedUseNavigate).toHaveBeenCalledWith("/play");
    });
  });

  it("Muestra un error si falla la creación del jugador", async () => {
    client.post.mockRejectedValue(new Error("Error al crear jugador"));

    const { container } = render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    const input = container.querySelector("input");
    const form = container.querySelector("form");

    fireEvent.change(input, { target: { value: "Juan" } });
    fireEvent.blur(input);

    fireEvent.submit(form);

    await waitFor(() => {
      expect(
        screen.getByText("Error al crear jugador. Por favor, intente de nuevo.")
      ).toBeInTheDocument();
    });
  });

  it("Redirige a /play si el jugador ya está logueado", async () => {
    sessionStorage.setItem("idPlayer", "1");

    render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedUseNavigate).toHaveBeenCalledWith("/play");
    });
  });

  it("Crea un jugador al presionar Enter", async () => {
    client.post.mockResolvedValue({ data: { id: 1 } });

    const { container } = render(
      <MemoryRouter>
        <LoginContainer />
      </MemoryRouter>
    );

    const input = container.querySelector("input");

    fireEvent.change(input, { target: { value: "Juan" } });
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(PartidaServices.crearJugador).toHaveBeenCalledWith(
        "Juan"
      );
    });
  });
});
