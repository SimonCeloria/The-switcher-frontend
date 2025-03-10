import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CreateGameButton } from "../../../components/Button/CreateGameButton";
import { describe, it, expect, vi } from "vitest";

describe("CreateGameButton", () => {
  it("Renderizo el boton y verifico que exista (el test mas inutil que hice en mi vida)", () => {
    // Mockeo ? no, no hace falta 

    // Renderizo el componente con el mockeo del Contexto

    render(<CreateGameButton />);

    // Reviso si se renderizo
    const button = screen.getByText(/Crear partida/i);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute("type", "submit");
  });
});