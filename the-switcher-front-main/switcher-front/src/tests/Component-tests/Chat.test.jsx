import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Chat from "../../components/Chat/Chat";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

const mockMensajes = [
  { mensaje: "¡A disfrutar!", nombre: "Salchi" },
  { mensaje: "¡Vamos a divertirnos!", nombre: "Simon" },
  { mensaje: "¡A por todas!", nombre: "Renzo" },
  { mensaje: "-...-------------._dasd[{{{{{{{{{{{{{{{", nombre: "Renzo" },
  { mensaje: "DROP TABLE teams;", nombre: "DROP TABLE teams;" },
];

vi.mock('../../containers/ChatListContainer', () => ({
  __esModule: true,
  default: () => <div data-testid="mock-chat">Mocked Chat Component</div>,
}));

const renderWithContext = (component) => {
  return render(
    <PartidaWSContext.Provider value={{ mensajes: mockMensajes }}>
      {component}
    </PartidaWSContext.Provider>
  );
};

describe("Chat Component", () => {
  test("renders Chat component correctly", () => {
    renderWithContext(<Chat />);

    expect(screen.getByText("Mocked Chat Component")).toBeInTheDocument();
  });
});
