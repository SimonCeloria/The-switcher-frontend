import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { PartidaContext } from "../../contexts/PartidaContext";
import { ProtectedPartida } from "../../components/ProtectedPartida";
import "@testing-library/jest-dom";

describe("ProtectedPartida Component", () => {
  const setIdPartidaMock = vi.fn();
  const contextValue = {
    setIdPartida: setIdPartidaMock,
  };

  beforeEach(() => {
    // Limpiar sessionStorage antes de cada prueba
    sessionStorage.clear();
  });

  test("Renderiza el hijo si la uuid es correcta", () => {
    const idPartida = "123";
    sessionStorage.setItem("idPartida", idPartida);

    render(
      <MemoryRouter initialEntries={[`/partida/uuid-${idPartida}`]}>
        <PartidaContext.Provider value={contextValue}>
          <Routes>
            <Route
              path="/partida/:uuidPartida"
              element={
                <ProtectedPartida>
                  <div>Protected Content</div>
                </ProtectedPartida>
              }
            />
          </Routes>
        </PartidaContext.Provider>
      </MemoryRouter>
    );

    // Verifica que el contenido protegido se renderiza
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("Actualiza info y contexto si la partida no coincide", () => {
    const idPartida = "123";
    sessionStorage.setItem("idPartida", "456");

    render(
      <MemoryRouter initialEntries={[`/partida/uuid-${idPartida}`]}>
        <PartidaContext.Provider value={contextValue}>
          <Routes>
            <Route
              path="/partida/:uuidPartida"
              element={
                <ProtectedPartida>
                  <div>Protected Content</div>
                </ProtectedPartida>
              }
            />
          </Routes>
        </PartidaContext.Provider>
      </MemoryRouter>
    );

    // Verifica que el contenido protegido se renderiza
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    // Verifica que sessionStorage y el contexto se actualizan
    expect(sessionStorage.getItem("idPartida")).toBe(idPartida);
    expect(setIdPartidaMock).toHaveBeenCalledWith(idPartida);
  });

  test("Redirige a '/play' si no hay uuid en la partida", () => {
    render(
      <MemoryRouter initialEntries={[`/partida/uuid-`]}>
        <PartidaContext.Provider value={contextValue}>
          <Routes>
            <Route
              path="/partida/:uuidPartida"
              element={
                <ProtectedPartida>
                  <div>Protected Content</div>
                </ProtectedPartida>
              }
            />
            <Route path="/play" element={<div>Redirected to Play</div>} />
          </Routes>
        </PartidaContext.Provider>
      </MemoryRouter>
    );

    // Verifica que redirige a '/play'
    expect(screen.getByText("Redirected to Play")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  test("Redirige a '/play' si la uuid tiene un formato incorrecto", () => {
    render(
      <MemoryRouter initialEntries={[`/partida/uuid-INVALID_UUID`]}>
        <PartidaContext.Provider value={contextValue}>
          <Routes>
            <Route
              path="/partida/:uuidPartida"
              element={
                <ProtectedPartida>
                  <div>Protected Content</div>
                </ProtectedPartida>
              }
            />
            <Route path="/play" element={<div>Redirected to Play</div>} />
          </Routes>
        </PartidaContext.Provider>
      </MemoryRouter>
    );

    // Verifica que redirige a '/play'
    expect(screen.getByText("Redirected to Play")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
