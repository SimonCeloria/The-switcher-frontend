import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, it, expect, vi } from "vitest";

// Componente a testear
import Popout from "../../components/PopOut";

describe("Popout", () => {
  it("Renderiza el PopOut, chequea que se renderice correctamente el contenido dentro y el boton de cierre, luego apreta el boton y testea que se ejecute la funcion", () => {
    // Mockeo
    const isOpen = true;
    const onCloseMock = vi.fn();

    // Renderizo el componente con el mockeo del Contexto
    render(
      <Popout isOpen={isOpen} onClose={onCloseMock}>
        <h1>TestPoping</h1>
      </Popout>
    );

    // Reviso si se renderizo
    expect(screen.getByText(/TestPoping/i)).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: /x/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toBeCalledTimes(1);
  });

  it("Renderiza el PopOut, chequea que no se renderice el contenido dentro, y el boton de cierre no se renderice", () => {
    // Mockeo
    const isOpen = false;
    const onCloseMock = vi.fn();

    // Renderizo el componente con el mockeo del Contexto
    render(
      <Popout isOpen={isOpen} onClose={onCloseMock}>
        <h1>TestPoping</h1>
      </Popout>
    );

    // Reviso si se renderizo
    expect(screen.queryByText(/TestPoping/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /×/i })
    ).not.toBeInTheDocument();
  });
});
