import React, { useEffect, useRef } from 'react';

const AutoScrollContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const textElement = textRef.current;
    if (textElement) {
      const scrollWidth = textElement.scrollWidth;
      const clientWidth = textElement.clientWidth;
      const isScrollNeeded = scrollWidth > clientWidth;
      const transactionDuration = (scrollWidth / 50) < 3 ? 3 : scrollWidth / 50

      textElement.style.setProperty('animation-duration', `${transactionDuration}s`);

      if (isScrollNeeded) {
        textElement.classList.add('text-ticker-active');
      } else {
        textElement.classList.remove('text-ticker-active');
      }
    }
  }, [children]);

  return (
    <div ref={textRef} className="text-ticker">{children}</div>
  );
};

export default AutoScrollContent;
