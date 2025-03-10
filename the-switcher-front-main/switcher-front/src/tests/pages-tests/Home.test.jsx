// src/tests/Home.test.jsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../../pages/Home';
import '@testing-library/jest-dom';

// Mock de componentes secundarios
vi.mock('../../components/Header', () => ({
  HeaderGame: () => <header>Header Game</header>,
}));

vi.mock('../../containers/LoginContainer', () => ({
  default: () => <div>Login Component</div>,
}));

describe('Home Component', () => {
  test('renders Home component correctly', () => {
    render(<Home />);

    // Verificar que el Header se muestra
    expect(screen.getByText('Header Game')).toBeInTheDocument();

    // Verificar que el Login se muestra
    expect(screen.getByText('Login Component')).toBeInTheDocument();

    // Verificar que el mensaje de instrucción se muestra
    expect(screen.getByText(/Introduzca su nickname con el que será identificado en el juego por los otros jugadores/i)).toBeInTheDocument();
  });
});
