import React, { useEffect, useState } from 'react';
import { Range } from '../../components/Range/Range';
import { Box, Typography, CircularProgress } from '@mui/material';
import { rangeService } from '../../services/range/rangeService';

export const Exercise1 = () => {
  const [limits, setLimits] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    rangeService.getNormalRange()
      .then(data => setLimits(data))
      .catch(err => {
        console.error("Error al pedir datos normales:", err);
        setError(true);
      });
  }, []);

  if (error) return <Box textAlign="center"><Typography color="error">Error al cargar los límites.</Typography></Box>;
  if (!limits) return <Box textAlign="center"><CircularProgress style={{ color: '#000' }} /></Box>;

  return (
    <Box sx={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" textAlign="center" style={{ marginBottom: '25px' }}>
        Ejercicio 1: Rango Normal Continuo
      </Typography>
      <Range min={limits.min} max={limits.max} onChange={(v) => console.log("E1 Actualizado:", v)} />
    </Box>
  );
};
