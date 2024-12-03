import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Producto from '../components/Producto';
import axios from 'axios';
import { act } from 'react-dom/test-utils';

// Mockear axios para evitar llamadas reales al backend
jest.mock('axios');
const categoriasActivasMock = [
    { idCategoria: '1', nombre: 'Categoría 1' },
    { idCategoria: '2', nombre: 'Categoría 2' },
];


jest.mock('jspdf', () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    autoTable: jest.fn(),
    save: jest.fn(),
  })),
}));

describe('Componente Producto', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({});
    axios.put.mockResolvedValue({});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza correctamente el componente', async () => {
    await act(async () => {
      render(<Producto />);
    });

    expect(screen.getByText('Lista de Productos')).toBeInTheDocument();
    expect(screen.getByText('+ Añadir Producto')).toBeInTheDocument();
    expect(screen.getByText('Descargar Reporte en PDF')).toBeInTheDocument();
  });
 
});
