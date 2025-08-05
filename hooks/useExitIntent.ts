import { useState, useEffect } from 'react';

const useExitIntent = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        const alreadyShown = sessionStorage.getItem('exitIntentShown');
        if (!alreadyShown) {
          setShowModal(true);
          sessionStorage.setItem('exitIntentShown', 'true');
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { showModal, setShowModal };
};

export default useExitIntent; 