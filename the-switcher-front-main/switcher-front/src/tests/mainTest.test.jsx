import { render } from '@testing-library/react';
import App from '../App';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Asegúrate de importar esto

describe('main.jsx test', () => {
  test('renders the App component', () => {
    // Renderizar el componente App
    render(<App />);

    // Verifica que el texto específico esté presente en el componente Home
    const homeText = screen.getByText(/Introduzca su nickname con el que será identificado en el juego por los otros jugadores./i);
    expect(homeText).toBeInTheDocument(); // Verifica que el texto esté presente
  });
});
