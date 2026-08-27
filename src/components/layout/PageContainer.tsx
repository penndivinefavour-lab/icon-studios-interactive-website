import React from 'react';

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageContainer = ({ children, className = '' }: PageContainerProps) => {
  return (
    <div className={`mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-14 lg:px-10 lg:py-16 ${className}`}>
      {children}
    </div>
  );
};
