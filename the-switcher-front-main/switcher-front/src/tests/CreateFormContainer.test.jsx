import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateFormContainer } from "../containers/CreateFormContainer";
import "@testing-library/jest-dom";

vi.mock("../components/CreateForm", () => ({
  CreateForm: ({
    handleSubmit,
    handleName,
    onEnter,
    handleMinPlayersClick,
    handleMaxPlayersClick,
  }) => (
    <form onSubmit={handleSubmit} data-testid="create-game-form">
      <label htmlFor="nombrePartida">Nombre de la partida</label>
      <input
        id="nombrePartida"
        name="nombrePartida"
        type="text"
        onChange={handleName}
        onKeyDown={onEnter}
      />
      <input id="cantMin" name="cantMin" type="number" />
      <input id="cantMax" name="cantMax" type="number" />
      <button type="button" onClick={() => handleMinPlayersClick(4)}>
        Set Min to 4
      </button>
      <button type="button" onClick={() => handleMinPlayersClick(3)}>
        Set Min to 3
      </button>
      <button type="button" onClick={() => handleMaxPlayersClick(2)}>
        Set Max to 2
      </button>
      <button type="button" onClick={() => handleMaxPlayersClick(3)}>
        Set Max to 3
      </button>
      <button type="submit">Submit</button>
    </form>
  ),
}));

describe("CreateFormContainer", () => {
  let handleSubmitExt;

  beforeEach(() => {
    handleSubmitExt = vi.fn();
    render(<CreateFormContainer handleSubmitExt={handleSubmitExt} />);
  });

  it("should update formData when input changes", async () => {
    const input = screen.getByLabelText(/nombre de la partida/i);

    fireEvent.change(input, { target: { value: "  New Game     " } });

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmitExt).toHaveBeenCalledWith({
        nombrePartida: "New Game",
        cantMin: 2,
        cantMax: 4,
        esPrivada: false,
        contraseña: "",
      });
    });
  });

  it("should send formData when enter key is pressed", async () => {
    const input = screen.getByLabelText(/nombre de la partida/i);

    fireEvent.change(input, { target: { value: "  New Game     " } });
    fireEvent.keyDown(input, { key: "Enter", code: 13 });

    await waitFor(() => {
      expect(handleSubmitExt).toHaveBeenCalledWith({
        nombrePartida: "New Game",
        cantMin: 2,
        cantMax: 4,
        esPrivada: false,
        contraseña: "",
      });
    });
  });

  it("should update formData when min players button is clicked", async () => {
    const minPlayersButton = screen.getByRole("button", {
      name: /set min to 4/i,
    });
    fireEvent.click(minPlayersButton);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmitExt).toHaveBeenCalledWith({
        nombrePartida: "",
        cantMin: 4,
        cantMax: 4,
        esPrivada: false,
        contraseña: "",
      });
    });
  });

  it("should update formData when max players button is clicked", async () => {
    const maxPlayersButton = screen.getByRole("button", {
      name: /set max to 2/i,
    });
    fireEvent.click(maxPlayersButton);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmitExt).toHaveBeenCalledWith({
        nombrePartida: "",
        cantMin: 2,
        cantMax: 2,
        esPrivada: false,
        contraseña: "",
      });
    });
  });

  it("should update min and max when min is called with higher value than max", async () => {
    const maxPlayersButton = screen.getByRole("button", {
      name: /set max to 2/i,
    });
    fireEvent.click(maxPlayersButton);
    const minPlayersButton = screen.getByRole("button", {
      name: /set min to 3/i,
    });
    fireEvent.click(minPlayersButton);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmitExt).toHaveBeenCalledWith({
        nombrePartida: "",
        cantMin: 3,
        cantMax: 3,
        esPrivada: false,
        contraseña: "",
      });
    });
  });

  it("should update min and max when max is called with lower value than min", async () => {
    const minPlayersButton = screen.getByRole("button", {
      name: /set min to 3/i,
    });
    fireEvent.click(minPlayersButton);
    const maxPlayersButton = screen.getByRole("button", {
      name: /set max to 2/i,
    });
    fireEvent.click(maxPlayersButton);

    const submitButton = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmitExt).toHaveBeenCalledWith({
        nombrePartida: "",
        cantMin: 2,
        cantMax: 2,
        esPrivada: false,
        contraseña: "",
      });
    });
  });
});
