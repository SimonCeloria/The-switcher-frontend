import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import PlayersContainer from "../containers/PlayersContainer";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import Player from "../components/Player";

// Spy on the Player component
// Mock the Player component
vi.mock("../components/Player", () => ({
  __esModule: true,
  default: vi.fn(({ player, isPlayerTurn, isMyLayout }) => {
    return <div data-testid="player" />;
  }),
}));

const mockContextValue = {
  turnos: [
    { jugador_id: 1, nombre: "Player 1", turno: 1 },
    { jugador_id: 2, nombre: "Player 2", turno: 2 },
    { jugador_id: 3, nombre: "Player 3", turno: 3 },
  ],
  jugadores: [{ id: 1 }, { id: 2 }],
  currentTurn: 1,
  idJugador: 1,
};

describe("PlayersContainer", () => {
  it("renders Player component 3 times with the correct props", () => {
    // Render PlayersContainer with the context provider
    render(
      <PartidaWSContext.Provider value={mockContextValue}>
        <PlayersContainer />
      </PartidaWSContext.Provider>
    );

    // Check that Player is called 3 times
    expect(Player).toHaveBeenCalledTimes(3);

    // Check that Player is called with the correct props
    expect(Player.mock.calls).toEqual(
      expect.arrayContaining([
        expect.arrayContaining([
          {
            isMyLayout: true,
            isPlayerTurn: true,
            player: {
              id_jugador: 1,
              name: "Player 1",
              status: "Connected",
              turno: 1,
            },
          },
          {},
        ]),
        expect.arrayContaining([
          {
            isMyLayout: false,
            isPlayerTurn: false,
            player: {
              id_jugador: 2,
              name: "Player 2",
              status: "Connected",
              turno: 2,
            },
          },
          {},
        ]),
        expect.arrayContaining([
          {
            isMyLayout: false,
            isPlayerTurn: false,
            player: {
              id_jugador: 3,
              name: "Player 3",
              status: "Disconnected",
              turno: 3,
            },
          },
          {},
        ]),
      ])
    );
  });
});
