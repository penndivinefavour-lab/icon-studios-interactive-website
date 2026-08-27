import React from 'react';

type SectionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
};

export const Section = ({ id, className = '', children }: SectionProps) => {
  return (
    <section id={id} className={`w-full px-4 py-12 md:px-8 md:py-16 lg:px-10 lg:py-20 ${className}`}>
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
};
