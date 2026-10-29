import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Range } from './Range';

// 1. Probamos el comportamiento visual y funcional aislado de las propiedades (Modo Continuo)
describe('Componente <Range /> - Ejercicio 1 (Rango Normal)', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar correctamente los inputs con los valores iniciales', () => {
    render(<Range min={1} max={100} onChange={mockOnChange} />);

    const inputMin = screen.getByTestId('input-min');
    const inputMax = screen.getByTestId('input-max');

    expect(inputMin.value).toBe('1');
    expect(inputMax.value).toBe('100');
  });

  test('debe actualizar los valores cuando el usuario edita y pierde el foco (blur) del input', () => {
    render(<Range min={1} max={100} onChange={mockOnChange} />);

    const inputMin = screen.getByTestId('input-min');

    // Cambiamos el valor del input mínimo a 25
    fireEvent.change(inputMin, { target: { value: '25' } });
    fireEvent.blur(inputMin);

    expect(inputMin.value).toBe('25');
    expect(mockOnChange).toHaveBeenCalledWith({ min: 25, max: 100 });
  });

  test('no debe permitir que el valor mínimo supere al máximo', () => {
    render(<Range min={1} max={100} onChange={mockOnChange} />);

    const inputMin = screen.getByTestId('input-min');

    // Intentamos poner el mínimo en 120 (sabiendo que el máximo es 100)
    fireEvent.change(inputMin, { target: { value: '120' } });
    fireEvent.blur(inputMin);

    // Al bloquear el cruce, el valor se acota al tope máximo sin superarlo jamás (queda en 100)
    expect(parseInt(inputMin.value)).toBeLessThanOrEqual(100); 
  });

  test('debe modificar los valores al simular el arrastre físico del slider (mouseMove)', () => {
    render(<Range min={0} max={100} onChange={mockOnChange} />);

    const bulletMin = screen.getByTestId('bullet-min');

    // Mockeamos el tamaño y posición del contenedor del track para simular el cálculo matemático.
    // Simulamos que mide 200px de ancho y empieza en la coordenada X = 0.
    const trackContainer = bulletMin.parentElement;
    jest.spyOn(trackContainer, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      width: 200,
      top: 0,
      bottom: 0,
      right: 200,
      height: 6,
      x: 0,
      y: 0,
      toJSON: () => {}
    });

    // 1. Iniciamos el arrastre (onMouseDown) sobre el control mínimo
    fireEvent.mouseDown(bulletMin);

    // 2. Movemos el ratón a la mitad de la barra (X = 100px, lo que equivale al 50% de 200px -> Valor 50)
    fireEvent.mouseMove(window, { clientX: 100 });

    // 3. Soltamos el control (onMouseUp)
    fireEvent.mouseUp(window);

    // Validamos que el input capture el movimiento y notifique con el nuevo mínimo
    const inputMin = screen.getByTestId('input-min');
    expect(inputMin.value).toBe('50');
    expect(mockOnChange).toHaveBeenCalledWith({ min: 50, max: 100 });
  });

  test('debe responder a los eventos de teclado para mejorar la accesibilidad', () => {
    render(<Range min={0} max={100} onChange={mockOnChange} />);
    const bulletMin = screen.getByTestId('bullet-min');

    // Simulamos pulsar la flecha derecha para incrementar el valor en 1 unidad
    fireEvent.keyDown(bulletMin, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(mockOnChange).toHaveBeenCalledWith({ min: 1, max: 100 });

    // Simulamos pulsar la flecha izquierda para decrementar el valor
    fireEvent.keyDown(bulletMin, { key: 'ArrowLeft', code: 'ArrowLeft' });
    expect(mockOnChange).toHaveBeenCalledWith({ min: 0, max: 100 });
  });
});

// 2. Probamos el comportamiento en Modo de Valores Fijos (Ejercicio 2)
describe('Componente <Range /> - Ejercicio 2 (Valores Fijos Autónomos)', () => {
  // Eliminado el acoplamiento: usamos un array cualquiera para verificar independencia total
  const arrayFijoPrueba = [10.50, 25.00, 50.25, 85.00, 110.99];
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar como texto/etiquetas fijas y no como inputs editables', () => {
    render(<Range fixedValues={arrayFijoPrueba} onChange={mockOnChange} />);

    // Requerimiento del PDF: Deben ser solo texto (labels), los inputs no deben existir
    expect(screen.queryByTestId('input-min')).toBeNull();
    expect(screen.queryByTestId('input-max')).toBeNull();

    // Comprobamos que existan los textos formateados correspondientes a los extremos de nuestro array
    expect(screen.getByText('10.50€')).toBeInTheDocument();
    expect(screen.getByText('110.99€')).toBeInTheDocument();
  });

  test('debe permitir saltar entre los valores fijos del array mediante teclado', () => {
    render(<Range fixedValues={arrayFijoPrueba} onChange={mockOnChange} />);
    const bulletMin = screen.getByTestId('bullet-min');

    // El valor inicial es index 0 (10.50). Al presionar ArrowRight avanza al index 1 (25.00)
    fireEvent.keyDown(bulletMin, { key: 'ArrowRight', code: 'ArrowRight' });
    expect(mockOnChange).toHaveBeenCalledWith({ min: 25.00, max: 110.99 });
  });
});
