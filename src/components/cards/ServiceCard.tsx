import React from 'react';

type ServiceCardProps = {
  title: string;
  description: string;
  capabilities: string[];
  index: number;
};

export const ServiceCard = ({ title, description, capabilities, index }: ServiceCardProps) => {
  return (
    <div
      className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-background"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
        <span className="text-xs text-text-muted">0{index + 1}</span>
      </div>
      <p className="mt-2 text-sm text-text-secondary">{description}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {capabilities.map((item) => (
          <li key={item}>
            <span className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-text-muted">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
