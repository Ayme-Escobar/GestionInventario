import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Categoria from '../components/Categoria'; // Importa el componente a probar
import axios from 'axios'; // Importa Axios para hacer mock de las llamadas a la API

jest.mock('axios'); // Mockeamos Axios para evitar llamadas reales a la API

test('inserta una nueva categoría', async () => {
    axios.get.mockResolvedValue({ data: [] });
    axios.post.mockResolvedValue({
      data: { idCategoria: 1, nombre: 'Categoría de Prueba', descripcion: 'Descripción de prueba' },
    });
  
    render(<Categoria />);
  
    fireEvent.click(screen.getByText('+ Añadir Categoría'));
  
    fireEvent.change(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'Categoría de Prueba' },
    });
    fireEvent.change(screen.getByPlaceholderText('Descripción'), {
      target: { value: 'Descripción de prueba' },
    });
  
    fireEvent.click(screen.getByText('Guardar'));
  
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/categorias', {
      nombre: 'Categoría de Prueba',
      descripcion: 'Descripción de prueba',
    });
  
    const alertMessage = await screen.findByText('Categoría creada con éxito');
    expect(alertMessage).toBeInTheDocument();
  });

  
  test('carga y muestra las categorías existentes', async () => {
    const mockData = [
      { idCategoria: 1, nombre: 'Categoría 1', descripcion: 'Descripción 1', activo: true },
      { idCategoria: 2, nombre: 'Categoría 2', descripcion: 'Descripción 2', activo: false },
    ];
  
    axios.get.mockResolvedValue({ data: mockData });
  
    render(<Categoria />);
  
    const category1 = await screen.findByText('Categoría 1');
    const category2 = await screen.findByText('Categoría 2');
  
    expect(category1).toBeInTheDocument();
    expect(category2).toBeInTheDocument();
  });

  
  test('actualiza una categoría existente', async () => {
    axios.get.mockResolvedValue({
      data: [{ idCategoria: 1, nombre: 'Categoría Vieja', descripcion: 'Descripción Vieja', activo: true }],
    });
  
    axios.put.mockResolvedValue({
      data: { idCategoria: 1, nombre: 'Categoría Actualizada', descripcion: 'Descripción Actualizada' },
    });
  
    render(<Categoria />);
  
    // Encontrar y hacer clic en el botón "Editar"
    const editButton = await screen.findByLabelText('Editar Categoría'); // Alternativa accesible
    fireEvent.click(editButton);
  
    // Cambiar los valores del formulario
    fireEvent.change(screen.getByPlaceholderText('Nombre'), {
      target: { value: 'Categoría Actualizada' },
    });
    fireEvent.change(screen.getByPlaceholderText('Descripción'), {
      target: { value: 'Descripción Actualizada' },
    });
  
    // Hacer clic en "Guardar"
    fireEvent.click(screen.getByText('Guardar'));
  
    // Verificar que se haya enviado la solicitud PUT con los datos actualizados
    expect(axios.put).toHaveBeenCalledWith(
      'http://localhost:3000/categorias/1',
      { nombre: 'Categoría Actualizada', descripcion: 'Descripción Actualizada' }
    );
  
    const alertMessage = await screen.findByText('Categoría actualizada con éxito');
    expect(alertMessage).toBeInTheDocument();
  });
  

  
  test('desactiva una categoría existente', async () => {
    axios.get.mockResolvedValue({
      data: [{ idCategoria: 1, nombre: 'Categoría 1', descripcion: 'Descripción 1', activo: true }],
    });
  
    axios.put.mockResolvedValue({});
  
    render(<Categoria />);
  
    // Seleccionar y hacer clic en el botón "Desactivar"
    const deleteButton = await screen.findByLabelText('Desactivar Categoría');
    fireEvent.click(deleteButton);
  
    // Simular clic en la confirmación del modal
    const confirmButton = await screen.findByText('Aceptar');
    fireEvent.click(confirmButton);
  
    // Verificar que se hizo la llamada PUT con los datos correctos
    expect(axios.put).toHaveBeenCalledWith(
      'http://localhost:3000/categorias/1',
      { activo: false }
    );
  
    // Verificar que se muestra el mensaje de éxito
    const alertMessage = await screen.findByText('Categoría desactivada con éxito');
    expect(alertMessage).toBeInTheDocument();
  });
  
  