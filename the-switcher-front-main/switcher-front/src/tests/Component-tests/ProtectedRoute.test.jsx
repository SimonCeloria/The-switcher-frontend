import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../../components/ProtectedRoute";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock de react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: vi.fn(),
    Navigate: vi.fn(({ to }) => <div>Redirected to {to}</div>),
    MemoryRouter: actual.MemoryRouter,
  };
});

describe("ProtectedRoute Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("Redirecciona si no esta en el storage", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Redirected to /</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Redirected to /")).toBeInTheDocument();
  });

  test("Renderiza el componente si el id esta en el storage", () => {
    sessionStorage.setItem("idPlayer", "123");

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    // Verifica que el contenido protegido se renderiza
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});
