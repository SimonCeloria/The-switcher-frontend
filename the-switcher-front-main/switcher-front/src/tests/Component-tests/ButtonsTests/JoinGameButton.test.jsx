import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { JoinGameButton } from "../../../components/Button/JoinGameButton";
import { ListaPartidaContext } from "../../../contexts/ListaPartidaContext";
import { describe, it, expect, vi } from "vitest";

describe("JoinGameButton", () => {
  const handleJoinMock = vi.fn();
  const partidaMock = {
    handleJoin: handleJoinMock,
  };

  it("Renderiza el botón con disabled en true y verifica que esté deshabilitado", () => {
    render(
      <ListaPartidaContext.Provider value={partidaMock}>
        <JoinGameButton id_game={1} disabled={true} />
      </ListaPartidaContext.Provider>
    );

    const button = screen.getByText(/UNIRSE/i);
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleJoinMock).not.toHaveBeenCalled();
  });

  it("Renderiza el botón, llama al handleJoin y verifica que se ejecute", () => {
    render(
      <ListaPartidaContext.Provider value={partidaMock}>
        <JoinGameButton id_game={1} disabled={false} />
      </ListaPartidaContext.Provider>
    );

    const button = screen.getByText(/UNIRSE/i);
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(handleJoinMock).toHaveBeenCalledTimes(1);
  });

  it("Muestra el popup para partidas privadas", async () => {
    render(
      <ListaPartidaContext.Provider value={partidaMock}>
        <JoinGameButton id_game={1} disabled={false} privada={true} />
      </ListaPartidaContext.Provider>
    );

    const button = screen.getByText(/UNIRSE/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Partida privada")).toBeInTheDocument();
    });
  });

  it("Maneja el cambio de contraseña y el toggle de visibilidad", async () => {
    render(
      <ListaPartidaContext.Provider value={partidaMock}>
        <JoinGameButton id_game={1} disabled={false} privada={true} />
      </ListaPartidaContext.Provider>
    );

    const button = screen.getByText(/UNIRSE/i);
    fireEvent.click(button);

    const passwordInput = await screen.findByPlaceholderText("Contraseña");
    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.change(passwordInput, { target: { value: "secreto123" } });
    expect(passwordInput).toHaveValue("secreto123");

    const toggleButton = screen.getByText("👁️");
    fireEvent.click(toggleButton);

    expect(passwordInput).toHaveAttribute("type", "text");
    expect(screen.getByText("🙈")).toBeInTheDocument();
  });

  it("Maneja el error de contraseña incorrecta", async () => {
    handleJoinMock.mockRejectedValueOnce(new Error("Contraseña incorrecta"));

    render(
      <ListaPartidaContext.Provider value={partidaMock}>
        <JoinGameButton id_game={1} disabled={false} privada={true} />
      </ListaPartidaContext.Provider>
    );

    const button = screen.getByText(/UNIRSE/i);
    fireEvent.click(button);

    const passwordInput = await screen.findByPlaceholderText("Contraseña");
    fireEvent.change(passwordInput, { target: { value: "contraseñaIncorrecta" } });

    const joinButton = screen.getByText("UNIRSE A LA PARTIDA");
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(screen.getByText("Contraseña incorrecta. Inténtalo de nuevo.")).toBeInTheDocument();
    });
  });

  it("Cierra el popup al hacer clic en CANCELAR", async () => {
    render(
      <ListaPartidaContext.Provider value={partidaMock}>
        <JoinGameButton id_game={1} disabled={false} privada={true} />
      </ListaPartidaContext.Provider>
    );

    const button = screen.getByText(/UNIRSE/i);
    fireEvent.click(button);

    const cancelButton = await screen.findByText("CANCELAR");
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Partida privada")).not.toBeInTheDocument();
    });
  });

  it("Se une a la partida privada con contraseña correcta", async () => {
    handleJoinMock.mockResolvedValueOnce();

    render(
      <ListaPartidaContext.Provider value={partidaMock}>
        <JoinGameButton id_game={1} disabled={false} privada={true} />
      </ListaPartidaContext.Provider>
    );

    const button = screen.getByText(/UNIRSE/i);
    fireEvent.click(button);

    const passwordInput = await screen.findByPlaceholderText("Contraseña");
    fireEvent.change(passwordInput, { target: { value: "contraseñaCorrecta" } });

    const joinButton = screen.getByText("UNIRSE A LA PARTIDA");
    fireEvent.click(joinButton);

    await waitFor(() => {
      expect(handleJoinMock).toHaveBeenCalledWith(expect.anything(), 1, "contraseñaCorrecta");
      expect(screen.queryByText("Partida privada")).not.toBeInTheDocument();
    });
  });
});