import React from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import "@testing-library/jest-dom";
import CardFigureContainer from "../containers/CardFigureContainer";
import { PartidaWSContext } from "../contexts/PartidaWSContext";
import * as CardUtils from "../containers/CardUtils";
import { client } from "../services/ConfigAxios";

// Mock de dependencias externas
vi.mock("../components/Cards/CardFigure", () => ({
  default: ({ figuretype, handleClick, clicked, ganador }) => (
    <div data-testid="card-figure" onClick={handleClick} data-clicked={clicked} data-ganador={ganador?.nombre}>
      <img src={figuretype} alt="figure" />
    </div>
  ),
}));

vi.mock("../services/ConfigAxios", () => ({
  client: {
    post: vi.fn(),
  },
}));

vi.mock("../containers/CardUtils", () => ({
  GetFichaInfo: vi.fn(),
  GetFigure: vi.fn(),
  ErrorNotificationFig: vi.fn(),
  isValidFigure: vi.fn(),
  isValidBlock: vi.fn(),
}));

describe("CardFigureContainer", () => {
  const mockFigure = {
    id: 1,
    figura: { img_url: "test-image.jpg", shape: "square" },
  };
  const mockOnCardClick = vi.fn();
  const mockOnEventComplete = vi.fn();
  const mockHighlightFigs = [{ nombre: "square", fichas: [1, 2, 3] }];
  const mockGanador = { nombre: "" };
  const mockFichas = { 1: { id: 1 }, 2: { id: 2 }, 3: { id: 3 } };
  const mockSetDiscardFigInfo = vi.fn();

  const defaultProps = {
    figure: mockFigure,
    index: 0,
    selectedCard: null,
    waitingForEvent: false,
    onCardClick: mockOnCardClick,
    onEventComplete: mockOnEventComplete,
    isMyTurn: true,
  };

  const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
    return render(
      <PartidaWSContext.Provider value={providerProps}>
        {ui}
      </PartidaWSContext.Provider>,
      renderOptions
    );
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("renders correctly with given props", () => {
    renderWithContext(<CardFigureContainer {...defaultProps} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: mockGanador, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo },
    });

    const card = screen.getByTestId("card-figure");
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("data-clicked", "false");
    expect(card).toHaveAttribute("data-ganador", "");

    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "test-image.jpg");
  });

  it("calls onCardClick when clicked and it's the player's turn", async () => {
    renderWithContext(<CardFigureContainer {...defaultProps} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: mockGanador, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo },
    });

    const card = screen.getByTestId("card-figure");
    fireEvent.click(card);

    expect(mockOnCardClick).toHaveBeenCalledWith(0);
  });

  it("doesn't call onCardClick when it's not the player's turn", () => {
    renderWithContext(<CardFigureContainer {...defaultProps} isMyTurn={false} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: mockGanador, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo },
    });

    const card = screen.getByTestId("card-figure");
    fireEvent.click(card);

    expect(mockOnCardClick).not.toHaveBeenCalled();
  });

  it("doesn't call onCardClick when waiting for an event", () => {
    renderWithContext(<CardFigureContainer {...defaultProps} waitingForEvent={true} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: mockGanador, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo },
    });

    const card = screen.getByTestId("card-figure");
    fireEvent.click(card);

    expect(mockOnCardClick).not.toHaveBeenCalled();
  });

  it("doesn't call onCardClick when there's a winner", () => {
    renderWithContext(<CardFigureContainer {...defaultProps} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: { nombre: "Player 1" }, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo },
    });

    const card = screen.getByTestId("card-figure");
    fireEvent.click(card);

    expect(mockOnCardClick).not.toHaveBeenCalled();
  });

  it("handles valid figure selection correctly", async () => {
    vi.useRealTimers();
    CardUtils.GetFichaInfo.mockReturnValue({ coordenadas: [1, 1] });
    CardUtils.GetFigure.mockReturnValue({ nombre: "square", fichas: [1, 2, 3] });
    CardUtils.isValidFigure.mockReturnValue(true);
    CardUtils.isValidBlock.mockReturnValue(true);
    client.post.mockResolvedValue({ data: "success" });

    renderWithContext(<CardFigureContainer {...defaultProps} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: mockGanador, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo, idJugador: 1 },
    });

    const card = screen.getByTestId("card-figure");
    fireEvent.click(card);

    await new Promise(resolve => setTimeout(resolve, 200));
    const fichaElement = document.createElement('div');
    fichaElement.setAttribute('data-ficha-id', '1');
    document.body.appendChild(fichaElement);
    fireEvent.click(fichaElement);

    await waitFor(() => {
      expect(client.post).toHaveBeenCalledWith(expect.stringContaining("figura"), {
        carta_figura: 1,
        lista_fichas: [1, 2, 3],
        jugador_id: 1,
      });
      expect(mockOnEventComplete).toHaveBeenCalled();
    }, { timeout: 3000 });
  }, 5000);

  it("handles invalid figure selection correctly", async () => {
    vi.useRealTimers();
    CardUtils.GetFichaInfo.mockReturnValue({ coordenadas: [1, 1] });
    CardUtils.GetFigure.mockReturnValue({ nombre: "circle", fichas: [1, 2, 3] });
    CardUtils.isValidFigure.mockReturnValue(false);

    renderWithContext(<CardFigureContainer {...defaultProps} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: mockGanador, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo },
    });

    const card = screen.getByTestId("card-figure");
    fireEvent.click(card);

    //simulamos clickeo de ficha
    await new Promise(resolve => setTimeout(resolve, 200));
    const fichaElement = document.createElement('div');
    fichaElement.setAttribute('data-ficha-id', '1');
    document.body.appendChild(fichaElement);
    fireEvent.click(fichaElement);

    await waitFor(() => {
      expect(CardUtils.ErrorNotificationFig).toHaveBeenCalledWith("No concuerda la figura");
      expect(mockOnEventComplete).toHaveBeenCalled();
    }, { timeout: 3000 });
  }, 5000);

  it("handles non-figure click correctly", async () => {
    vi.useRealTimers();
    CardUtils.GetFichaInfo.mockReturnValue(null);

    renderWithContext(<CardFigureContainer {...defaultProps} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: mockGanador, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo },
    });

    const card = screen.getByTestId("card-figure");
    fireEvent.click(card);

    await new Promise(resolve => setTimeout(resolve, 200));
    fireEvent.click(document.body);

    await waitFor(() => {
      expect(mockOnEventComplete).toHaveBeenCalled();
    }, { timeout: 3000 });
  }, 5000);

  it("handles API error correctly", async () => {
    vi.useRealTimers();
    CardUtils.GetFichaInfo.mockReturnValue({ coordenadas: [1, 1] });
    CardUtils.GetFigure.mockReturnValue({ nombre: "square", fichas: [1, 2, 3] });
    CardUtils.isValidFigure.mockReturnValue(true);
    CardUtils.isValidBlock.mockReturnValue(true);
    client.post.mockRejectedValue(new Error("API Error"));

    renderWithContext(<CardFigureContainer {...defaultProps} />, {
      providerProps: { highlightFigs: mockHighlightFigs, ganador: mockGanador, fichas: mockFichas, setDiscardFigInfo: mockSetDiscardFigInfo },
    });

    const card = screen.getByTestId("card-figure");
    fireEvent.click(card);

    // Simulamos un lcickeo de ficha
    await new Promise(resolve => setTimeout(resolve, 200));
    const fichaElement = document.createElement('div');
    fichaElement.setAttribute('data-ficha-id', '1');
    document.body.appendChild(fichaElement);
    fireEvent.click(fichaElement);

    await waitFor(() => {
      expect(client.post).toHaveBeenCalled();
      expect(mockOnEventComplete).toHaveBeenCalled();
    }, { timeout: 3000 });
  }, 5000);
});