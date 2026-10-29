import { apiClient } from '../apiClient';

export const rangeService = {
  /**
   * Obtiene los límites mínimo y máximo para el rango continuo (Ejercicio 1)
   */
  getNormalRange: async () => {
    const response = await apiClient.get('/range-normal');
    return response.data; // Retorna { min: 1, max: 100 }
  },

  /**
   * Obtiene el array de valores fijos permitidos (Ejercicio 2)
   */
  getFixedRange: async () => {
    const response = await apiClient.get('/range-fixed');
    return response.data; // Retorna { values: [1.99, 5.99, ...] }
  }
};
