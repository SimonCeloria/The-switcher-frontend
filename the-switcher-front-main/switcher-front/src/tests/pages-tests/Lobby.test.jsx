import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import { LobbyPage } from "../../pages/Lobby";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";
import { fireEvent } from "@testing-library/dom";

const mockMensajes = [
  { mensaje: "¡A disfrutar!", nombre: "Salchi" },
  { mensaje: "¡Vamos a divertirnos!", nombre: "Simon" },
  { mensaje: "¡A por todas!", nombre: "Renzo" },
  { mensaje: "-...-------------._dasd[{{{{{{{{{{{{{{{", nombre: "Renzo" },
  { mensaje: "DROP TABLE teams;", nombre: "DROP TABLE teams;" },
];

describe("LobbyPage", () => {
  beforeAll(() => {
    global.open = vi.fn();
  });
  
  const partidaMock = {
    id: 1,
    nombre: "Partida A",
    jugadores: [
      { id: 1, nombre: "Jugador 1" },
      { id: 2, nombre: "Jugador 2" }
    ],
    owner: 1,
    iniciada: false,
  };

  const partidaContextMock = {
    partida: partidaMock,
    idJugador: 1,
    jugadores: partidaMock.jugadores,
    mensajes: mockMensajes,
  };

  const renderLobbyPage = (idJugador) => {
    return render(
      <PartidaWSContext.Provider value={{ ...partidaContextMock, idJugador, mockMensajes }}>
        <LobbyPage />
      </PartidaWSContext.Provider>
    );
  };

  it("Renderiza el lobby para el owner", () => {
    renderLobbyPage(1);
    expect(screen.getByText("Partida A")).toBeInTheDocument();
    expect(screen.getByText("Jugador 1")).toBeInTheDocument();
    expect(screen.getByText("Jugador 2")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /ABANDONAR/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /INICIAR PARTIDA/i })).toBeInTheDocument();
  });

  it("Renderiza el lobby para otro jugador", () => {
    renderLobbyPage(2);
    expect(screen.getByText("Partida A")).toBeInTheDocument();
    expect(screen.getByText("Jugador 1")).toBeInTheDocument();
    expect(screen.getByText("Jugador 2")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /INICIAR PARTIDA/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ABANDONAR/i })).toBeInTheDocument();
  });
  
});