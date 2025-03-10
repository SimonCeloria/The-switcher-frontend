import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import InputChat from "../../components/Chat/InputChat";
import { useForm } from "react-hook-form";

const mockOnSubmit = vi.fn();

const ComponentMock = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <InputChat register={register} onSubmit={mockOnSubmit} errors={errors} />
  );
};

describe("InputChat Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render correctly", () => {
    render(<InputChat onSubmit={mockOnSubmit} />);

    expect(
      screen.getByPlaceholderText("Escribe un mensaje...")
    ).toBeInTheDocument();
  });

  it("Enviar mensaje valido", async () => {
    render(<ComponentMock />);

    const input = screen.getByPlaceholderText("Escribe un mensaje...");

    fireEvent.change(input, { target: { value: "Mensaje de prueba" } });

    fireEvent.submit(input.closest("form"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith("Mensaje de prueba");
    });
  });

  it("Enviar mensaje invalido", async () => {
    render(<ComponentMock />);

    const input = screen.getByPlaceholderText("Escribe un mensaje...");

    fireEvent.change(input, { target: { value: "" } });

    fireEvent.submit(input.closest("form"));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledTimes(0);
    });
  });
});
