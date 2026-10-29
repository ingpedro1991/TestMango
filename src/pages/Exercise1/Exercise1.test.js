import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Exercise1 } from './Exercise1';
import { rangeService } from '../../services/range/rangeService';

// Mockeamos de forma limpia el módulo del servicio para aislar la red
jest.mock('../../services/range/rangeService');

describe('Página <Exercise1 /> - Pruebas de Integración y Errores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('CAMINO CORRECTO: debe mostrar el indicador de carga y renderizar el rango normal con los valores del servicio', async () => {
    rangeService.getNormalRange.mockResolvedValue({ min: 5, max: 80 });

    render(<Exercise1 />);

    // Verificación de estado inicial: Correcto (debe existir el spinner de carga)
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Verificación de resolución asíncrona: Correcto (debe renderizar los datos correctos)
    const titleElement = await screen.findByText('Ejercicio 1: Rango Normal Continuo');
    expect(titleElement).toBeInTheDocument();

    const inputMin = screen.getByTestId('input-min');
    const inputMax = screen.getByTestId('input-max');
    
    // Si los valores no coinciden, la prueba arroja un error indicando fallo de coincidencia
    expect(inputMin.value).toBe('5');
    expect(inputMax.value).toBe('80');
  });

  test('CAMINO DE ERROR: debe mostrar un mensaje de error y fallar controladamente si el servicio de red no responde', async () => {
    // Simulamos un fallo crítico del servidor o red
    rangeService.getNormalRange.mockRejectedValue(new Error('Network Error'));
    
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Exercise1 />);

    // Verificación de error: Correcto (si el componente muestra los datos en vez del error, la prueba falla)
    const errorMessage = await screen.findByText(/Error al cargar/i);
    expect(errorMessage).toBeInTheDocument();

    // Verificamos que el error fue capturado e impreso en consola por el catch
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('CAMINO CORRECTO: debe permitir interactuar con los inputs de texto y actualizar los valores', async () => {
    rangeService.getNormalRange.mockResolvedValue({ min: 1, max: 100 });

    render(<Exercise1 />);

    // Esperamos a que cargue el componente
    const inputMin = await screen.findByTestId('input-min');
    const inputMax = await screen.findByTestId('input-max');

    expect(inputMin.value).toBe('1');
    expect(inputMax.value).toBe('100');

    // Simulamos que el usuario escribe un nuevo valor mínimo válido
    fireEvent.change(inputMin, { target: { value: '20' } });
    fireEvent.blur(inputMin);

    expect(inputMin.value).toBe('20');
  });

  test('CASO LÍMITE: debe manejar correctamente cuando el servicio devuelve valores con un rango corto', async () => {
    rangeService.getNormalRange.mockResolvedValue({ min: 40, max: 60 });

    render(<Exercise1 />);

    const inputMin = await screen.findByTestId('input-min');
    const inputMax = await screen.findByTestId('input-max');

    expect(inputMin.value).toBe('40');
    expect(inputMax.value).toBe('60');
  });
});
