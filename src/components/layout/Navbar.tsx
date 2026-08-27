'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { navigation } from '@/lib/data/content';
import { Button } from '@/components/ui/Button';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${
        scrolled ? 'border-b border-border bg-surface/80 backdrop-blur-md' : 'border-transparent bg-background/60'
      }`}
    >
      <div className="mx-auto w-full max-w-6xl px-4 md:px-8 lg:px-10">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold tracking-tight text-text-primary">
              ICON STUDIOS
            </Link>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
              {navigation.map((item) => {
                const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative text-sm transition-colors focus-visible:outline-none focus-visible:shadow-focus rounded-full"
                  >
                    <span className={active ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}>
                      {item.label}
                    </span>
                    {active ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="hidden md:block">
            <Button href="/contact" variant="secondary" size="sm">Contact</Button>
          </div>
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border md:hidden"
          >
            <span className="text-xs font-medium uppercase tracking-wide">Menu</span>
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden border-t border-border bg-surface md:hidden"
          >
            <nav className="mx-auto w-full max-w-6xl px-4 py-4" aria-label="Mobile">
              <div className="flex flex-col gap-2">
                {navigation.map((item) => {
                  const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                        active ? 'text-text-primary bg-background' : 'text-text-secondary hover:bg-background hover:text-text-primary'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};
