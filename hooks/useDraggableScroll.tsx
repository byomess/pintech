import { useCallback, useEffect, useRef, RefObject } from 'react';

type StartPosState = {
  scrollLeft: number;
  e: MouseEvent;
  ref?: RefObject<HTMLDivElement>;
};

type ReturnObject = {
  ref: (node: HTMLDivElement | null) => void;
};

export const useDraggableScroll = (): ReturnObject => {
  const startPos = useRef<StartPosState>();
  // const movement = useRef<number>(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (!startPos.current?.ref?.current) return;
    const dx = e.clientX - startPos.current.e?.clientX;
    // movement.current += Math.abs(dx);
    // if (movement.current > 20) {
      startPos.current.e?.stopPropagation();
      startPos.current.e?.preventDefault();
      document.body.style.cursor = 'grabbing';
      startPos.current.ref.current.scrollLeft = startPos.current.scrollLeft - dx;
    // }
  }, []);

  const onMouseUp = useCallback(() => {
    document.body.style.cursor = '';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    // movement.current = 0; // Reset movement
  }, [onMouseMove]);

  const onMouseDown = useCallback((e: MouseEvent) => {
    if (!(e.target instanceof HTMLElement) || e.target.classList.contains('tag')) {
      return;
    }
    e.target.style.cursor = 'grab'
    e.target.style.userSelect = 'none'

    const node = e.currentTarget as HTMLDivElement;
    // movement.current = 0;
    startPos.current = {
      e,
      scrollLeft: node.scrollLeft,
      ref: { current: node },
    };
    document.body.style.cursor = 'grabbing';
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [onMouseMove, onMouseUp]);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.addEventListener('mousedown', onMouseDown as EventListener);
      return () => {
        node.removeEventListener('mousedown', onMouseDown as EventListener);
      };
    }
  }, [onMouseDown]);

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onMouseMove as EventListener);
      document.removeEventListener('mouseup', onMouseUp as EventListener);
    };
  }, [onMouseMove, onMouseUp]);

  return { ref };
};
