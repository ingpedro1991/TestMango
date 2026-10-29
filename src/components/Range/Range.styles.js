import { styled, Box } from '@mui/material';

// Contenedor principal del componente de rango
export const RangeContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: 500,
  margin: '20px auto',
  fontFamily: 'Roboto, sans-serif',
  boxSizing: 'border-box'
});

// Contenedor para las etiquetas de texto o inputs (valores mínimo y máximo)
export const LabelsWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 15,
  alignItems: 'center'
});

// Línea base del slider (barra de fondo adaptada al tema)
export const SliderTrackContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: 6,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
  borderRadius: 3,
  margin: '15px 0',
  touchAction: 'none' // Crucial para evitar scroll nativo en móviles durante el arrastre
}));

// Barra de progreso que une a ambos deslizadores (rango seleccionado dinámico)
export const SliderProgressBar = styled(Box)(({ theme, left, width }) => ({
  position: 'absolute',
  left: `${left}%`,
  width: `${width}%`,
  height: '100%',
  backgroundColor: theme.palette.text.primary,
  borderRadius: 3
}));

// Botones deslizadores (bullets o manejadores) con retroalimentación en hover y drag
export const Bullet = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragging',
})(({ theme, left, isDragging }) => ({
  position: 'absolute',
  left: `${left}%`,
  top: '50%',
  transform: 'translate(-50%, -50%)',
  width: isDragging ? 20 : 14,
  height: isDragging ? 20 : 14,
  backgroundColor: theme.palette.text.primary,
  borderRadius: '50%',
  cursor: isDragging ? 'grabbing' : 'grab',
  transition: 'width 0.1s ease, height 0.1s ease, background-color 0.2s ease, box-shadow 0.2s ease',
  zIndex: isDragging ? 3 : 2,
  boxShadow: theme.shadows[2],
  outline: 'none',

  '&:hover': {
    width: 20,
    height: 20,
    backgroundColor: theme.palette.primary.main,
    cursor: 'grab'
  },
  '&:active': {
    cursor: 'grabbing'
  },
  '&:focus-visible': {
    boxShadow: `0 0 0 4px ${theme.palette.primary.light}`,
    backgroundColor: theme.palette.primary.main
  }
}));
