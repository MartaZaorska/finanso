import { useState, useCallback } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  return {
    isOpen,
    close,
    open
  }
}

export default useModal;