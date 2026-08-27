import React from 'react';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

export const LinkPrimitive = ({ className = '', children, ...props }: LinkProps) => {
  return (
    <a
      className={`inline-flex items-center gap-1 text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus rounded ${className}`}
      {...props}
    >
      {children}
    </a>
  );
};
