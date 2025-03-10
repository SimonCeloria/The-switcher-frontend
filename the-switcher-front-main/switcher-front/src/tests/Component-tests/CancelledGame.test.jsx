import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { CancelledGame } from "../../components/CancelledGame";
import '@testing-library/jest-dom';

describe("CancelledGame", () => {
  it("Renderiza el Popout cuando isPopoutOpen es true", () => {
    render(<CancelledGame />);

    expect(screen.getByText("Partida cancelada.")).toBeInTheDocument();
    expect(screen.getByText("La partida ha sido cancelada.")).toBeInTheDocument();
    expect(screen.getByText("Se te ha redirigido al lobby.")).toBeInTheDocument();
  });

  it("Cierra el Popout cuando se hace clic en el botón OK", () => {
    render(<CancelledGame />);

    expect(screen.getByText("Partida cancelada.")).toBeInTheDocument();

    // Simula el clic en el botón "OK" usando el data-testid
    fireEvent.click(screen.getByTestId("close-button"));

    // Verifica que el popout ya no esté en el documento
    expect(screen.queryByText("Partida cancelada.")).not.toBeInTheDocument();
  });
});
