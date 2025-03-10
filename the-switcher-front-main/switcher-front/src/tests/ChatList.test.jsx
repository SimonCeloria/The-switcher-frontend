import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import ChatList from "../components/Chat/ChatList";

const mockMessages = [
  { mensaje: "¡A disfrutar!", nombre: "Salchi" },
  { mensaje: "¡Vamos a divertirnos!", nombre: "Simon" },
  {
    is_log: true,
    mensaje: "¡Jugador bloqueado!",
    jugador_id: 1,
    jugador_bloqueado_id: 2,
    figura: "blocked_figure.png",
  },
  {
    is_log: true,
    mensaje: "¡Renzo ha ganado!",
    ganador: true,
    jugador_id: 3,
  },
  {
    is_log: true,
    mensaje: "Simon ha abandonado el partido",
    abandono: true,
    jugador_id: 2,
  },
  {
    is_log: true,
    mensaje: "Simon completo una figura",
    jugador_id: 2,
    figura: "blocked_figure.png",
  },
  {
    is_log: true,
    mensaje: "Renzo ha usado una carta",
    carta: "card_image.png",
    jugador_id: 3,
  },
];

describe("ChatList Component", () => {
  test("renders Chat component correctly", () => {
    render(<ChatList messages={mockMessages} getColor={() => "#3D5AFE"} />);

    mockMessages.forEach(({ mensaje }) => {
      const elements = screen.getAllByText(mensaje);
      expect(elements.length).toBeGreaterThan(0);
    });

    const figuraImg = screen.getByText("¡Jugador bloqueado!");
    expect(figuraImg).toBeInTheDocument();

    const ganadorMessage = screen.getByText("¡Renzo ha ganado!");
    expect(ganadorMessage).toBeInTheDocument();

    const abandonoMessage = screen.getByText("Simon ha abandonado el partido");
    expect(abandonoMessage).toBeInTheDocument();

    const cartaImg = screen.getByText("Renzo ha usado una carta");
    expect(cartaImg).toBeInTheDocument();

    const figura = screen.getByText("Simon completo una figura");
    expect(figura).toBeInTheDocument();
  });
});
