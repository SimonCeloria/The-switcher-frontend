import React, { useContext } from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PartidaWSContextProvider, PartidaWSContext } from '../contexts/PartidaWSContext';
import { PartidaContextProvider } from '../contexts/PartidaContext';
import { MemoryRouter } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import PartidaServices from '../services/Partida';
import MovServices from '../services/Movimiento';
import { waitFor } from '@testing-library/dom';

// Mocks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-use-websocket', () => ({
  default: vi.fn(() => ({
    sendMessage: vi.fn(),
    lastMessage: null,
    readyState: 1,
    onMessage: vi.fn(),
  })),
}));



vi.mock('../services/Partida', () => ({
  default: {
    listJugadoresPartida: vi.fn().mockResolvedValue([]),
    getPartida: vi.fn().mockResolvedValue({ uui_partida: 'mock-uuid' }),
    abandonarPartida: vi.fn().mockResolvedValue({}),
    iniciarPartida: vi.fn().mockResolvedValue({}),
    pasarTurno: vi.fn().mockResolvedValue({}),
  },
}));

vi.mock('../services/Movimiento', () => ({
  default: {
    rollback: vi.fn().mockResolvedValue({}),
  },
}));

const TestComponent = () => {
  const context = useContext(PartidaWSContext);
  return (
    <div data-testid="test-component">
      <button onClick={context.handleLeave} data-testid="leave-button">Leave</button>
      <button onClick={context.handleStart} data-testid="start-button">Start</button>
      <button onClick={context.handleSkip} data-testid="skip-button">Skip</button>
      <button onClick={context.handleRollback} data-testid="rollback-button">Rollback</button>
      <pre data-testid="context-data">{JSON.stringify(context, null, 2)}</pre>
    </div>
  );
};

