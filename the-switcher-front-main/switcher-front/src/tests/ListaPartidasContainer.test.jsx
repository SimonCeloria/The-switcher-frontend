import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ListaPartidasContainer from '../containers/ListaPartidasContainer';
import { ListaPartidaContext } from '../contexts/ListaPartidaContext';
import PartidaServices from '../services/Partida';
import useWebSocket from 'react-use-websocket';
import { MemoryRouter, useLocation } from 'react-router-dom';
import '@testing-library/jest-dom';

vi.mock('react-use-websocket');
vi.mock('../services/Partida');
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: vi.fn(),
}));

describe('ListaPartidasContainer', () => {
  const mockSetGameList = vi.fn();
  const mockContextPartida = {
    IdJugador: '123',
    setGameList: mockSetGameList,
    gameList: [],
    filter: '',
    setFilter: vi.fn(),
    playerCount: [],
    setPlayerCount: vi.fn(),
    cancelled: false,
    LocalAnimated: true,
    setLocalAnimated: vi.fn(),
  };
  const mockWebSocket = {
    sendJsonMessage: vi.fn(),
    lastJsonMessage: null,
    readyState: 1,
  };

  beforeEach(() => {
    vi.spyOn(PartidaServices, 'listPartidas').mockResolvedValue([
      { id: 1, nombre: 'Partida 1' },
      { id: 2, nombre: 'Partida 2' },
    ]);

    useWebSocket.mockReturnValue(mockWebSocket);
    useLocation.mockReturnValue({ state: null });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
  it('calls fetchGames on mount', async () => {
    const listPartidasSpy = vi
      .spyOn(PartidaServices, 'listPartidas')
      .mockResolvedValue([]);

    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockContextPartida}>
          <ListaPartidasContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    expect(listPartidasSpy).toHaveBeenCalled();

    listPartidasSpy.mockRestore();
  });
  it('connects to WebSocket and handles incoming messages', async () => {
    const mockMessage = {
      type: 'update game list',
      data: [
        { id: 1, nombre: 'Partida 1' },
        { id: 2, nombre: 'Partida 2' },
      ],
    };

    // Create a new WebSocket instance and simulate the connection and message reception
    const mockWebSocketInstance = {
      onmessage: null,
      readyState: 1,
      triggerMessage: function () {
        if (this.onmessage) {
          this.onmessage({ data: JSON.stringify(mockMessage) });
        }
      },
    };

    useWebSocket.mockReturnValue(mockWebSocketInstance);

    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockContextPartida}>
          <ListaPartidasContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    mockWebSocketInstance.triggerMessage();

    await waitFor(() => {
      expect(mockSetGameList).toHaveBeenCalledWith(mockMessage.data);
    });
  });

  it('updates cancelled state from location', async () => {
    useLocation.mockReturnValue({ state: { cancel: true } });

    render(
      <ListaPartidaContext.Provider value={mockContextPartida}>
        <MemoryRouter>
          <ListaPartidasContainer />
        </MemoryRouter>
      </ListaPartidaContext.Provider>
    );

    await waitFor(() =>
      expect(screen.queryByText('Partida cancelada.')).toBeInTheDocument()
    );
  });

  it('sets game list after fetching games', async () => {
    const gameList = [{ id: 1, nombre: 'Partida 1' }, { id: 2, nombre: 'Partida 2' }];
    vi.spyOn(PartidaServices, 'listPartidas').mockResolvedValue(gameList);
  
    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockContextPartida}>
          <ListaPartidasContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(mockSetGameList).toHaveBeenCalledWith(gameList);
    });
  });
  
  it('handles errors when fetching games', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const error = new Error('Error al obtener partidas');
    vi.spyOn(PartidaServices, 'listPartidas').mockRejectedValue(error);
  
    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockContextPartida}>
          <ListaPartidasContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error al obtener partidas:', error);
    });
  
    consoleSpy.mockRestore();
  });

  it('handles WebSocket connection and logs appropriately', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    useWebSocket.mockImplementation((url, options) => {
      options.onOpen();
      options.onClose();
      return mockWebSocket;
    });

    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockContextPartida}>
          <ListaPartidasContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith('WebSocketPartida Connected');
    expect(consoleSpy).toHaveBeenCalledWith('WebSocketPartida Disconnected');

    consoleSpy.mockRestore();
  });

  it('handles WebSocket errors', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    const mockError = new Error('WebSocket error');

    useWebSocket.mockImplementation((url, options) => {
      options.onError(mockError);
      return mockWebSocket;
    });

    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockContextPartida}>
          <ListaPartidasContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);

    consoleErrorSpy.mockRestore();
  });

  it('handles WebSocket messages with valid JSON but incorrect type', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const mockMessage = JSON.stringify({ type: 'incorrect type', data: [] });
    
    useWebSocket.mockImplementation((url, options) => {
      options.onMessage({ data: mockMessage });
      return mockWebSocket;
    });

    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockContextPartida}>
          <ListaPartidasContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith(`Got a new message: ${JSON.parse(mockMessage)}`);
    expect(mockSetGameList).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('handles WebSocket messages with null data', () => {
    const consoleSpy = vi.spyOn(console, 'log');
    const mockMessage = JSON.stringify(null);
    
    useWebSocket.mockImplementation((url, options) => {
      options.onMessage({ data: mockMessage });
      return mockWebSocket;
    });

    render(
      <MemoryRouter>
        <ListaPartidaContext.Provider value={mockContextPartida}>
          <ListaPartidasContainer />
        </ListaPartidaContext.Provider>
      </MemoryRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith(`Got a new message: null`);
    expect(mockSetGameList).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
