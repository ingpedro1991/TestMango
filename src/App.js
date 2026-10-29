import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Exercise1 } from './pages/Exercise1/Exercise1';
import { Exercise2 } from './pages/Exercise2/Exercise2';
import { Typography } from '@mui/material';

// Importación de todos los estilos modulares que extrajimos
import {
  MainAppLayout,
  ColumnsContainer,
  LeftMenuColumn,
  RightContentColumn,
  MenuCard,
  ExerciseCard,
  NavButton
} from './App.styles';

export const App = () => {
  const location = useLocation();

  return (
    <MainAppLayout>
      <ColumnsContainer>
        
        {/* ================= SECCIÓN IZQUIERDA: MENÚ DE SELECCIÓN ================= */}
        <LeftMenuColumn>
          <MenuCard elevation={6}>
            <Typography variant="h6" fontWeight="bold" color="text.primary" style={{ marginBottom: '10px' }}>
              Ejercicios Rango
            </Typography>
            
            {/* Botón para Ejercicio 1 */}
            <NavButton
              component={Link}
              to="/exercise1"
              size="large"
              active={location.pathname === '/exercise1'}
            >
              Ejercicio 1
            </NavButton>
            
            {/* Botón para Ejercicio 2 */}
            <NavButton
              component={Link}
              to="/exercise2"
              size="large"
              active={location.pathname === '/exercise2'}
            >
              Ejercicio 2
            </NavButton>
          </MenuCard>
        </LeftMenuColumn>

        {/* ================= SECCIÓN DERECHA: PANTALLA DINÁMICA ================= */}
        <RightContentColumn>
          <ExerciseCard elevation={6}>
            <Routes>
              <Route path="/" element={<Navigate to="/exercise1" replace />} />
              <Route path="/exercise1" element={<Exercise1 />} />
              <Route path="/exercise2" element={<Exercise2 />} />
              <Route path="*" element={<Navigate to="/exercise1" replace />} />
            </Routes>
          </ExerciseCard>
        </RightContentColumn>

      </ColumnsContainer>
    </MainAppLayout>
  );
};
