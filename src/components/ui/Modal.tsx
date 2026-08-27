'use client';

import React, { useEffect as useReactEffect } from 'react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export const Modal = ({ open, onClose, title, children }: ModalProps) => {
  useReactEffect(() => {
    if (open) {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-text-primary/20 backdrop-blur-sm" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-lg"
      >
        {title ? <h3 className="text-base font-semibold text-text-primary">{title}</h3> : null}
        <div className="mt-3 text-text-secondary">{children}</div>
      </div>
    </div>
  );
};
