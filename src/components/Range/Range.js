import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TextField, Typography } from '@mui/material';
import {
  RangeContainer,
  LabelsWrapper,
  SliderTrackContainer,
  SliderProgressBar,
  Bullet
} from './Range.styles';

export const Range = ({ min = 0, max = 100, fixedValues = null, onChange }) => {
  const isFixedMode = Array.isArray(fixedValues) && fixedValues.length > 0;
  
  const absoluteMin = isFixedMode ? fixedValues[0] : min;
  const absoluteMax = isFixedMode ? fixedValues[fixedValues.length - 1] : max;

  const [valMin, setValMin] = useState(absoluteMin);
  const [valMax, setValMax] = useState(absoluteMax);

  const [inputMin, setInputMin] = useState(absoluteMin.toString());
  const [inputMax, setInputMax] = useState(absoluteMax.toString());

  const [dragging, setDragging] = useState(null);

  const trackRef = useRef(null);
  const dragMetrics = useRef({ left: 0, width: 0 });

  useEffect(() => {
    setValMin(absoluteMin);
    setValMax(absoluteMax);
  }, [absoluteMin, absoluteMax]);

  useEffect(() => {
    setInputMin(valMin.toString());
    setInputMax(valMax.toString());
    if (onChange) onChange({ min: valMin, max: valMax });
  }, [valMin, valMax, onChange]);

  // Transforma un valor o un índice a porcentaje físico equidistante en la barra
  const getPercentage = useCallback((value) => {
    if (isFixedMode) {
      const index = fixedValues.indexOf(value);
      if (index === -1) return 0;
      return (index / (fixedValues.length - 1)) * 100;
    }
    return ((value - absoluteMin) / (absoluteMax - absoluteMin)) * 100;
  }, [absoluteMin, absoluteMax, isFixedMode, fixedValues]);

  const handleDragStart = (type) => {
    setDragging(type);
    if (trackRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      dragMetrics.current = {
        left: rect.left,
        width: rect.width || 1
      };
    }
  };

  const handleMouseMove = useCallback((e) => {
    if (!dragging) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const { left, width } = dragMetrics.current; 
    
    let percentage = ((clientX - left) / width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));

    if (isFixedMode) {
      // ESCALA EQUIDISTANTE: Distribución basada al 100% en los índices
      const totalSteps = fixedValues.length - 1;
      const closestIndex = Math.round((percentage / 100) * totalSteps);
      const chosenValue = fixedValues[closestIndex];

      // Requisito estricto: no cruzarse en el rango
      if (dragging === 'min') {
        const maxIndex = fixedValues.indexOf(valMax);
        if (closestIndex < maxIndex) {
          setValMin(chosenValue);
        }
      } else if (dragging === 'max') {
        const minIndex = fixedValues.indexOf(valMin);
        if (closestIndex > minIndex) {
          setValMax(chosenValue);
        }
      }
    } else {
      // Modo Continuo Normal
      const computedValue = Math.round(absoluteMin + (percentage / 100) * (absoluteMax - absoluteMin));
      if (dragging === 'min') {
        if (computedValue < valMax) setValMin(computedValue);
      } else if (dragging === 'max') {
        if (computedValue > valMin) setValMax(computedValue);
      }
    }
  }, [dragging, absoluteMin, absoluteMax, valMin, valMax, isFixedMode, fixedValues]);

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  useEffect(() => {
    if (dragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [dragging, handleMouseMove, handleMouseUp]);

  const handleBlurMin = () => {
    let parsed = parseFloat(inputMin);
    if (isNaN(parsed) || parsed < absoluteMin) parsed = absoluteMin;
    parsed = Math.min(parsed, valMax);
    setValMin(parsed);
    setInputMin(parsed.toString());
  };

  const handleBlurMax = () => {
    let parsed = parseFloat(inputMax);
    if (isNaN(parsed) || parsed > absoluteMax) parsed = absoluteMax;
    parsed = Math.max(parsed, valMin); 
    setValMax(parsed);
    setInputMax(parsed.toString());
  };

  const handleKeyDown = (e, type) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    
    const step = e.key === 'ArrowRight' ? 1 : -1;

    if (isFixedMode) {
      const currentIndex = fixedValues.indexOf(type === 'min' ? valMin : valMax);
      const nextIndex = Math.max(0, Math.min(fixedValues.length - 1, currentIndex + step));
      const nextValue = fixedValues[nextIndex];

      if (type === 'min' && nextValue < valMax) setValMin(nextValue);
      if (type === 'max' && nextValue > valMin) setValMax(nextValue);
    } else {
      const stepValue = 1 * step;
      if (type === 'min') {
        const nextVal = Math.max(absoluteMin, Math.min(valMax, valMin + stepValue));
        setValMin(nextVal);
      } else {
        const nextVal = Math.min(absoluteMax, Math.max(valMin, valMax + stepValue));
        setValMax(nextVal);
      }
    }
  };

  const pctMin = getPercentage(valMin);
  const pctMax = getPercentage(valMax);

  // Formateador corporativo: conserva decimales reales en modo fijo (Ej: 10.50€)
  const formatDisplay = (val) => {
    return isFixedMode ? `${Number(val).toFixed(2)}€` : `${val}€`;
  };

  return (
    <RangeContainer data-testid="custom-range">
      <LabelsWrapper>
        {isFixedMode ? (
          <>
            <Typography variant="body1" fontWeight="bold">{formatDisplay(valMin)}</Typography>
            <Typography variant="body1" fontWeight="bold">{formatDisplay(valMax)}</Typography>
          </>
        ) : (
          <>
            <TextField
              value={inputMin}
              onChange={(e) => setInputMin(e.target.value)}
              onBlur={handleBlurMin}
              onKeyDown={(e) => e.key === 'Enter' && handleBlurMin()}
              size="small"
              variant="standard"
              inputProps={{ 'data-testid': 'input-min', style: { width: '60px', textAlign: 'center', fontWeight: 'bold' } }}
              InputProps={{ disableUnderline: true, endAdornment: <span>€</span> }}
            />
            <TextField
              value={inputMax}
              onChange={(e) => setInputMax(e.target.value)}
              onBlur={handleBlurMax}
              onKeyDown={(e) => e.key === 'Enter' && handleBlurMax()}
              size="small"
              variant="standard"
              inputProps={{ 'data-testid': 'input-max', style: { width: '60px', textAlign: 'center', fontWeight: 'bold' } }}
              InputProps={{ disableUnderline: true, endAdornment: <span>€</span> }}
            />
          </>
        )}
      </LabelsWrapper>

      <SliderTrackContainer ref={trackRef}>
        <SliderProgressBar left={pctMin} width={pctMax - pctMin} />
        
        <Bullet
          left={pctMin}
          isDragging={dragging === 'min'}
          onMouseDown={() => handleDragStart('min')}
          onTouchStart={() => handleDragStart('min')}
          onKeyDown={(e) => handleKeyDown(e, 'min')}
          data-testid="bullet-min"
          role="slider"
          aria-valuenow={valMin}
          aria-valuemin={absoluteMin}
          aria-valuemax={absoluteMax}
          tabIndex={0}
        />
        
        <Bullet
          left={pctMax}
          isDragging={dragging === 'max'}
          onMouseDown={() => handleDragStart('max')}
          onTouchStart={() => handleDragStart('max')}
          onKeyDown={(e) => handleKeyDown(e, 'max')}
          data-testid="bullet-max"
          role="slider"
          aria-valuenow={valMax}
          aria-valuemin={absoluteMin}
          aria-valuemax={absoluteMax}
          tabIndex={0}
        />
      </SliderTrackContainer>
    </RangeContainer>
  );
};
