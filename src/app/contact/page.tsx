'use client';

import React from 'react';

type ContactFormFields = {
  name: string;
  email: string;
  message: string;
};

type ContactFormState = ContactFormFields & {
  status: 'idle' | 'loading' | 'success' | 'error';
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
    await new Promise((resolve) => setTimeout(resolve, 900));
    setForm({ ...form, status: 'success' });
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-16 lg:px-10 lg:py-20">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-text-primary md:text-4xl">Contact</h1>
          <p className="mt-3 text-sm text-text-secondary md:text-base">
            For collaborations, partnerships, or early-stage product design, reach out directly.
          </p>
          <p className="mt-2 text-sm text-text-secondary md:text-base">hello@iconstudios.example</p>
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
        </form>
      </div>
    </section>
  );
}
