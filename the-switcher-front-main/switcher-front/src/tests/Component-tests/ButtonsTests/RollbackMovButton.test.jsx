import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { RollbackMovButton } from "../../../components/Button/RollbackMovButton";
import { PartidaWSContext } from "../../../contexts/PartidaWSContext";
import { describe, it, expect, vi } from "vitest";

describe("RollbackMovButton", () => {
  it("Renderiza el botón y después lo clickea para testear si ejecuta el handle", () => {
    const mockHandleRollback = vi.fn();

    render(
      <PartidaWSContext.Provider value={{ handleRollback: mockHandleRollback }}>
        <RollbackMovButton label="Deshacer movimiento" />
      </PartidaWSContext.Provider>
    );

    const button = screen.getByText(/Deshacer movimiento/i);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockHandleRollback).toHaveBeenCalledTimes(1);
  });

  it("Renderiza el botón con un label inválido", () => {
    const mockHandleRollback = vi.fn();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <PartidaWSContext.Provider value={{ handleRollback: mockHandleRollback }}>
        <RollbackMovButton label={123} />
      </PartidaWSContext.Provider>
    );

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });

  //JUST TO CHECK THAT LINE 20 (in RollbackMovButton.jsx ) IS WORKING WITH THE DISABLED PROP AND ENABLED PROP.
  it("debería renderizar el botón como habilitado con el estilo correcto", () => {
    const mockHandleRollback = vi.fn();

    render(
      <PartidaWSContext.Provider value={{ handleRollback: mockHandleRollback }}>
        <RollbackMovButton label="Deshacer movimiento" disabled={false} />
      </PartidaWSContext.Provider>
    );

    const button = screen.getByText(/Deshacer movimiento/i);
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-[var(--Rojo)]');
  });

  it("debería renderizar el botón como deshabilitado con el estilo correcto", () => {
    const mockHandleRollback = vi.fn();

    render(
      <PartidaWSContext.Provider value={{ handleRollback: mockHandleRollback }}>
        <RollbackMovButton label="Deshacer movimiento" disabled={true} />
      </PartidaWSContext.Provider>
    );

    const button = screen.getByText(/Deshacer movimiento/i);
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-gray-400');
    expect(button).toBeDisabled(); 
  });
});