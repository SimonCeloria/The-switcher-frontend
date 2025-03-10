import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";
import FiguresList from "../../components/Cards/FigureList";

// TEST
describe("FiguresList", () => {
  const mockPlayerId = 1;
  const mockFiguras = {
    [mockPlayerId]: {
      enMano: [
        { figura: { img_url: "url1", shape: "hard3", id: 10 } },
        { figura: { img_url: "url2", shape: "easy5", id: 5 } },
        { figura: { img_url: "url3", shape: "easy1", id: 1 } },
      ],
    },
  };

  it("Debería renderizar las tres cartas para el jugador especificado", () => {
    render(
      <PartidaWSContext.Provider value={{ figuras: mockFiguras }}>
        <FiguresList idPlayer={mockPlayerId} />
      </PartidaWSContext.Provider>
    );

    const cardFigures = screen.queryAllByTestId("card-figure-user");
    expect(cardFigures).toHaveLength(mockFiguras[mockPlayerId].enMano.length);

    const figureImages = screen.getAllByRole("img");
    expect(figureImages).toHaveLength(mockFiguras[mockPlayerId].enMano.length * 2);
  });

  it("Renderiza cada figura con su valor correspondiente para el jugador", () => {
    render(
      <PartidaWSContext.Provider value={{ figuras: mockFiguras }}>
        <FiguresList idPlayer={mockPlayerId} />
      </PartidaWSContext.Provider>
    );

    const handFigureImages = screen.getAllByTestId("card-figure");
    handFigureImages.forEach((figure, index) => {
      expect(figure).toHaveAttribute(
        "src",
        mockFiguras[mockPlayerId].enMano[index].figura.img_url
      );
    });
  });

  it("Debería renderizar correctamente cuando el jugador no tiene cartas en la mano", () => {
    const mockFigurasEmpty = {
      [mockPlayerId]: { enMano: [] }, // Jugador sin figuras
    };

    render(
      <PartidaWSContext.Provider value={{ figuras: mockFigurasEmpty }}>
        <FiguresList idPlayer={mockPlayerId} />
      </PartidaWSContext.Provider>
    );

    const cardFigures = screen.queryAllByTestId("card-figure-user");
    expect(cardFigures).toHaveLength(0); // No debería haber ningún componente renderizado
  });
});
