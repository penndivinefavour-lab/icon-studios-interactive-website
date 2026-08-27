import React from 'react';

type FooterProps = {
  className?: string;
};

const footerSections = [
  {
    title: 'Studio',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Projects', href: '/projects' },
      { label: 'Services', href: '/services' },
      { label: 'Experience', href: '/experience' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'hello@iconstudios.example', href: 'mailto:hello@iconstudios.example' },
      { label: 'X', href: 'https://x.com/iconstudios' },
      { label: 'GitHub', href: 'https://github.com/iconstudios' },
    ],
  },
];

export const Footer = ({ className = '' }: FooterProps) => {
  return (
    <footer className={`border-t border-border bg-surface ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-text-primary">ICON STUDIOS</p>
            <p className="mt-2 max-w-xs text-sm text-text-muted">
              Intelligent systems, creative technology, and premium digital products.
            </p>
          </div>
          {footerSections.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{section.title}</p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus rounded"
                      target={link.href.startsWith('http') ? '_blank' : undefined}
                      rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-border pt-6">
          <p className="text-xs text-text-muted">© {new Date().getFullYear()} ICON Studios. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
