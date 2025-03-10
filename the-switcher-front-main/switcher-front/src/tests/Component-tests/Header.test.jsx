import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { HeaderGame } from "../../components/Header";
import { describe, it, expect, vi } from "vitest";

describe("HeaderGame", () => {
  it("Renderiza el header y chequea que se renderice correctamente", () => {
    // Renderizo el componente con el mockeo del Contexto
    render(<HeaderGame />);

    // Reviso si se renderizo
    const header = screen.getByText(/The Switcher/i);
    expect(header).toBeInTheDocument();
  });
});
