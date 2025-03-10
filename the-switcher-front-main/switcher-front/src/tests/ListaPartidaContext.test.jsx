import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ListaPartidaContextProvider, ListaPartidaContext } from '../contexts/ListaPartidaContext';
import PartidaServices from '../services/Partida';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

vi.mock('../services/Partida', () => ({
  __esModule: true,
  default: {
    unirJugadorPartida: vi.fn(),
    getPartida: vi.fn(),
  },
}));

const MockCreateGameForm = () => (
  <div>Form</div>
);

describe('ListaPartidaContextProvider', () => {
  beforeAll(() => {
    sessionStorage.setItem('idPlayer', 'mockPlayerId');
  });

  afterAll(() => {
    sessionStorage.clear();
  });

  test('renders children and manages context state', async () => {
    render(
      <MemoryRouter>
        <ListaPartidaContextProvider>
          <ListaPartidaContext.Consumer>
            {value => (
              <div>
                <button onClick={() => value.setShowForm(true)}>Show Form</button>
                <button onClick={() => value.handleJoin({ preventDefault: () => {} }, 'gameId', null)}>
                  Join Game
                </button>
                {value.showForm && <MockCreateGameForm />}
              </div>
            )}
          </ListaPartidaContext.Consumer>
        </ListaPartidaContextProvider>
      </MemoryRouter>
    );

    expect(screen.queryByText('Form')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Show Form'));
    expect(screen.getByText('Form')).toBeInTheDocument();

    // Simualacion de union a partida
    PartidaServices.unirJugadorPartida.mockResolvedValueOnce({ data: { partida_id: 'partidaId' } });
    PartidaServices.getPartida.mockResolvedValueOnce({ uui_partida: 'uuiPartida' });

    // Ejecutar la función handleJoin
    await fireEvent.click(screen.getByText('Join Game'));

    await waitFor(() => {
      expect(PartidaServices.unirJugadorPartida).toHaveBeenCalledWith('mockPlayerId', 'gameId', null);
      expect(PartidaServices.getPartida).toHaveBeenCalledWith('gameId');
    });
  });
});
