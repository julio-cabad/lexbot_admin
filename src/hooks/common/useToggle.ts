import { useState, useCallback } from 'react';

/**
 * Hook para manejar valores booleanos con toggle
 */
export const useToggle = (initialValue: boolean = false): [boolean, () => void, (value: boolean) => void] => {
  const [value, setValue] = useState(initialValue);

  const toggle = () => {
    setValue(prev => !prev);
  };

  const setToggleValue = (newValue: boolean) => {
    setValue(newValue);
  };

  return [value, toggle, setToggleValue];
};