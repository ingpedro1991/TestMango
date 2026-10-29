import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Exercise2 } from './Exercise2';
import { rangeService } from '../../services/range/rangeService';

// Mockeamos de forma limpia el módulo del servicio para aislar la red
jest.mock('../../services/range/rangeService');

describe('Página <Exercise2 /> - Pruebas de Integración y Errores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('CAMINO CORRECTO: debe mostrar la carga y pintar dinámicamente las etiquetas fijas en base a la API', async () => {
    const apiDynamicValues = [3.50, 15.00, 45.90, 89.95];
    
    rangeService.getFixedRange.mockResolvedValue({ values: apiDynamicValues });

    render(<Exercise2 />);

    // Verificación estado de carga: Correcto
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Verificación de renderizado de título y restricciones de diseño (sin inputs en modo fijo)
    await waitFor(() => {
      expect(screen.getByText('Ejercicio 2: Rango de Valores Fijos')).toBeInTheDocument();
    });

    // Si aparecieran inputs por error, esta aserción arrojaría un fallo inmediato
    expect(screen.queryByTestId('input-min')).toBeNull();
    expect(screen.queryByTestId('input-max')).toBeNull();

    // Verificación de formato correcto de moneda en los extremos
    const firstFormatted = `${apiDynamicValues[0].toFixed(2)}€`;
    const lastFormatted = `${apiDynamicValues[apiDynamicValues.length - 1].toFixed(2)}€`;

    expect(screen.getByText(firstFormatted)).toBeInTheDocument();
    expect(screen.getByText(lastFormatted)).toBeInTheDocument();
  });

  test('CAMINO DE ERROR: debe mostrar un mensaje de error si el servicio de valores fijos falla', async () => {
    // Forzamos el fallo del servicio
    rangeService.getFixedRange.mockRejectedValue(new Error('API Error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Exercise2 />);

    // Verificación de control de errores: Correcto (si renderiza el rango a pesar del fallo, la prueba falla)
    await waitFor(() => {
      expect(screen.getByText('Error al cargar los valores fijos.')).toBeInTheDocument();
    });

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('CASO LÍMITE: debe asegurar que en el modo fijo no se permita la edición manual por teclado o clics en inputs', async () => {
    const apiFixedValues = [5.00, 10.00, 25.00];
    rangeService.getFixedRange.mockResolvedValue({ values: apiFixedValues });

    render(<Exercise2 />);

    // Esperamos a que cargue el título del ejercicio
    await waitFor(() => {
      expect(screen.getByText('Ejercicio 2: Rango de Valores Fijos')).toBeInTheDocument();
    });

    // Verificamos de forma estricta que los inputs editables NO están presentes en el DOM (requisito del PDF)
    expect(screen.queryByTestId('input-min')).not.toBeInTheDocument();
    expect(screen.queryByTestId('input-max')).not.toBeInTheDocument();
  });

  test('CASO LÍMITE: debe formatear correctamente los decimales estrictos exigidos para los valores monetarios fijos', async () => {
    const apiFixedValues = [1.99, 50.99, 70.99];
    rangeService.getFixedRange.mockResolvedValue({ values: apiFixedValues });

    render(<Exercise2 />);

    // Verificamos que los textos de los extremos respeten el formato monetario con 2 decimales
    expect(await screen.findByText('1.99€')).toBeInTheDocument();
    expect(screen.getByText('70.99€')).toBeInTheDocument();
  });
});
