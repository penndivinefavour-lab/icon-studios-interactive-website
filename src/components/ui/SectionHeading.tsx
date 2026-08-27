import React from 'react';

type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: 'left' | 'center';
};

const alignClasses: Record<string, string> = {
  left: 'items-start text-left',
  center: 'items-center text-center',
};

export const SectionHeading = ({ title, description, align = 'left' }: SectionHeadingProps) => {
  return (
    <div className={`flex flex-col gap-2 ${alignClasses[align]}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-text-primary md:text-3xl">{title}</h2>
      {description ? <p className="max-w-2xl text-sm text-text-secondary md:text-base">{description}</p> : null}
    </div>
  );
};
