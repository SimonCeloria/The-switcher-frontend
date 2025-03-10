import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GamesList from "../../components/GameList";
import { ListaPartidaContext } from "../../contexts/ListaPartidaContext";
import { describe, it, expect } from "vitest";

describe("GamesList", () => {
  const renderWithContext = (gameList, filter = "", playerCount = [], showActiveOnly = false) => {
    return render(
      <ListaPartidaContext.Provider value={{ gameList }}>
        <GamesList games={gameList} filter={filter} playerCount={playerCount} showActiveOnly={showActiveOnly} />
      </ListaPartidaContext.Provider>
    );
  };

  it("Renderiza una partida y verifica que esté habilitada para unirse", () => {
    const partidaMock = {
      id: 1,
      nombre: "Partida A",
      jugadores_partida: ["Jugador 1", "Jugador 2"],
      minJugadores: 2,
      maxJugadores: 4,
      password: null,
      owner: 1,
      iniciada: false,
    };

    renderWithContext([partidaMock]);

    // Se renderiza el nombre y la cantidad de jugadores
    expect(screen.getByText(partidaMock.nombre)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${partidaMock.jugadores_partida.length}/${partidaMock.maxJugadores}`
      )
    ).toBeInTheDocument();

    // Verificar que el botón de "unirse" esté habilitado
    const button = screen.getByRole("button", { name: /Unirse/i });
    expect(button).not.toBeDisabled();
  });

  it("Renderiza múltiples partidas y verifica que existan los elementos correctos", () => {
    const partidasMock = [
      {
        id: 1,
        nombre: "Partida A",
        jugadores_partida: ["Jugador 1", "Jugador 2"],
        minJugadores: 2,
        maxJugadores: 4,
        password: null,
        owner: 1,
        iniciada: false,
      },
      {
        id: 2,
        nombre: "Partida B",
        jugadores_partida: ["Jugador 3"],
        minJugadores: 2,
        maxJugadores: 4,
        password: null,
        owner: 2,
        iniciada: false,
      },
      {
        id: 3,
        nombre: "Partida C",
        jugadores_partida: ["Jugador 4", "Jugador 5", "Jugador 6"],
        minJugadores: 2,
        maxJugadores: 3,
        password: null,
        owner: 3,
        iniciada: true,
      },
    ];

    renderWithContext(partidasMock);

    partidasMock.forEach((partida) => {
      expect(screen.getByText(partida.nombre)).toBeInTheDocument();
      expect(
        screen.getByText(
          `${partida.jugadores_partida.length}/${partida.maxJugadores}`
        )
      ).toBeInTheDocument();
    });
  });

  it("Filtra partidas por nombre correctamente", () => {
    const partidasMock = [
      {
        id: 1,
        nombre: "Partida A",
        jugadores_partida: ["Jugador 1"],
        maxJugadores: 4,
      },
      {
        id: 2,
        nombre: "Dale Partida",
        jugadores_partida: ["Jugador 2", "Jugador 3"],
        maxJugadores: 3,
      },
    ];

    renderWithContext(partidasMock, "Dale");

    // Solo se renderiza la partida con el nombre "Dale Partida"
    expect(screen.getByText("Dale Partida")).toBeInTheDocument();
    expect(screen.queryByText("Partida A")).not.toBeInTheDocument();
  });

  it("Filtra partidas por cantidad de jugadores correctamente", () => {
    const partidasMock = [
      {
        id: 1,
        nombre: "Partida A",
        jugadores_partida: ["Jugador 1"],
        maxJugadores: 4,
      },
      {
        id: 2,
        nombre: "Partida B",
        jugadores_partida: ["Jugador 2", "Jugador 3"],
        maxJugadores: 3,
      },
    ];

    // Filter for games with either 2 or 3 players
    renderWithContext(partidasMock, "", [2, 3]);

    // Partida B matches the filter, Partida A doesn't
    expect(screen.getByText("Partida B")).toBeInTheDocument();
    expect(screen.queryByText("Partida A")).not.toBeInTheDocument();
  });

  it("Renderiza una partida y verifica que el botón de unirse esté deshabilitado", () => {
    const partidaMock = {
      id: 1,
      nombre: "Partida A",
      jugadores_partida: ["Jugador 1", "Jugador 2", "Jugador 3", "Jugador 4"],
      maxJugadores: 4,
      iniciada: false,
    };

    renderWithContext([partidaMock]);

    // Se renderizan el nombre y la cantidad de jugadores
    expect(screen.getByText(partidaMock.nombre)).toBeInTheDocument();
    expect(
      screen.getByText(
        `${partidaMock.jugadores_partida.length}/${partidaMock.maxJugadores}`
      )
    ).toBeInTheDocument();

    // El botón de "unirse" está deshabilitado porque la partida está llena
    const button = screen.getByRole("button", { name: /Unirse/i });
    expect(button).toBeDisabled();
  });

  it("Filtra partidas no iniciadas correctamente", () => {
    const partidasMock = [
      {
        id: 1,
        nombre: "Partida A",
        jugadores_partida: ["Jugador 1", "Jugador 2"],
        maxJugadores: 4,
        iniciada: false,
      },
      {
        id: 2,
        nombre: "Partida B",
        jugadores_partida: ["Jugador 3", "Jugador 4"],
        maxJugadores: 4,
        iniciada: true,
      },
      {
        id: 3,
        nombre: "Partida C",
        jugadores_partida: ["Jugador 5"],
        maxJugadores: 3,
        iniciada: true,
      },
    ];
  
    renderWithContext(partidasMock, "", [], true);
  
    expect(screen.getByText("Partida A")).toBeInTheDocument();
    expect(screen.queryByText("Partida B")).not.toBeInTheDocument();
    expect(screen.queryByText("Partida C")).not.toBeInTheDocument();
  
    expect(screen.getByText("2/4")).toBeInTheDocument(); // Partida A
  });

  it("Diferencia partida publica de privada",()=>{
    const partidasMock = [
      {
        id: 1,
        nombre: "Partida A",
        jugadores_partida: ["Jugador 1"],
        maxJugadores: 4,
        password: null,
      },
      {
        id: 2,
        nombre: "Partida B",
        jugadores_partida: ["Jugador 2"],
        maxJugadores: 4,
        password: "1234",
      },
    ];
  
    renderWithContext(partidasMock);
  
    expect(screen.getByText("Pública")).toBeInTheDocument();
    expect(screen.getByText("Privada")).toBeInTheDocument();
  })
});
describe('GamesList - Filtro de partidas privadas', () => {
  const games = [
    { id: 1, nombre: 'Partida Pública', jugadores_partida: [], maxJugadores: 4, iniciada: false, password: null },
    { id: 2, nombre: 'Partida Privada 1', jugadores_partida: [], maxJugadores: 4, iniciada: false, password: '1234' },
    { id: 3, nombre: 'Partida Privada 2', jugadores_partida: [], maxJugadores: 4, iniciada: false, password: '5678' },
  ];

  it('debe mostrar solo las partidas privadas cuando showPrivateOnly es true', () => {
    render(<GamesList games={games} filter="" playerCount={[]} showActiveOnly={false} showPrivateOnly={true} />);

    expect(screen.queryByText('Partida Pública')).not.toBeInTheDocument();
    expect(screen.getByText('Partida Privada 1')).toBeInTheDocument();
    expect(screen.getByText('Partida Privada 2')).toBeInTheDocument();
  });

  it('debe mostrar todas las partidas cuando showPrivateOnly es false', () => {
    render(<GamesList games={games} filter="" playerCount={[]} showActiveOnly={false} showPrivateOnly={false} />);

    expect(screen.getByText('Partida Pública')).toBeInTheDocument();
    expect(screen.getByText('Partida Privada 1')).toBeInTheDocument();
    expect(screen.getByText('Partida Privada 2')).toBeInTheDocument();
  });
});
