import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom"; 
import CardFigureUser from "../../components/Cards/CardFigure";

describe("CardFigureUser", () => {
  it("debería renderizar una figura desbloqueada", () => {
    render(<CardFigureUser block={false} figuretype="url1" />);

    // Verificar si la imagen se renderiza correctamente
    const figureImage = screen.getByTestId("card-figure");
    expect(figureImage).toHaveAttribute("src", "url1");
    
  });

  it("debería renderizar una figura bloqueada teniendo 3 cartas en mano", () => {
    const { container } = render(<CardFigureUser block={true} figuretype="url1" handLength= "3"/>);

    // Verificar tiene el testId "card-figure-block"
    const Figure = screen.getByTestId("card-figure-block");
    expect(Figure).toBeInTheDocument();

    //se renderiza la imagen de bloqueo
    expect(Figure).toHaveAttribute("src", "/back.svg");

    expect(Figure).toBeInTheDocument();
    
  });

  it("debería renderizar una figura bloqueada teniendo solo esa carta en mano", () => {
    const { container } = render(<CardFigureUser block={true} figuretype="url1" handLength= "1"/>);

    // Verificar tiene el testId "card-figure-block"
    const Figure = screen.getByTestId("card-figure");
    expect(Figure).toBeInTheDocument();

    //se renderiza la imagen de bloqueo
    expect(Figure).toHaveAttribute("src", "url1");

    expect(Figure).toBeInTheDocument();
    
  });

  it("debería llamar a handleClick cuando se hace clic en la figura", () => {
    const handleClickMock = vi.fn();
    const CustomCardFigureUser = (props) => (
      <div onClick={handleClickMock}>
        <CardFigureUser {...props} />
      </div>
    );

    render(<CustomCardFigureUser block={false} figuretype="url1" />);

    // Simular un clic en la figura
    fireEvent.click(screen.getByTestId("card-figure"));

    // Verificar que la función handleClick se haya llamado
    expect(handleClickMock).toHaveBeenCalled();
  });

  it("debería aplicar efectos de hover correctamente", () => {
    render(<CardFigureUser block={false} figuretype="url1" />);

    const figureDiv = screen.getByTestId("card-figure").parentNode;

    // Simular mouse enter y verificar el estilo
    fireEvent.mouseEnter(figureDiv);
    expect(figureDiv).toHaveStyle("transform: scale(1.12)");

    // Simular mouse leave y verificar el estilo
    fireEvent.mouseLeave(figureDiv);
    expect(figureDiv).toHaveStyle("transform: scale(1)");
  });

  test("Deberia aplciar el efecto hover al mousEnter y ya que no clickeamos, vovler al estado original al MouseLeave", () => {
    render(<CardFigureUser clicked={false} ganador={{}} />);

    const cardDiv = screen.getByTestId("card-figure");

    // Simula el evento onMouseEnter
    fireEvent.mouseEnter(cardDiv);
    expect(cardDiv).toHaveStyle("transform: scale(1.12)");

    // Simula el evento onMouseLeave
    fireEvent.mouseLeave(cardDiv);
    expect(cardDiv).toHaveStyle("transform: scale(1)");
});

test("Deberia apicar el hover cuando entra, luego cuando se clickea no debe volver a su estado original", () => {
    render(<CardFigureUser clicked={true} ganador={{}} />);

    const cardDiv = screen.getByTestId("card-figure");

    // Simula el evento onMouseEnter
    fireEvent.mouseEnter(cardDiv);
    expect(cardDiv).not.toHaveStyle("transform: scale(1.12)");

    // Simula el evento onMouseLeave
    fireEvent.mouseLeave(cardDiv);
  
    expect(cardDiv).toHaveStyle("transform: scale(1.2)");
});
  
  //ADD TESTS TO PASS LINES 32, 34 and BRANCHS (32% coverage until this tests)
  it("debería aplicar cursor 'not-allowed' si hay un ganador", () => {
    render(<CardFigureUser block={false} figuretype="url1" ganador={{ nombre: "Player 1" }} />);
    
    const figureImage = screen.getByTestId("card-figure")
    expect(figureImage).toHaveStyle("cursor: not-allowed"); // Verificar que el cursor sea 'not-allowed'
  });

  it("debería aplicar cursor 'pointer' si la figura fue clickeada", () => {
    render(<CardFigureUser block={false} figuretype="url1" clicked={true} />);
    
    const figureImage = screen.getByTestId("card-figure")
    expect(figureImage).toHaveStyle("cursor: pointer"); // Verificar que el cursor sea 'pointer'
  });

  it("debería aplicar cursor 'default' si la figura está desbloqueada y no fue clickeada", () => {
    render(<CardFigureUser block={false} figuretype="url1" clicked={false} />);
    
    const figureImage = screen.getByTestId("card-figure");
    expect(figureImage).toHaveStyle("cursor: default"); // Verificar que el cursor sea 'default'
  });

  it("no debería aplicar boxShadow si fue clickeada pero hay un ganador", () => {
    render(<CardFigureUser block={false} figuretype="url1" clicked={true} ganador={{ nombre: "Player 1" }} />);
    
    const figureImage = screen.getByTestId("card-figure");
    expect(figureImage).not.toHaveStyle("boxShadow: 0 0 7px 5px yellow"); // Verificar que no se aplique boxShadow
  });
});
