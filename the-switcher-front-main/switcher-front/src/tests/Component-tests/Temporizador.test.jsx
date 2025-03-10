import React from "react";
import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CountdownTimer from "../../components/Temporizador";
import { PartidaWSContext } from "../../contexts/PartidaWSContext";

describe("CountdownTimer", () => {
    const mockContextValue = {
        turnoNuevo: false,
        setTurnoNuevo: vi.fn(),
        ganador: { nombre: "" },
    };

    beforeEach(() => {
        sessionStorage.clear();
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.clearAllTimers();
    });

    it("renders without crashing", () => {
        render(
            <PartidaWSContext.Provider value={mockContextValue}>
                <CountdownTimer />
            </PartidaWSContext.Provider>
        );
        expect(screen.getByTestId("countdown-timer")).to.exist;
    });

    it("initializes with 2 minutes", () => {
        render(
            <PartidaWSContext.Provider value={mockContextValue}>
                <CountdownTimer />
            </PartidaWSContext.Provider>
        );
        const timer = screen.getByTestId("countdown-timer");
        expect(getComputedStyle(timer).color).toBe("rgb(0, 0, 0)");
    });

    it("updates the timer every second", () => {
        render(
            <PartidaWSContext.Provider value={mockContextValue}>
                <CountdownTimer />
            </PartidaWSContext.Provider>
        );

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        const timer = screen.getByTestId("countdown-timer");
        expect(getComputedStyle(timer).color).toBe("rgb(0, 0, 0)");
    });

    it("changes color to crimson when less than 30 seconds are left", () => {
        render(
            <PartidaWSContext.Provider value={mockContextValue}>
                <CountdownTimer />
            </PartidaWSContext.Provider>
        );

        act(() => {
            vi.advanceTimersByTime(91000); // 91 seconds
        });

        const timer = screen.getByTestId("countdown-timer");
        expect(getComputedStyle(timer).color).toBe("rgb(220, 20, 60)");
    });

    it("stops the timer when there is a winner", () => {
        const contextWithWinner = {
            ...mockContextValue,
            ganador: { nombre: "Player1" },
        };

        render(
            <PartidaWSContext.Provider value={contextWithWinner}>
                <CountdownTimer />
            </PartidaWSContext.Provider>
        );

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        const timer = screen.getByTestId("countdown-timer");
        expect(getComputedStyle(timer).color).toBe("rgb(0, 0, 0)");
    });

    it("resets the timer when turnoNuevo changes", () => {
        const contextWithTurnoNuevo = {
            ...mockContextValue,
            turnoNuevo: true,
        };

        render(
            <PartidaWSContext.Provider value={contextWithTurnoNuevo}>
                <CountdownTimer />
            </PartidaWSContext.Provider>
        );

        const timer = screen.getByTestId("countdown-timer");
        expect(getComputedStyle(timer).color).toBe("rgb(0, 0, 0)");
    });

    it("stops the timer when time is up", () => {
        render(
            <PartidaWSContext.Provider value={mockContextValue}>
                <CountdownTimer />
            </PartidaWSContext.Provider>
        );

        act(() => {
            vi.advanceTimersByTime(120000); // 120 seconds
        });

        const timer = screen.getByTestId("countdown-timer");
        expect(getComputedStyle(timer).color).toBe("rgb(220, 20, 60)");
    });

    it("loads a date from sessionStorage if it exists", () => {
        sessionStorage.setItem("fechaAlEmpezar", Date.now());
        render(
            <PartidaWSContext.Provider value={mockContextValue}>
                <CountdownTimer />
            </PartidaWSContext.Provider>
        );

        const timer = screen.getByTestId("countdown-timer");
        expect(getComputedStyle(timer).color).toBe("rgb(0, 0, 0)");
    });
});
