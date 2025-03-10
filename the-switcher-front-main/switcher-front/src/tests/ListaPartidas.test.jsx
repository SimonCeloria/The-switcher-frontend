import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListaPartidasComp from '../pages/ListaPartidas';
import { MemoryRouter } from 'react-router-dom';
import { ListaPartidaContext } from '../contexts/ListaPartidaContext';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../components/GameList', () => ({
  default: () => <div>Mocked Games List Component</div>,
}));

vi.mock('../components/CancelledGame', async () => {
  const actual = await vi.importActual('../components/CancelledGame');
  return {
    ...actual,
  };
});

vi.mock('../components/Button/ToggleAnimationButton', () => ({
  default: ({ toggle }) => <button onClick={toggle}>Toggle Animation</button>,
}));

vi.mock('../components/Header', () => ({
  HeaderGame: () => <div>Mocked HeaderGame Component</div>,
}));

vi.mock('../containers/CreateGameContainer', () => ({
  default: () => <div>Create Game Form</div>,
}));

const setShowActiveOnlyMock = vi.fn(); // Mock para setShowActiveOnly


const mockContextValue = {
  gameList: [
    { id: 1, name: 'Test Game 1' },
    { id: 2, name: 'Test Game 2' },
  ],
  PlayerCount: [1, 2],
  setGameList: vi.fn(),
  setShowForm: vi.fn(),
  showForm: false,
  setShowActiveOnly: setShowActiveOnlyMock,
};

// Crear una función que haga el render con el contexto mockeado
const renderWithContext = (props = {}) => {
  return render(
    <ListaPartidaContext.Provider value={mockContextValue}>
      <ListaPartidasComp {...props} />
    </ListaPartidaContext.Provider>
  );
};

describe('ListaPartidasComp', () => {
  it('should render the component and display the game list', () => {
    renderWithContext({
      filter: '',
      setFilter: vi.fn(),
      playerCount: [],
      setPlayerCount: vi.fn(),
      cancelled: false,
      LocalAnimated: true,
      setLocalAnimated: vi.fn(),
    });

    // Verificar que los subcomponentes se rendericen
    expect(screen.getByText('Mocked Games List Component')).toBeInTheDocument();
    expect(screen.getByText('Mocked HeaderGame Component')).toBeInTheDocument();

    // Verificar que el botón de crear partida está presente
    const createButton = screen.getByText('CREAR');
    expect(createButton).toBeInTheDocument();
  });

  it('should open create game form when "CREAR" button is clicked', () => {
    renderWithContext({
      filter: '',
      setFilter: vi.fn(),
      playerCount: [],
      setPlayerCount: vi.fn(),
      cancelled: false,
      LocalAnimated: true,
      setLocalAnimated: vi.fn(),
    });

    // Simular clic en el botón "CREAR"
    const createButton = screen.getByText('CREAR');
    fireEvent.click(createButton);

    // Verificar que se haya llamado el método setShowForm del contexto
    expect(mockContextValue.setShowForm).toHaveBeenCalledWith(true);
  });
  it('should display the create game modal when showForm is true', () => {
    // Simular que showForm es true
    render(
      <ListaPartidaContext.Provider
        value={{ ...mockContextValue, showForm: true }}
      >
        <ListaPartidasComp
          filter=""
          setFilter={vi.fn()}
          playerCount={[]}
          setPlayerCount={vi.fn()}
          cancelled={false}
          LocalAnimated={true}
          setLocalAnimated={vi.fn()}
        />
      </ListaPartidaContext.Provider>
    );

    expect(screen.getByText('Create Game Form')).toBeInTheDocument();
  });

  it('should filter games by name when typing in the filter input', () => {
    const setFilterMock = vi.fn();
    renderWithContext({
      filter: '',
      setFilter: setFilterMock,
      playerCount: [],
      setPlayerCount: vi.fn(),
      cancelled: false,
      LocalAnimated: true,
      setLocalAnimated: vi.fn(),
    });

    const filterInput = screen.getByPlaceholderText(
      'Buscar partida por su nombre'
    );

    fireEvent.change(filterInput, { target: { value: 'Test Game' } });

    expect(setFilterMock).toHaveBeenCalledWith('Test Game');
  });

  it('should toggle animation when "Toggle Animation" button is clicked', () => {
    const setLocalAnimatedMock = vi.fn();
    renderWithContext({
      filter: '',
      setFilter: vi.fn(),
      playerCount: [],
      setPlayerCount: vi.fn(),
      cancelled: false,
      LocalAnimated: true,
      setLocalAnimated: setLocalAnimatedMock,
    });

    const toggleButton = screen.getByText('Toggle Animation');
    fireEvent.click(toggleButton);

    expect(setLocalAnimatedMock).toHaveBeenCalled();
  });

  it('should display CancelledGame component when game is cancelled', () => {
    renderWithContext({
      filter: '',
      setFilter: vi.fn(),
      playerCount: [],
      setPlayerCount: vi.fn(),
      cancelled: true, // Partida cancelada
      LocalAnimated: true,
      setLocalAnimated: vi.fn(),
    });

    // Verificar que el componente CancelledGame se renderice
    expect(screen.getByText('Partida cancelada.')).toBeInTheDocument();
  });

  it('should handle player count filter buttons correctly', () => {
    const setPlayerCountMock = vi.fn();
    const playerCount = [1, 2]; // Simular que los filtros de 1 y 2 jugadores están activos

    renderWithContext({
      filter: '',
      setFilter: vi.fn(),
      playerCount,
      setPlayerCount: setPlayerCountMock,
      cancelled: false,
      LocalAnimated: true,
      setLocalAnimated: vi.fn(),
    });

    const playerCountButton = screen.getByText('3 Jugadores');

    // Simular clic en el botón para seleccionar el filtro de 3 jugadores
    fireEvent.click(playerCountButton);

    // Verificar que la función setPlayerCount sea llamada correctamente
    expect(setPlayerCountMock).toHaveBeenCalledWith([...playerCount, 3]);
  });

  it('should toggle showActiveOnly when "Activas" button is clicked', () => {
    renderWithContext({
      filter: '',
      setFilter: vi.fn(),
      playerCount: [],
      setPlayerCount: vi.fn(),
      cancelled: false,
      LocalAnimated: true,
      setLocalAnimated: vi.fn(),
    });
  
    const activeButton = screen.getByText('Activas');
  
    fireEvent.click(activeButton);
    expect(screen.getByText('Activas').classList).toContain('bg-[var(--Marron1)]');
  
    fireEvent.click(activeButton);
    expect(screen.getByText('Activas').classList).not.toContain('bg-[var(--Marron1)]');
  });
  
});
