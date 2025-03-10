import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";
import App from "../App";
import { PartidaContext } from "../contexts/PartidaContext";

// Mockear los componentes y hooks de react-router-dom
vi.mock("react-router-dom", () => ({
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ element }) => <div>{element}</div>,
  Navigate: () => <div>Redirecting...</div>, // Mock de redirección
  useParams: () => ({ uuidPartida: "partida-1" }), // Mockear useParams
  useNavigate: () => vi.fn(), // Mockear useNavigate
  Outlet: () => <div>Outlet Mocked</div>, // Mockear Outlet
}));

// Mock del contexto PartidaContext
const MockPartidaContextProvider = ({ children }) => (
  <PartidaContext.Provider value={{ setIdPartida: vi.fn() }}>
    {children}
  </PartidaContext.Provider>
);

// Test para la ruta Home
describe("App Routes", () => {
  it("debería renderizar la ruta LobbyPage y redirigir correctamente", () => {
    render(
      <MockPartidaContextProvider>
        <App />
      </MockPartidaContextProvider>
    );
    expect(screen.getByText("Redirecting...")).toBeInTheDocument(); // Redirección simulada
    expect(screen.getByText("Outlet Mocked")).toBeInTheDocument(); // Outlet mockeado
  });

  it("debería renderizar la ruta Home", () => {
    render(
      <MockPartidaContextProvider>
        <App />
      </MockPartidaContextProvider>
    );

    // Busca el texto que realmente existe en el componente Home
    const nicknameText = screen.getByText(/introduzca su nickname/i);
    expect(nicknameText).toBeInTheDocument();
  });

  it("debería renderizar la ruta NotFound para rutas no definidas", () => {
    render(
      <MockPartidaContextProvider>
        <App />
      </MockPartidaContextProvider>
    );
    // Verifica la presencia de texto 404 o similar en la página de "Not Found"
    expect(screen.getByText(/URL NOT FOUND/i)).toBeInTheDocument();
  });
});
