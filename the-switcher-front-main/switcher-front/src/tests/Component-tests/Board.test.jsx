import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import "@testing-library/jest-dom"; 
import { PartidaWSContext } from "../../contexts/PartidaWSContext";
import Board from "../../components/Board";

describe("Board", () => {
  const generarFichasMockeadasIntercaladas = () => {
    const fichas = [];
    let set_color = 0;
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 6; j++) {
        let final_color;
        switch (set_color) {
          case 0:
            final_color = "verde";
            set_color = 1;
            break;
          case 1:
            final_color = "azul";
            set_color = 2;
            break;
          case 2:
            final_color = "rojo";
            set_color = 3;
            break;
          case 3:
            final_color = "amarillo";
            set_color = 0;
            break;
        }
        fichas.push({ xcord: i, ycord: j, color: final_color });
      }
    }
    return fichas;
  };

  const generarFichasMockeadasJuntas = () => {
    const fichas = [];
    let colores = ["verde", "rojo", "azul", "amarillo"];
    for (let color of colores) {
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          fichas.push({ xcord: i, ycord: j, color: color });
        }
      }
    }
    return fichas;
  };

  const mockFichas = generarFichasMockeadasIntercaladas();
  const mockTwoFichas = generarFichasMockeadasJuntas();

  it("Debería renderizar el número correcto de filas y columnas", () => {
    const { container } = render(
      <PartidaWSContext.Provider value={{ fichas: mockFichas, highlightCoords: [], highlightFigsCoords: [] }}>
        <Board />
      </PartidaWSContext.Provider>
    );

    const grid = container.querySelector(".grid");
    expect(grid).toHaveClass("grid-rows-6");
    expect(grid).toHaveClass("grid-cols-6");
  });

  it("Debería renderizar correctamente las fichas en sus coordenadas", () => {
    const { container } = render(
      <PartidaWSContext.Provider value={{ fichas: mockFichas, highlightCoords: [], highlightFigsCoords: [] }}>
        <Board />
      </PartidaWSContext.Provider>
    );

    const fichaElements = container.querySelectorAll(".flex");
    expect(fichaElements).toHaveLength(36); // Debe haber 36 fichas en un tablero 6x6
  });

  it("Debería renderizar correctamente y verificar las coordenadas de las fichas", () => {
    const { container } = render(
      <PartidaWSContext.Provider value={{ fichas: mockTwoFichas, highlightCoords: [], highlightFigsCoords: [] }}>
        <Board />
      </PartidaWSContext.Provider>
    );

    mockTwoFichas.forEach((ficha, index) => {
      expect(ficha.xcord).toBeGreaterThanOrEqual(0);
      expect(ficha.xcord).toBeLessThanOrEqual(5);
      expect(ficha.ycord).toBeGreaterThanOrEqual(0);
      expect(ficha.ycord).toBeLessThanOrEqual(5);
    });
  });

  test("renders 'Loading...' when no fichas are available", () => {
  const contextValue = { fichas: [] };
  render(
    <PartidaWSContext.Provider value={contextValue}>
      <Board />
    </PartidaWSContext.Provider>
  );
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

test("renders error message when highlightFigsCoords is not an array", () => {
  render(
    <PartidaWSContext.Provider value={{ 
      fichas: [{ id: 1, xCord: 0, yCord: 0, color: "rojo" }], 
      highlightFigsCoords: {} // Invalid value 
    }}>
      <Board />
    </PartidaWSContext.Provider>
  );

  expect(screen.queryByText((content) => 
    content.includes("Invalid highlight data")
  )).toBeInTheDocument();
});



test("renders highlighted figures and movements", () => {
  const contextValue = {
    fichas: [{ id: 1, xCord: 0, yCord: 0, color: "azul" }],
    highlightCoords: [0], // Highlight first ficha
    highlightFigsCoords: [[0]], // Highlight figure
    highlightMovsCoords: [{ xCord: 0, yCord: 0 }],
    isMyTurn: true,
    ganador: { nombre: "" }, // No winner yet
  };

  render(
    <PartidaWSContext.Provider value={contextValue}>
      <Board />
    </PartidaWSContext.Provider>
  );

  const ficha = screen.getByTestId("ficha-0"); 
  expect(ficha).toBeInTheDocument(); 
  expect(ficha).toHaveClass("highlight"); 
});


test("renders 'Loading...' when fichas is undefined", () => {
  render(
    <PartidaWSContext.Provider value={{ fichas: undefined }}>
      <Board />
    </PartidaWSContext.Provider>
  );
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});

  //TEST DE LINEAS 74,75 - 81,82.
  describe("Board Hover Effects", () => {
    it("should scale up on mouse enter", () => {
      const contextValue = {
        fichas: mockFichas,
        highlightCoords: [],
        highlightFigsCoords: [],
        isMyTurn: true,
        ganador: { nombre: "" },
      };

      render(
        <PartidaWSContext.Provider value={contextValue}>
          <Board />
        </PartidaWSContext.Provider>
      );

      const ficha = screen.getByTestId("ficha-0");

      fireEvent.mouseEnter(ficha); 

      expect(ficha).toHaveStyle("transform: scale(1.1)");
    });

    it("should return to original size on mouse leave", () => {
      const contextValue = {
        fichas: mockFichas,
        highlightCoords: [],
        highlightFigsCoords: [],
        isMyTurn: true,
        ganador: { nombre: "" }, // No winner yet
      };

      render(
        <PartidaWSContext.Provider value={contextValue}>
          <Board />
        </PartidaWSContext.Provider>
      );

      const ficha = screen.getByTestId("ficha-0"); 

      fireEvent.mouseEnter(ficha);
      expect(ficha).toHaveStyle("transform: scale(1.1)"); 

      fireEvent.mouseLeave(ficha); 

      expect(ficha).toHaveStyle("transform: scale(1)");
    });
  });

});

