import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateGameForm from "../../components/CreateGameForm"; // Ajusta la ruta según tu estructura

vi.mock("../../containers/CreateFormContainer", () => {
  return {
    __esModule: true,
    CreateFormContainer: ({ handleSubmitExt }) => (
      <div>
        <button onClick={() => handleSubmitExt("Test data")}>Submit</button>
      </div>
    ),
  };
});

describe("CreateGameForm Component", () => {
  const mockHandleSubmit = vi.fn();
  const mockHandleClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("Renderiza CreateGameForm con showForm en true", () => {
    render(
      <CreateGameForm
        handleSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        showForm={true}
      />
    );

    // Verificar que el formulario se renderiza
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  test("Renderiza CreateGameForm con showForm en false", () => {
    render(
      <CreateGameForm
        handleSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        showForm={false}
      />
    );

    // Verificar que el formulario no se renderiza
    expect(screen.queryByText("×")).not.toBeInTheDocument();
  });

  test("Llama a handleClose si clickeo fuera del form", () => {
    render(
      <CreateGameForm
        handleSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        showForm={true}
      />
    );

    // Simular el clic fuera del formulario
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    // Verificar que se llamó a la función de cerrar el formulario
    expect(mockHandleClose).toHaveBeenCalled();
  });

  test("Llama a handleSubmit cuando se envía el formulario", () => {
    render(
      <CreateGameForm
        handleSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        showForm={true}
      />
    );

    // Simular el clic en el botón de envío del formulario
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }));

    // Verificar que se llamó a la función de envío del formulario
    expect(mockHandleSubmit).toHaveBeenCalled();
  });
});
