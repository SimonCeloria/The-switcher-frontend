import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "../../components/LoginForm";
import { expect, it, vi } from "vitest";
import { useForm } from "react-hook-form";

const mockCreateJugador = vi.fn();
const serverError = "Error al crear jugador. Por favor, intente de nuevo.";
const mockHandleEnter = vi.fn();
const mockHandleName = vi.fn();

const MockParentWithoutError = ({ initialName }) => {
  const mockName = initialName;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <LoginForm
      name={mockName}
      handleName={mockHandleName}
      errors={errors}
      register={register}
      handleSubmit={handleSubmit(mockCreateJugador)}
      serverError=""
      onEnter={mockHandleEnter}
    />
  );
};

const MockParentWithError = () => {
  var mockName = "Juan";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <LoginForm
      name={mockName}
      handleName={mockHandleName}
      errors={errors}
      register={register}
      handleSubmit={handleSubmit(mockCreateJugador)}
      serverError={serverError}
      onEnter={mockHandleEnter}
    />
  );
};

describe("LoginForm", () => {
  it("Renderiza input y boton deshabilitado", () => {
    render(<MockParentWithoutError initialName="" />);

    expect(
      screen.getByPlaceholderText("Introduzca su nombre")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Iniciar sesión/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Iniciar sesión/i })
    ).toBeDisabled();
  });

  it("Actualiza el input y habilita boton", async () => {
    render(<MockParentWithoutError initialName="Juan" />);

    const input = screen.getByPlaceholderText("Introduzca su nombre");
    fireEvent.change(input, { target: { value: "Juanc" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(mockHandleName).toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: /Iniciar sesión/i })
      ).not.toBeDisabled();
    });
  });

  it("Muestra error de servidor", async () => {
    render(<MockParentWithError />);

    await waitFor(() => {
      expect(screen.getByText(serverError)).toBeInTheDocument();
    });
  });

  it("Muestra error de nombre corto", async () => {
    render(<MockParentWithoutError initialName="Ju" />);

    const button = screen.getByRole("button", { name: /Iniciar sesión/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("El nombre debe tener al menos 3 caracteres.")
      ).toBeInTheDocument();
      expect(mockCreateJugador).not.toHaveBeenCalled();
    });
  });

  it("Muestra error de nombre largo", async () => {
    render(<MockParentWithoutError initialName="Un nombre de 21 chars" />);

    const button = screen.getByRole("button", { name: /Iniciar sesión/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("El nombre debe tener 20 caracteres o menos.")
      ).toBeInTheDocument();
      expect(mockCreateJugador).not.toHaveBeenCalled();
    });
  });

  it("Llama a handleEnter al presionar tecla", async () => {
    render(<MockParentWithoutError initialName="Juan" />);

    const input = screen.getByPlaceholderText("Introduzca su nombre");
    fireEvent.keyDown(input, { key: "Enter" });

    await waitFor(() => {
      expect(mockHandleEnter).toHaveBeenCalled();
    });
  });
});
