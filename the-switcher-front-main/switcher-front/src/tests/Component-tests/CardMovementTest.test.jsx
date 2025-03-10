import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { CardMovUser, CardMovEnemy } from "../../components/Cards/CardMovement";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

describe("CardMovement Component", () => {
  const mockUpdateHighlightCoords = vi.fn();

  const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
    return render(
      <PartidaWSContext.Provider value={providerProps}>
        {ui}
      </PartidaWSContext.Provider>,
      renderOptions
    );
  };

  it("debería renderizar la carta con la imagen correcta", () => {
    renderWithContext(<CardMovUser img_url="url1" ganador={{}} />, {
      providerProps: { updateHighlightCoords: mockUpdateHighlightCoords },
    });

    const movementImage = screen.getByRole("img");
    expect(movementImage).toHaveAttribute("src", "url1");
  });

  it("debería llamar a handleClick si la carta no está usada ni hay ganador", () => {
    const handleClickMock = vi.fn();

    renderWithContext(
      <CardMovUser img_url="url1" handleClick={handleClickMock} ganador={{}} isUsed={false} />,
      { providerProps: { updateHighlightCoords: mockUpdateHighlightCoords } }
    );

    fireEvent.click(screen.getByRole("img"));
    expect(handleClickMock).toHaveBeenCalled();
  });

  it("no debería permitir clics si la carta está usada o hay un ganador", () => {
    const handleClickMock = vi.fn();

    renderWithContext(
      <CardMovUser img_url="url1" handleClick={handleClickMock} ganador={{ nombre: "Player 1" }} isUsed={true} />,
      { providerProps: { updateHighlightCoords: mockUpdateHighlightCoords } }
    );

    fireEvent.click(screen.getByRole("img"));
    expect(handleClickMock).not.toHaveBeenCalled();
  });

  it("debería aplicar efectos de hover correctamente", () => {
    renderWithContext(<CardMovUser img_url="url1" ganador={{}} />, {
      providerProps: { updateHighlightCoords: mockUpdateHighlightCoords },
    });

    const movementImage = screen.getByRole("img");

    fireEvent.mouseEnter(movementImage);
    expect(movementImage).toHaveStyle("transform: scale(1.1)");

    fireEvent.mouseLeave(movementImage);
    expect(movementImage).toHaveStyle("transform: scale(1)");
  });

  it("debería aplicar estilos condicionales correctamente según el estado", () => {
    renderWithContext(
      <CardMovUser img_url="url1" clicked={true} ganador={{}} isUsed={false} />,
      { providerProps: { updateHighlightCoords: mockUpdateHighlightCoords } }
    );

    const movementImage = screen.getByRole("img");

    expect(movementImage).toHaveStyle("cursor: pointer");
    expect(movementImage).toHaveStyle("transform: scale(1.14)");
  });

  it("debería usar 'not-allowed' como cursor si la carta está usada o hay un ganador", () => {
    renderWithContext(
      <CardMovUser img_url="url1" ganador={{ nombre: "Player 1" }} isUsed={true} />,
      { providerProps: { updateHighlightCoords: mockUpdateHighlightCoords } }
    );

    const movementImage = screen.getByRole("img");
    expect(movementImage).toHaveStyle("cursor: not-allowed");
  });

  it("debería renderizar CardMovEnemy correctamente", () => {
    render(<CardMovEnemy />);

    const enemyImage = screen.getByRole("img");
    expect(enemyImage).toHaveAttribute("src", "/back-mov.svg");
    expect(enemyImage).toHaveStyle("width: 25px");
    expect(enemyImage).toHaveStyle("height: 37.5px");
  });
});
