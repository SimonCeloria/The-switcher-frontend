import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Win } from '../../components/WinGame';
import { PartidaWSContext } from '../../contexts/PartidaWSContext';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de Popout y LeaveGameButton
vi.mock('../../components/PopOut', () => ({
  __esModule: true,
  default: ({ isOpen, onClose, children }) => (
    isOpen ? <div data-testid="popout">{children}<button onClick={onClose}>Close</button></div> : null
  ),
}));

vi.mock('../../components/Button/LeaveGameButton', () => ({
  LeaveGameButton: () => <button>Leave Game</button>,
}));

describe('Win Component', () => {
  const partidaContextValue = {
    ganador: {
      nombre: 'Player1',
    },
  };

  test('renders without crashing', () => {
    render(
      <PartidaWSContext.Provider value={partidaContextValue}>
        <Win />
      </PartidaWSContext.Provider>
    );

    // Verifica que el componente se renderiza correctamente
    expect(screen.getByText(/GANADOR./i)).toBeInTheDocument();
  });

  test('shows popout when there is a winner', () => {
    render(
      <PartidaWSContext.Provider value={partidaContextValue}>
        <Win />
      </PartidaWSContext.Provider>
    );

    // Verifica que el popout se muestra cuando hay un ganador
    expect(screen.getByTestId('popout')).toBeInTheDocument();

    // Verifica que se muestra el mensaje de ganador específico
    expect(screen.getByText((content, element) => 
      element.tagName.toLowerCase() === 'p' && content.includes('Player1')
    )).toBeInTheDocument();
  });

  test('closes popout when close button is clicked', () => {
    render(
      <PartidaWSContext.Provider value={partidaContextValue}>
        <Win />
      </PartidaWSContext.Provider>
    );

    // Verifica que el popout se muestra cuando hay un ganador
    expect(screen.getByTestId('popout')).toBeInTheDocument();

    // Simula un clic en el botón de cerrar
    fireEvent.click(screen.getByText('Close'));

    // Verifica que el popout se cierra
    expect(screen.queryByTestId('popout')).not.toBeInTheDocument();
  });
});
