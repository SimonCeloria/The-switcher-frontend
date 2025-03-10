import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { CreateForm } from "../../components/CreateForm";
import { useForm } from "react-hook-form";

// Mock del contexto
const mockHandleName = vi.fn();
const mockMinPlayersClick = vi.fn();
const mockMaxPlayersClick = vi.fn();
const mockHandlePrivacidadChange = vi.fn();
const mockHandleContraseñaChange = vi.fn();
const mockOnEnter = vi.fn();

const ParentComponentMock = ({ esPrivada = false, contraseña = "" }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <CreateForm
      register={register}
      handleSubmit={handleSubmit(onSubmit)}
      errors={errors}
      handleMinPlayersClick={mockMinPlayersClick}
      handleMaxPlayersClick={mockMaxPlayersClick}
      handleName={mockHandleName}
      cantMin={2}
      cantMax={4}
      esPrivada={esPrivada}
      contraseña={contraseña}
      handlePrivacidadChange={mockHandlePrivacidadChange}
      handleContraseñaChange={mockHandleContraseñaChange}
      onEnter={mockOnEnter}
    />
  );
};

describe("CreateForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Renderiza CreateForm correctamente", async () => {
    render(<ParentComponentMock />);

    // Verificar que el formulario se renderiza
    await waitFor(() => {
      expect(screen.getByTestId("create-game-form")).toBeInTheDocument();
      expect(screen.getByText("NOMBRE DE LA PARTIDA")).toBeInTheDocument();
      expect(
        screen.getByText("CANTIDAD MÍNIMA DE JUGADORES:")
      ).toBeInTheDocument();
      expect(
        screen.getByText("CANTIDAD MÁXIMA DE JUGADORES:")
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Introduce el nombre de la partida")
      ).toBeInTheDocument();
      expect(screen.getAllByRole("button", { name: "2" }).length).toBe(2);
      expect(screen.getAllByRole("button", { name: "3" }).length).toBe(2);
      expect(screen.getAllByRole("button", { name: "4" }).length).toBe(2);
    });
  });

  it("Actualiza el nombre cuando se escribe", async () => {
    render(<ParentComponentMock />);

    const input = screen.getByPlaceholderText(
      "Introduce el nombre de la partida"
    );

    fireEvent.change(input, { target: { value: "Partida de prueba" } });

    await waitFor(() => {
      expect(mockHandleName).toHaveBeenCalled();
    });
  });

  it("Tira error si el nombre de la partida es menor a 3 caracteres", async () => {
    render(<ParentComponentMock />);

    const input = screen.getByPlaceholderText(
      "Introduce el nombre de la partida"
    );

    fireEvent.change(input, { target: { value: "Pa" } });

    fireEvent.blur(input); // Trigger para activar la validación

    fireEvent.submit(screen.getByTestId("create-game-form"));

    await waitFor(() => {
      expect(
        screen.getByText("El nombre debe tener al menos 3 caracteres")
      ).toBeInTheDocument();
    });
  });

  it("Tira error si el nombre de la partida es mayor a 40 caracteres", async () => {
    render(<ParentComponentMock />);

    const input = screen.getByPlaceholderText(
      "Introduce el nombre de la partida"
    );

    fireEvent.change(input, {
      target: { value: "Partida de prueba con un nombre muy largo" },
    });

    fireEvent.blur(input); // Trigger para activar la validación

    fireEvent.submit(screen.getByTestId("create-game-form"));

    await waitFor(() => {
      expect(
        screen.getByText("El nombre debe tener 40 caracteres o menos.")
      ).toBeInTheDocument();
    });
  });

  it("Actualiza la cantidad mínima de jugadores", async () => {
    render(<ParentComponentMock />);
    // Selecciona el primer botón de 4 jugadores
    const minPlayersButton = screen.getAllByRole("button", { name: "4" })[0];

    fireEvent.click(minPlayersButton);

    await waitFor(() => {
      expect(mockMinPlayersClick).toHaveBeenCalledWith(4);
    });
  });

  it("Actualiza la cantidad máxima de jugadores", async () => {
    render(<ParentComponentMock />);

    const maxPlayersButton = screen.getAllByRole("button", { name: "2" })[1];

    fireEvent.click(maxPlayersButton);

    await waitFor(() => {
      expect(mockMaxPlayersClick).toHaveBeenCalledWith(2);
    });
  });
  it("Maneja el cambio de privacidad correctamente", async () => {
    render(<ParentComponentMock />);

    const publicButton = screen.getByRole("button", { name: "Pública" });
    const privateButton = screen.getByRole("button", { name: "Privada" });

    fireEvent.click(privateButton);
    await waitFor(() => {
      expect(mockHandlePrivacidadChange).toHaveBeenCalledWith(true);
    });

    fireEvent.click(publicButton);
    await waitFor(() => {
      expect(mockHandlePrivacidadChange).toHaveBeenCalledWith(false);
    });
  });

  it("Muestra el campo de contraseña cuando la partida es privada", async () => {
    render(<ParentComponentMock esPrivada={true} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Introduce la contraseña")).toBeInTheDocument();
    });
  });

  it("Maneja el cambio de contraseña correctamente", async () => {
    render(<ParentComponentMock esPrivada={true} />);

    const passwordInput = screen.getByPlaceholderText("Introduce la contraseña");
    fireEvent.change(passwordInput, { target: { value: "secreto123" } });

    await waitFor(() => {
      expect(mockHandleContraseñaChange).toHaveBeenCalled();
    });
  });

  it("Alterna la visibilidad de la contraseña", async () => {
    render(<ParentComponentMock esPrivada={true} contraseña="secreto123" />);

    const passwordInput = screen.getByPlaceholderText("Introduce la contraseña");
    const toggleButton = screen.getByRole("button", { name: "👁️" });

    expect(passwordInput).toHaveAttribute("type", "password");

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(passwordInput).toHaveAttribute("type", "text");
      expect(screen.getByRole("button", { name: "🙈" })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "🙈" }));

    await waitFor(() => {
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(screen.getByRole("button", { name: "👁️" })).toBeInTheDocument();
    });
  });

  it("Maneja la tecla Enter en el campo de nombre", async () => {
    render(<ParentComponentMock />);

    const nameInput = screen.getByPlaceholderText("Introduce el nombre de la partida");
    fireEvent.keyDown(nameInput, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(mockOnEnter).toHaveBeenCalled();
    });
  });
});
