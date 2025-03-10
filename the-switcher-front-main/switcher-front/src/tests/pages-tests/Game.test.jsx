import React from "react";
import { render, screen } from "@testing-library/react";
import Game from "../../pages/Game";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";
import "@testing-library/jest-dom";
import { expect, vi } from "vitest";

// Mock de componentes secundarios
vi.mock("../../components/Button/SkipButton", () => ({
  SkipTurnButton: () => <button>Skip Turn</button>,
}));

vi.mock("../../components/Button/LeaveGameButton", () => ({
  LeaveGameButton: () => <button>Leave Game</button>,
}));

// Cambia esto para que devuelva un objeto con una clave 'default'
vi.mock("../../components/Board", () => ({
  default: () => <div>Board Component</div>,
}));

vi.mock("../../components/Temporizador", () => ({
  default: () => <div>Countdown Timer</div>,
}));

vi.mock("../../components/Cards/MovementList", () => ({
  default: () => <div>Movement List</div>,
}));

vi.mock("../../containers/PlayersContainer", () => ({
  default: () => <div>Players Container</div>,
}));

vi.mock("../../components/Button/RollbackMovButton", () => ({
  RollbackMovButton: () => <button>Deshacer movimiento</button>,
}));

vi.mock("../../components/Button/RollbackMovButton", () => ({
  RollbackMovButton: () => <button>Deshacer movimiento</button>,
}));

// Asegúrate de que WinGame se esté exportando correctamente

vi.mock("../../components/WinGame", () => ({
  Win: () => <div>Win Component</div>,
}));

const mockMensajes = [
  { jugador_id: 1, mensaje: "¡A disfrutar!", nombre: "Salchi" },
  { jugador_id: 2, mensaje: "¡Vamos a divertirnos!", nombre: "Simon" },
  { jugador_id: 3, mensaje: "¡A por todas!", nombre: "Renzo" },
];

describe("Game Component", () => {
  test("renders Game component correctly", () => {
    const mockContextValue = {
      idJugador: 1,
      movimientos: [],
      updateHighlightCoords: vi.fn(),
      handleLeave: vi.fn(),
      mensajes: mockMensajes,
    };
    render(
      <PartidaWSContext.Provider value={mockContextValue}>
        <Game />
      </PartidaWSContext.Provider>
    );

    // Comprobar si los botones están presentes
    expect(screen.getByText("Leave Game")).toBeInTheDocument();
    expect(screen.getByText("Skip Turn")).toBeInTheDocument();
    expect(screen.getByText("Deshacer movimiento")).toBeInTheDocument();
    expect(screen.getByText("Countdown Timer")).toBeInTheDocument();

    // Comprobar si el tablero está presente
    expect(screen.getByText("Board Component")).toBeInTheDocument();

    // Comprobar si las listas de movimiento y figuras están presentes
    expect(screen.getByText("Movement List")).toBeInTheDocument();
    expect(screen.getByText("Players Container")).toBeInTheDocument();

    // Comprobar si el componente de ganar está presente
    expect(screen.getByText("Win Component")).toBeInTheDocument();
  });
});
