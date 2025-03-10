import { render, screen } from '@testing-library/react';
import NotFound from '../pages/NotFound';

import '@testing-library/jest-dom';

describe('NotFound Component', () => {
  test('renders the NotFound component', () => {
    render(<NotFound />);

    //Se verifica que el texto "URL NOT FOUND" esté presente en el componente
    const notFoundText = screen.getByText(/URL NOT FOUND/i);
    expect(notFoundText).toBeInTheDocument();

    //Se verifica que el texto "404" esté presente en el componente
    const four04Texts = screen.getAllByText('4');
    expect(four04Texts.length).toBe(2); //Se verifica que hay exactamente dos '4' por el error 404

    const zeroText = screen.getByText('0');
    expect(zeroText).toBeInTheDocument();
  });
});
