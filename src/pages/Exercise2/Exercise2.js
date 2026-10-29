import React, { useEffect, useState, useCallback } from 'react';
import { Range } from '../../components/Range/Range';
import { Box, Typography, CircularProgress } from '@mui/material';
import { rangeService } from '../../services/range/rangeService';

export const Exercise2 = () => {
  const [fixedValues, setFixedValues] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    rangeService.getFixedRange()
      .then(data => setFixedValues(data.values))
      .catch(err => {
        console.error("Error al pedir datos fijos:", err);
        setError(true);
      });
  }, []);

  const handleRangeChange = useCallback((values) => {
    console.log("E2 Actualizado:", values);
  }, []);

  if (error) return <Box textAlign="center"><Typography color="error">Error al cargar los valores fijos.</Typography></Box>;
  if (!fixedValues) return <Box textAlign="center" padding="20px"><CircularProgress color="primary" /></Box>;

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center" style={{ marginBottom: '25px' }}>
        Ejercicio 2: Rango de Valores Fijos
      </Typography>
      <Range fixedValues={fixedValues} onChange={handleRangeChange} />
    </Box>
  );
};
