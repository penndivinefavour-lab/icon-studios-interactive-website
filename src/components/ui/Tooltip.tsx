'use client';

import React, { useState, useRef } from 'react';

type TooltipProps = {
  text: string;
  children: React.ReactElement;
};

export const Tooltip = ({ text, children }: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement | null>(null);

  const handleEnter = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setPosition({ x: rect.left + rect.width / 2, y: rect.top });
    setVisible(true);
  };

  const handleLeave = () => setVisible(false);

  return (
    <span
      ref={triggerRef as React.RefObject<HTMLElement>}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onBlur={handleLeave}
      onFocus={handleEnter}
      className="inline-flex"
    >
      {children}
      {visible ? (
        <span
          className="pointer-events-none fixed z-50 rounded-md border border-border bg-elevated px-2 py-1 text-xs text-text-primary shadow-md"
          style={{ left: position.x, top: position.y, transform: 'translate(-50%, calc(-100% - 8px))' }}
        >
          {text}
        </span>
      ) : null}
    </span>
  );
};
