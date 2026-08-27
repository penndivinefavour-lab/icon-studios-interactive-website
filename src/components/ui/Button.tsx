import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  href?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const baseClasses =
  'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:shadow-focus disabled:opacity-50 disabled:pointer-events-none';

const variantClasses: Record<string, string> = {
  primary: 'bg-accent text-accent-foreground hover:bg-text-secondary',
  secondary: 'bg-surface border border-border text-text-primary hover:bg-background',
  ghost: 'text-text-secondary hover:text-text-primary',
  outline: 'border border-border text-text-primary hover:border-text-secondary',
};

const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-base',
};

export const Button = ({ variant = 'primary', size = 'md', className = '', href, children, ...props }: ButtonProps) => {
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} type="button" {...props}>
      {children}
    </button>
  );
};
