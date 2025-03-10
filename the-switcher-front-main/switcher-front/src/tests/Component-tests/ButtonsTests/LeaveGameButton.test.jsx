import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { LeaveGameButton } from "../../../components/Button/LeaveGameButton";
import { PartidaWSContext } from "../../../contexts/PartidaWSContext";
import { describe, it, expect, vi } from "vitest";

describe("LeaveGameButton", () => {
  it("Renderiza el botón y después lo clickea para testear si ejecuta el handle", () => {
    const mockHandleLeave = vi.fn();

    render(
      <PartidaWSContext.Provider value={{ handleLeave: mockHandleLeave }}>
        <LeaveGameButton label="Abandonar" />
      </PartidaWSContext.Provider>
    );

    const button = screen.getByText(/Abandonar/i);
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockHandleLeave).toHaveBeenCalledTimes(1);
  });

  it("Renderiza el botón con un label inválido", () => {

    const mockHandleLeave = vi.fn();
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <PartidaWSContext.Provider value={{ handleLeave: mockHandleLeave }}>
        <LeaveGameButton label={123} />
      </PartidaWSContext.Provider>
    );

    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    consoleErrorSpy.mockRestore();
  });
});