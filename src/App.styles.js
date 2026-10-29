import { styled, Box, Paper, Button } from '@mui/material';

// Contenedor de pantalla completa adaptado al tema global
export const MainAppLayout = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  boxSizing: 'border-box'
}));

// Contenedor principal de los bloques (adaptativo mediante breakpoints de MUI)
export const ColumnsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '1100px',
  gap: '24px',
  boxSizing: 'border-box',
  flexDirection: 'column',
  alignItems: 'stretch',

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
  }
}));

// Columna Izquierda: Botonera de control / Menú lateral
export const LeftMenuColumn = styled(Box)(({ theme }) => ({
  width: '100%',
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    maxWidth: '280px',
    flex: '1 1 250px'
  }
}));

// Columna Derecha: Contenedor para el ejercicio activo
export const RightContentColumn = styled(Box)({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  flex: '2 1 0%'
});

// Tarjeta para la botonera de navegación lateral
export const MenuCard = styled(Paper)(({ theme }) => ({
  padding: '32px 24px',
  textAlign: 'center',
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'none',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxSizing: 'border-box',
  gap: '16px',
  width: '100%',
  minHeight: '250px',
  overflow: 'hidden'
}));

// Tarjeta para la visualización centralizada del componente Range (Con dimensiones fijas)
export const ExerciseCard = styled(Paper)(({ theme }) => ({
  padding: '32px 24px',
  backgroundColor: theme.palette.background.paper,
  backgroundImage: 'none',
  borderRadius: '16px',
  width: '100%',
  minHeight: '250px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center', 
  alignItems: 'center',     
  boxSizing: 'border-box',
  overflow: 'hidden'
}));

// Botón de navegación personalizado reactivo al tema y estado activo
export const NavButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  fontWeight: 'bold',
  textTransform: 'none',
  padding: '12px 20px',
  width: '100%',
  backgroundColor: active ? theme.palette.text.primary : 'transparent',
  color: active ? theme.palette.background.paper : theme.palette.text.primary,
  borderRadius: '12px',
  transition: 'all 0.2s ease-in-out',
  border: `1px solid ${active ? 'transparent' : theme.palette.divider}`,

  '&:hover': {
    backgroundColor: active ? theme.palette.text.secondary : theme.palette.action.hover,
    borderColor: active ? 'transparent' : theme.palette.text.primary
  }
}));
