import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { StartGameButton } from "../../../components/Button/StartGameButton";
import { PartidaWSContext } from "../../../contexts/PartidaWSContext";
import { describe, it, expect, vi } from "vitest";

describe("StartGameButton", () => {
  it("Renderiza el boton y despues lo clickea para testear si ejecuta el handle", () => {
    // Mockeo la función y la asigna a partidaMock
    const handleStartMock = vi.fn();
    const partidaMock = {
      handleStart: handleStartMock,
    };

    // Renderizo el componente con el mockeo del Contexto
    render(
      <PartidaWSContext.Provider value={partidaMock}>
        <StartGameButton />
      </PartidaWSContext.Provider>
    );

    // Reviso si se renderizo
    const button = screen.getByText(/Iniciar partida/i);
    expect(button).toBeInTheDocument();

    // Apreto el boton
    fireEvent.click(button);

    // Verifico si se ejecuto 1 vez handleStartMock
    expect(handleStartMock).toHaveBeenCalledTimes(1);
  });
});
