import React from 'react';
import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import CardMovementContainer from "../containers/CardMovementContainer";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import * as CardUtils from "../containers/CardUtils";
import MovServices from "../services/Movimiento";

// Mock de dependencias
vi.mock("../components/Cards/CardMovement", () => ({
  CardMovUser: ({ handleClick }) => (
    <div data-testid="card-movement-user" onClick={handleClick} />
  ),
}));

vi.mock("../containers/CardUtils", () => ({
  GetFichaInfo: vi.fn(),
  isValidFicha: vi.fn(),
  ShowMovs: vi.fn(),
  GetMovCoords: vi.fn(),
  ErrorNotificationMov: vi.fn(),
}));

vi.mock("../services/Movimiento", () => ({
  default: {
    hacerMovimientoPartida: vi.fn(),
  },
}));

vi.mock("react-hot-toast", () => ({
  Toaster: () => <div data-testid="toaster" />,
}));

describe("CardMovementContainer", () => {
  const mockMovement = {
    id: 1,
    movimiento: { img_url: "url1", movement: "DiagonalSmall", special_move: false },
  };
  const mockOnCardClick = vi.fn();
  const mockOnEventComplete = vi.fn();
  const mockUpdateHighlightCoords = vi.fn();

  const defaultProps = {
    movement: mockMovement,
    index: 0,
    selectedCard: null,
    waitingForEvent: false,
    onCardClick: mockOnCardClick,
    onEventComplete: mockOnEventComplete,
    isMyTurn: true,
  };

  const renderWithContext = (ui, providerProps) => {
    return render(
      <PartidaWSContext.Provider value={providerProps}>
        {ui}
      </PartidaWSContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders CardMovUser and handles click when it's player's turn", async () => {
    renderWithContext(<CardMovementContainer {...defaultProps} />, 
      { updateHighlightCoords: mockUpdateHighlightCoords, ganador: { nombre: "" } }
    );

    const card = screen.getByTestId("card-movement-user");
    expect(card).toBeInTheDocument();

    await act(async () => {
      fireEvent.click(card);
      vi.runAllTimers();
    });

    expect(mockOnCardClick).toHaveBeenCalledWith(0);
  });

  it("doesn't call onCardClick when it's not player's turn", () => {
    renderWithContext(<CardMovementContainer {...defaultProps} isMyTurn={false} />, 
      { updateHighlightCoords: mockUpdateHighlightCoords, ganador: { nombre: "" } }
    );

    const card = screen.getByTestId("card-movement-user");
    fireEvent.click(card);

    expect(mockOnCardClick).not.toHaveBeenCalled();
  });

  it("handles valid movement", async () => {
    CardUtils.GetFichaInfo.mockReturnValueOnce({ id: 1, coordenadas: { x: 0, y: 0 } })
                          .mockReturnValueOnce({ id: 2, coordenadas: { x: 1, y: 1 } });
    CardUtils.isValidFicha.mockReturnValue(true);
    CardUtils.ShowMovs.mockReturnValue([{ x: 1, y: 1 }]);
    CardUtils.GetMovCoords.mockReturnValue([{ x: 1, y: 1 }]);

    renderWithContext(<CardMovementContainer {...defaultProps} />, 
      { updateHighlightCoords: mockUpdateHighlightCoords, ganador: { nombre: "" } }
    );

    const card = screen.getByTestId("card-movement-user");

    await act(async () => {
      fireEvent.click(card);
      vi.runAllTimers();
      
      const firstFichaEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(firstFichaEvent, 'target', { value: { closest: () => ({ getAttribute: () => '1' }) } });
      document.dispatchEvent(firstFichaEvent);
      vi.runAllTimers();
    });

    await act(async () => {
      const secondFichaEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(secondFichaEvent, 'target', { value: { closest: () => ({ getAttribute: () => '2' }) } });
      document.dispatchEvent(secondFichaEvent);
      vi.runAllTimers();
    });

    expect(MovServices.hacerMovimientoPartida).toHaveBeenCalledWith(1, 2, 1);
    expect(mockOnEventComplete).toHaveBeenCalled();
  });

  it("handles invalid movement", async () => {
    CardUtils.GetFichaInfo.mockReturnValueOnce({ id: 1, coordenadas: { x: 0, y: 0 } })
                          .mockReturnValueOnce({ id: 2, coordenadas: { x: 2, y: 2 } });
    CardUtils.isValidFicha.mockReturnValue(false);
    CardUtils.ShowMovs.mockReturnValue([{ x: 1, y: 1 }]);
    CardUtils.GetMovCoords.mockReturnValue([{ x: 1, y: 1 }]);

    renderWithContext(<CardMovementContainer {...defaultProps} />, 
      { updateHighlightCoords: mockUpdateHighlightCoords, ganador: { nombre: "" } }
    );

    const card = screen.getByTestId("card-movement-user");

    await act(async () => {
      fireEvent.click(card);
      vi.runAllTimers();
      
      const firstFichaEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(firstFichaEvent, 'target', { value: { closest: () => ({ getAttribute: () => '1' }) } });
      document.dispatchEvent(firstFichaEvent);
      vi.runAllTimers();
    });

    await act(async () => {
      const secondFichaEvent = new MouseEvent('click', { bubbles: true });
      Object.defineProperty(secondFichaEvent, 'target', { value: { closest: () => ({ getAttribute: () => '2' }) } });
      document.dispatchEvent(secondFichaEvent);
      vi.runAllTimers();
    });

    expect(CardUtils.ErrorNotificationMov).toHaveBeenCalledWith("Ficha invalida");
    expect(mockOnEventComplete).toHaveBeenCalled();
  });
});