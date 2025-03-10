import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { SkipTurnButton } from "../../../components/Button/SkipButton";
import { PartidaWSContext } from "../../../contexts/PartidaWSContext";
import { describe, it, expect, vi } from "vitest";

describe("SkipTurnButton", () => {
  it("Renderizo el boton, llamo al handleSkip y verifico que se ejecute si es mi turno", () => {
    // Mockeo
    const handleSkipMock = vi.fn();
    const mockGanador = { id: 1, nombre: "" };
    const partidaMock = {
      jugadores: [
        { nombre: "Jugador 1", id: 1 },
        { nombre: "Jugador 2", id: 2 },
      ],
      turnos: [
        { turno: 1, jugador_id: 2 },
        { turno: 2, jugador_id: 1 },
      ],
      currentTurn: 1,
      isMyTurn: true,
      handleSkip: handleSkipMock,
    };

    // Renderizo el componente con el mockeo del Contexto

    render(
      <PartidaWSContext.Provider value={{ ...partidaMock, ganador: mockGanador }}>
        <SkipTurnButton />
      </PartidaWSContext.Provider>
    );

    // Reviso si se renderizo
    const button = screen.getByText(/Pasar turno/i);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();

    // Apreto el boton
    fireEvent.click(button);

    // Verifico si se ejecuto 1 vez handleSkipMock
    expect(handleSkipMock).toHaveBeenCalledTimes(1);
  });

  it("Renderizo el boton, llamo al handleSkip y verifico que no se ejecute si no es mi turno", () => {
    // Mockeo
    const handleSkipMock = vi.fn();
    const partidaMock = {
      jugadores: [
        { nombre: "Jugador 1", id: 1 },
        { nombre: "Jugador 2", id: 2 },
      ],
      turnos: [
        { turno: 1, jugador_id: 2 },
        { turno: 2, jugador_id: 1 },
      ],
      currentTurn: 2,
      isMyTurn: false,
      handleSkip: handleSkipMock,
    };

    // Renderizo el componente con el mockeo del Contexto

    render(
      <PartidaWSContext.Provider value={partidaMock}>
        <SkipTurnButton />
      </PartidaWSContext.Provider>
    );

    // Reviso si se renderizo
    const button = screen.getByText(/Pasar turno/i);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    // Apreto el boton
    fireEvent.click(button);

    // Verifico si se ejecuto 1 vez handleSkipMock
    expect(handleSkipMock).not.toHaveBeenCalled();
  });
});
