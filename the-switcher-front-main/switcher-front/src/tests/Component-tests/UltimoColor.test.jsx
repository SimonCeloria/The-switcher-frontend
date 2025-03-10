import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import UltimoColor from '../../components/UltimoColor';
import { PartidaWSContext } from '../../contexts/PartidaWSContext';

describe('UltimoColor Component', () => {
  const renderWithContext = (colorBloqueado) => {
    return render(
      <PartidaWSContext.Provider value={{ colorBloqueado }}>
        <UltimoColor />
      </PartidaWSContext.Provider>
    );
  };

  it('renders correctly when color is "rojo"', () => {
    renderWithContext('rojo');
    expect(screen.getByText('Color bloqueado:')).toBeInTheDocument();
    expect(screen.getByAltText('Color bloqueado')).toHaveAttribute('src', '/A.svg');
  });

  it('renders correctly when color is "verde"', () => {
    renderWithContext('verde');
    expect(screen.getByText('Color bloqueado:')).toBeInTheDocument();
    expect(screen.getByAltText('Color bloqueado')).toHaveAttribute('src', '/C.svg');
  });

  it('renders correctly when color is "azul"', () => {
    renderWithContext('azul');
    expect(screen.getByText('Color bloqueado:')).toBeInTheDocument();
    expect(screen.getByAltText('Color bloqueado')).toHaveAttribute('src', '/D.svg');
  });

  it('renders correctly when color is "amarillo"', () => {
    renderWithContext('amarillo');
    expect(screen.getByText('Color bloqueado:')).toBeInTheDocument();
    expect(screen.getByAltText('Color bloqueado')).toHaveAttribute('src', '/B.svg');
  });

  it('renders correctly when no color is blocked', () => {
    renderWithContext('');
    expect(screen.getByText('No hay color bloqueado.')).toBeInTheDocument();
    expect(screen.getByText('Todos los colores se pueden jugar.')).toBeInTheDocument();
  });
});