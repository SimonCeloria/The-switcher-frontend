import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DeckFigures } from "../../components/Cards/DeckFigures";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";
import "@testing-library/jest-dom";

describe("DeckFigures", () => {
  const mockFiguras = {
    1: { enmano : [{bloqueada : false, enMano: true}] , enMazo: 0 }, // Jugador 1 sin cartas
    2: { enmano : [{bloqueada : false, enMano: true}] , enMazo: 1 }, // Jugador 2 con una carta
    3: { enmano : [{bloqueada : false, enMano: true}] , enMazo: 15 }, // Jugador 3 con 15 cartas
  };

  const renderWithContext = (idPlayer) => {
    return render(
      <PartidaWSContext.Provider value={{ figuras: mockFiguras }}>
        <DeckFigures idPlayer={idPlayer} />
      </PartidaWSContext.Provider>
    );
  };

  it("No debe renderizar nada si el jugador no tiene cartas", () => {
    renderWithContext(1); // Jugador 1 no tiene cartas
    const deckElement = screen.queryByRole("img");
    expect(deckElement).toBeNull(); // No debería haber ninguna carta renderizada
  });

  it("Debe renderizar una única carta si el jugador tiene 1 carta", () => {
    renderWithContext(2); // Jugador 2 tiene una carta
    const cardElement = screen.getByRole("img");
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveAttribute("alt", "back");
  });

  it("Debe renderizar las cartas apiladas si el jugador tiene más de 1 carta", () => {
    renderWithContext(3); // Jugador 3 tiene 15 cartas
    const cards = screen.getAllByRole("img");
    expect(cards).toHaveLength(15); // Debería haber 15 cartas renderizadas
    cards.forEach((card) => {
      expect(card).toHaveAttribute("alt", "back");
    });
  });
});
