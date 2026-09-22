'use client';

import React from 'react';

type ContactFormFields = {
  name: string;
  email: string;
  message: string;
};

type ContactFormState = ContactFormFields & {
  status: 'idle' | 'loading' | 'success' | 'error' | 'unconfigured';
};

const initialState: ContactFormState = {
  name: '',
  email: '',
  message: '',
  status: 'idle',
};

export default function ContactPage() {
  const [form, setForm] = React.useState<ContactFormState>(initialState);

  const update = (field: keyof ContactFormFields) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setForm((prev) => ({ ...prev, status: 'loading' }));

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setForm((prev) => ({ ...prev, status: 'error' }));
        return;
      }

      if (data.delivery === 'unconfigured') {
        setForm((prev) => ({ ...prev, status: 'unconfigured' }));
        return;
      }

      if (!data.success) {
        setForm((prev) => ({ ...prev, status: 'error' }));
        return;
      }

      setForm({ ...initialState, status: 'success' });
    } catch {
      setForm((prev) => ({ ...prev, status: 'error' }));
    }
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">Contact</h1>
          <p className="mt-3 text-sm text-text-secondary md:text-base">
            For collaborations, partnerships, or early-stage product design, reach out directly.
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-text-primary">WhatsApp</h3>
              <p className="mt-2 text-sm text-text-secondary">
                <a
                  href="https://wa.me/237672536260"
                  target="_blank"
                  rel="noreferrer"
                  className="text-text-primary underline decoration-border underline-offset-2 hover:text-text-secondary focus-visible:outline-none focus-visible:shadow-focus"
                >
                  +237 672 536 260
                </a>
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-surface p-5">
              <h3 className="text-sm font-semibold text-text-primary">Email</h3>
              <p className="mt-2 text-sm text-text-secondary">
                <a
                  href="mailto:iconstudiosyde@gmail.com"
                  className="text-text-primary underline decoration-border underline-offset-2 hover:text-text-secondary focus-visible:outline-none focus-visible:shadow-focus"
                >
                  iconstudiosyde@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-medium text-text-secondary">Name</span>
            <input
              required
              value={form.name}
              onChange={update('name')}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:shadow-focus"
              placeholder="Your name"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-text-secondary">Email</span>
            <input
              required
              type="email"
              value={form.email}
              onChange={update('email')}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:shadow-focus"
              placeholder="you@example.com"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-text-secondary">Message</span>
            <textarea
              required
              value={form.message}
              onChange={update('message')}
              className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline-none focus-visible:shadow-focus"
              placeholder="Describe the project or context..."
              rows={5}
            />
          </label>
          <button
            type="submit"
            disabled={form.status === 'loading' || form.status === 'success'}
            className="inline-flex h-10 items-center justify-center rounded-full bg-accent px-4 text-sm font-medium text-accent-foreground transition-colors hover:bg-text-secondary disabled:opacity-60"
          >
            {form.status === 'loading' ? 'Sending...' : form.status === 'success' ? 'Sent' : 'Send message'}
          </button>
          {form.status === 'error' ? (
            <p className="text-sm text-error">Something went wrong. Please try again.</p>
          ) : null}
          {form.status === 'success' ? (
            <p className="text-sm text-success">Message sent successfully.</p>
          ) : null}
          {form.status === 'unconfigured' ? (
            <div className="space-y-2">
              <p className="text-sm text-warning">Email delivery is not configured. Please reach out directly:</p>
              <p className="text-sm text-text-secondary">
                WhatsApp:{' '}
                <a
                  href="https://wa.me/237672536260"
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-border underline-offset-2 hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
                >
                  +237 672 536 260
                </a>
              </p>
              <p className="text-sm text-text-secondary">
                Email:{' '}
                <a
                  href="mailto:iconstudiosyde@gmail.com"
                  className="underline decoration-border underline-offset-2 hover:text-text-primary focus-visible:outline-none focus-visible:shadow-focus"
                >
                  iconstudiosyde@gmail.com
                </a>
              </p>
            </div>
          ) : null}
        </form>
      </div>
    </section>
  );
}
