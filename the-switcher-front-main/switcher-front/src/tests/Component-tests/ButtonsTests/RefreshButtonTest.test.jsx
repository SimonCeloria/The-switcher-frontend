import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RefreshPartidasButton } from "../../../components/Button/RefreshButton";
import { ListaPartidaContext } from "../../../contexts/ListaPartidaContext";
import PartidaServices from "../../../services/Partida";
import { describe, it, expect, vi } from "vitest";

describe("RefreshPartidasButton", () => {
  it("should render the button and call fetchGames on click", async () => {
    // Mocking the context and service
    const setGameListMock = vi.fn();
    const partidaContextMock = {
      setGameList: setGameListMock,
    };

    const listPartidasMock = vi.fn().mockResolvedValue([
      { id: 1, nombre: "Partida 1" },
      { id: 2, nombre: "Partida 2" },
    ]);

    // Mock the service method
    vi.spyOn(PartidaServices, "listPartidas").mockImplementation(listPartidasMock);

    // Render the component with the mocked context
    render(
      <ListaPartidaContext.Provider value={partidaContextMock}>
        <RefreshPartidasButton />
      </ListaPartidaContext.Provider>
    );

    // Check if the button is rendered
    const button = screen.getByText(/REFRESCAR/i);
    expect(button).toBeInTheDocument();

    // Simulate a click on the button
    fireEvent.click(button);

    await new Promise((resolve) => setImmediate(resolve));

    // Check if the service was called
    expect(PartidaServices.listPartidas).toHaveBeenCalled();

    expect(setGameListMock).toHaveBeenCalledWith([
      { id: 1, nombre: "Partida 1" },
      { id: 2, nombre: "Partida 2" },
    ]);
  });

  it("should handle error when fetching games", async () => {
    // Mocking the context
    const setGameListMock = vi.fn();
    const partidaContextMock = {
      setGameList: setGameListMock,
    };

    // Mocking the service
    const errorMessage = "Error al obtener partidas";
    vi.spyOn(PartidaServices, "listPartidas").mockRejectedValue(new Error(errorMessage));

    // Render the component
    render(
      <ListaPartidaContext.Provider value={partidaContextMock}>
        <RefreshPartidasButton />
      </ListaPartidaContext.Provider>
    );

    // Check if the button is rendered
    const button = screen.getByText(/REFRESCAR/i);
    expect(button).toBeInTheDocument();

    // Simulate a click on the button
    fireEvent.click(button);

    // Wait for the promise to resolve
    await new Promise((resolve) => setImmediate(resolve)); 

    // Verifica si el servicio fue llamadado
    expect(PartidaServices.listPartidas).toHaveBeenCalled();

  });
});
