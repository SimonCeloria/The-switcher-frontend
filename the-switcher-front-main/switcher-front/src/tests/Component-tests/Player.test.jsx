import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom"; // Extiende las aserciones como toBeInTheDocument
import Player from "../../components/Player";
import FiguresList from "../../components/Cards/FigureList";
import { EnemyHandMovement } from "../../components/Cards/MovementList";
import { DeckFigures } from "../../components/Cards/DeckFigures";

// Mock FiguresList component
vi.mock("../../components/Cards/FigureList", () => ({
  __esModule: true,
  default: vi.fn(() => <div>FiguresList</div>),
}));

// Mock EnemyHandMovement component
vi.mock("../../components/Cards/MovementList", () => ({
  __esModule: true,
  default: vi.fn(() => <div>EnemyHandMovement</div>),
  EnemyHandMovement: vi.fn(() => <div>EnemyHandMovement</div>),
}));

// Mock DeckFigures component
vi.mock("../../components/Cards/DeckFigures", () => ({
  __esModule: true,
  DeckFigures: vi.fn(() => <div>DeckFigures</div>),
}));

describe("Player", () => {
  const mock_player = {
    name: "Player 1",
    turno: 1,
    id_jugador: 1,
    status: "Connected",
  };
  const mock_player_disconnected = {
    name: "Player 2",
    turno: 2,
    id_jugador: 2,
    status: "Disconnected",
  };
  const mock_isPlayerTurn = true;
  const mock_isNotPlayerTurn = false;
  const mock_isMyLayout = true;
  const mock_isNotMyLayout = false;

  it("renders correctly when the player is connected and it's their turn", () => {
    render(
      <Player
        player={mock_player}
        isPlayerTurn={mock_isPlayerTurn}
        isMyLayout={mock_isMyLayout}
      />
    );

    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.queryByAltText("Disconnected")).not.toBeInTheDocument();
    expect(FiguresList).toHaveBeenCalledWith(
      expect.objectContaining({
        idPlayer: mock_player.id_jugador,
      }),
      {}
    );
    expect(EnemyHandMovement).not.toHaveBeenCalledWith(
      expect.objectContaining({
        idPlayer: mock_player.id_jugador,
      }),
      {}
    );
    expect(DeckFigures).toHaveBeenCalledWith(
      expect.objectContaining({
        idPlayer: mock_player.id_jugador,
      }),
      {}
    );

    console.log(FiguresList.mock.calls);
    console.log(EnemyHandMovement.mock.calls);
    console.log(DeckFigures.mock.calls);
  });

  it("renders correctly when the player is connected and it's not their turn", () => {
    render(
      <Player
        player={mock_player}
        isPlayerTurn={mock_isNotPlayerTurn}
        isMyLayout={mock_isNotMyLayout}
      />
    );

    expect(screen.getByText("Player 1")).toBeInTheDocument();
    expect(screen.queryByAltText("Disconnected")).not.toBeInTheDocument();

    expect(FiguresList).toHaveBeenCalledWith(
      expect.objectContaining({
        idPlayer: mock_player.id_jugador,
      }),
      {}
    );
    expect(EnemyHandMovement).toHaveBeenCalledWith(
      expect.objectContaining({
        idPlayer: mock_player.id_jugador,
      }),
      {}
    );
    expect(DeckFigures).toHaveBeenCalledWith(
      expect.objectContaining({
        idPlayer: mock_player.id_jugador,
      }),
      {}
    );

    console.log(FiguresList.mock.calls);
    console.log(EnemyHandMovement.mock.calls);
    console.log(DeckFigures.mock.calls);
  });

  it("renders correctly when the player is disconnected", () => {
    render(
      <Player
        player={mock_player_disconnected}
        isPlayerTurn={mock_isNotPlayerTurn}
        isMyLayout={mock_isNotMyLayout}
      />
    );

    expect(screen.getByAltText("Disconnected")).toBeInTheDocument();
    expect(screen.queryByText("Player 2")).not.toBeInTheDocument();
  });
});
