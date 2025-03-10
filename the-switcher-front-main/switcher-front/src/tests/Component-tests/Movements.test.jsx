import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom'; // Extiende las aserciones como toBeInTheDocument
import { PartidaWSContext } from '../../contexts/PartidaWSContext'; // Importamos el contexto
import MovementList from '../../components/Cards/MovementList';
import { EnemyHandMovement } from '../../components/Cards/MovementList';

// TEST

const mockAmountMovs = {
  player1: { cantidad: 3 },
};

describe('Movements', () => {
  // Mock del contexto
  const mockMovementlist = [
    {
      movimiento: {
        img_url: 'url1',
        movement: 'DiagonalSmall',
        id: 1,
        nombre: 'Movimiento 1',
      },
    },
    {
      movimiento: {
        img_url: 'url2',
        movement: 'DiagonalBig',
        id: 2,
        nombre: 'Movimiento 2',
      },
    },
    {
      movimiento: {
        img_url: 'url3',
        movement: 'ExtremeAxis',
        id: 7,
        nombre: 'Movimiento 3',
      },
    },
  ];

  const mockUpdateHighlightCoords = vi.fn();
  const mockGanador = { id: 1, nombre: 'Jugador 1' };

  it('Deberia renderizar las tres cartas', () => {
    render(
      <PartidaWSContext.Provider
        value={{
          movimientos: mockMovementlist,
          updateHighlightCoords: mockUpdateHighlightCoords,
          ganador: mockGanador,
        }}
      >
        <MovementList />
      </PartidaWSContext.Provider>
    );

    const cardMov = screen.queryAllByTestId('card-movement-user');
    expect(cardMov).toHaveLength(mockMovementlist.length);

    const MovImages = screen.getAllByRole('img');
    expect(MovImages).toHaveLength(mockMovementlist.length);
  });

  it('Renderiza Cada Movimiento movimiento caracteristico', () => {
    render(
      <PartidaWSContext.Provider
        value={{
          movimientos: mockMovementlist,
          updateHighlightCoords: mockUpdateHighlightCoords,
          ganador: mockGanador,
        }}
      >
        <MovementList />
      </PartidaWSContext.Provider>
    );

    const MovImages = screen.getAllByRole('img');
    MovImages.forEach((movement, index) => {
      expect(movement).toHaveAttribute(
        'src',
        mockMovementlist[index].movimiento.img_url
      );
    });
  });

  it('Testing con mano vacia', () => {
    render(
      <PartidaWSContext.Provider
        value={{
          movimientos: [],
          updateHighlightCoords: mockUpdateHighlightCoords,
          ganador: mockGanador,
        }}
      >
        <MovementList />
      </PartidaWSContext.Provider>
    );
    const cardMov = screen.queryAllByTestId('card-movement-user');
    expect(cardMov).toHaveLength(0);
  });
});

describe('EnemyHandMovement', () => {
  it('renders the correct number of CardMovEnemy components', () => {
    const { container } = render(
      <PartidaWSContext.Provider value={{ amountMovs: mockAmountMovs }}>
        <EnemyHandMovement idPlayer="player1" />
      </PartidaWSContext.Provider>
    );

    const enemyCards = container.querySelectorAll('.card');
    expect(enemyCards).toHaveLength(mockAmountMovs.player1.cantidad);
  });

  it('renders nothing if amountMovs for player is not available', () => {
    render(
      <PartidaWSContext.Provider value={{ amountMovs: {} }}>
        <EnemyHandMovement idPlayer="player1" />
      </PartidaWSContext.Provider>
    );

    const enemyCards = screen.queryAllByTestId('card-movement-enemy');
    expect(enemyCards).toHaveLength(0);
  });
});
