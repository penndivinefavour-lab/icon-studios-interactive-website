import React from 'react';

type BadgeVariant = 'neutral' | 'success' | 'warning' | 'error' | 'outline';

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium';

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'border-border bg-background text-text-secondary',
  success: 'border-border bg-surface text-success',
  warning: 'border-border bg-surface text-warning',
  error: 'border-border bg-surface text-error',
  outline: 'border-text-secondary text-text-secondary',
};

export const Badge = ({ className = '', variant = 'neutral', children, ...props }: BadgeProps) => {
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};