describe('PartidaWSContextProvider', () => {
  const mockSendMessage = vi.fn();
  const mockReadyState = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    useWebSocket.mockReturnValue({
      sendMessage: mockSendMessage,
      lastMessage: null,
      readyState: mockReadyState,
    });
    global.sessionStorage = {
      getItem: vi.fn().mockReturnValue(null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
  });

  it('renders without crashing', async () => {
    await act(async () => {
      render(
        <MemoryRouter>
          <PartidaContextProvider>
            <PartidaWSContextProvider>
              <div>Test</div>
            </PartidaWSContextProvider>
          </PartidaContextProvider>
        </MemoryRouter>
      );
    });

    expect(PartidaServices.listJugadoresPartida).toHaveBeenCalled();
    expect(PartidaServices.getPartida).toHaveBeenCalled();
  });

  it('initializes state correctly', () => {
    let contextValues;
    render(
      <MemoryRouter>
        <PartidaContextProvider>
          <PartidaWSContextProvider>
            <PartidaWSContext.Consumer>
              {(value) => {
                contextValues = value;
                return null;
              }}
            </PartidaWSContext.Consumer>
          </PartidaWSContextProvider>
        </PartidaContextProvider>
      </MemoryRouter>
    );

    expect(contextValues.idJugador).toBeDefined();
    expect(contextValues.jugadores).toEqual([]);
    expect(contextValues.ganador).toEqual({});
    expect(contextValues.isMyTurn).toBe(false);
  });


  it('handles game actions correctly', async () => {
    let renderedComponent;
    await act(async () => {
      renderedComponent = render(
        <MemoryRouter>
          <PartidaContextProvider>
            <PartidaWSContextProvider>
              <TestComponent />
            </PartidaWSContextProvider>
          </PartidaContextProvider>
        </MemoryRouter>
      );
    });

    //test handleLeave
    await act(async () => {
      fireEvent.click(renderedComponent.getByTestId('leave-button'));
    });
    expect(PartidaServices.abandonarPartida).toHaveBeenCalled();

    //test handleStart
    await act(async () => {
      fireEvent.click(renderedComponent.getByTestId('start-button'));
    });
    expect(PartidaServices.iniciarPartida).toHaveBeenCalled();

    //test handleSkip
    await act(async () => {
      fireEvent.click(renderedComponent.getByTestId('skip-button'));
    });
    expect(PartidaServices.pasarTurno).toHaveBeenCalled();

    //test handleRollback
    await act(async () => {
      fireEvent.click(renderedComponent.getByTestId('rollback-button'));
    });
    expect(MovServices.rollback).toHaveBeenCalled();
  });

  it('handles incoming messages correctly', async () => {
    const mockSetJugadores = vi.fn();
    const mockSetGanador = vi.fn();
    const mockSetFichas = vi.fn();
    const mockSetTurnos = vi.fn();
    const mockSetCurrentTurn = vi.fn();
    const mockSetTurnoNuevo = vi.fn();
    const mockSetIsMyTurn = vi.fn();
    const mockSetFiguras = vi.fn();
    const mockSetMovimientos = vi.fn();
    const mockSetAmountMovs = vi.fn();
    const mockSetHighlightFigsCoords = vi.fn();
    const mockSetHighlightMovsCoords = vi.fn();
    const mockSetMensajes = vi.fn();
    const mockNavigate = vi.fn();

    let onMessage;
    useWebSocket.mockImplementation((url, options) => {
      onMessage = options.onMessage;
      return {
        sendMessage: vi.fn(),
        lastMessage: null,
        readyState: 1,
      };
    });

    const TestComponent = () => {
      const context = React.useContext(PartidaWSContext);
      return <div data-testid="test-component">{JSON.stringify(context)}</div>;
    };

    await act(async () => {
      render(
        <MemoryRouter>
          <PartidaContextProvider>
            <PartidaWSContextProvider>
              <TestComponent />
            </PartidaWSContextProvider>
          </PartidaContextProvider>
        </MemoryRouter>
      );
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'jugadores_partida', data: [{ id: 'player1', name: 'Player One' }] }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'ganador', data: { id: 'player1', name: 'Winner' } }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'fichas', data: [{ id: 'ficha1', type: 'pawn' }] }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'cancelar_partida', data: { owner: 'player2' } }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'turnos', data: [{ jugador_id: 'player1', turno: 1 }] }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'turno_actual', data: 1 }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'cartas_figura', data: { 'id jugador': 'player1', 'en mano': 3, 'en mazo': 2 } }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'cartas_movimiento', data: [{ id: 'move1', type: 'forward' }] }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'cantidad_movimientos', data: { 'id jugador': 'player1', cantidad: 5 } }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'figuras_tablero', data: [{ fichas: [{ x: 1, y: 1 }] }] }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'ultimo_movimiento_parcial', data: { fichas: [{ xCord: 1, yCord: 1 }] } }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'ultima_figura', data: { carta: { jugador_id: 'player1', figura: { img_url: 'test_url' } } } }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'abandono_partida', data: { id_jugador: 'player1' } }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'carta_usada', data: { id_jugador: 'player1', carta_url: 'url_test' } }) });
    });

    act(() => {
      onMessage({ data: JSON.stringify({ type: 'mensaje_chat', data: { mensaje: 'Hola soy un mensajito' } }) });
    });

    const component = document.querySelector('[data-testid="test-component"]');
    const contextData = JSON.parse(component.textContent);

    expect(contextData.jugadores).toEqual([{ id: 'player1', name: 'Player One' }]);
    expect(contextData.ganador).toEqual({ id: 'player1', name: 'Winner' });
    expect(contextData.fichas).toEqual([{ id: 'ficha1', type: 'pawn' }]);
    expect(contextData.turnos).toEqual([{ jugador_id: 'player1', turno: 1 }]);
    expect(contextData.currentTurn).toBe(1);
    expect(contextData.turnoNuevo).toBe(true);
    expect(contextData.figuras).toEqual({ player1: { enMano: 3, enMazo: 2 } });
    expect(contextData.movimientos).toEqual([{ id: 'move1', type: 'forward' }]);
    expect(contextData.amountMovs).toEqual({ player1: { cantidad: 5 } });
    expect(contextData.highlightFigsCoords).toEqual([[{ x: 1, y: 1 }]]);
    expect(contextData.highlightFigs).toEqual([{ fichas: [{ x: 1, y: 1 }] }]);
    expect(contextData.highlightMovsCoords).toEqual([{ xCord: 1, yCord: 1 }]);
  });

});
