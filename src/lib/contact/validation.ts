// Validation logic extracted for testability

export const MAX_NAME = 100;
export const MAX_EMAIL = 254;
export const MAX_MESSAGE = 5000;

export type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
  _bot?: string;
};

export type ValidationError = {
  field: string;
  message: string;
};

export type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, '').trim();
}

export type ValidationResult =
  | { valid: true; data: ContactFormData }
  | { valid: false; errors: ValidationError[] };

export function validateContactPayload(body: ContactPayload): ValidationResult {
  const errors: ValidationError[] = [];

  // Honeypot check
  if (body._bot !== undefined && body._bot !== '') {
    return { valid: false, errors: [{ field: '_bot', message: 'Spam detected.' }] };
  }

  const name = typeof body.name === 'string' ? sanitize(body.name) : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const message = typeof body.message === 'string' ? sanitize(body.message) : '';

  if (!name) {
    errors.push({ field: 'name', message: 'Name is required.' });
  } else if (name.length > MAX_NAME) {
    errors.push({ field: 'name', message: `Name must be at most ${MAX_NAME} characters.` });
  }

  if (!email) {
    errors.push({ field: 'email', message: 'Email is required.' });
  } else if (email.length > MAX_EMAIL) {
    errors.push({ field: 'email', message: `Email must be at most ${MAX_EMAIL} characters.` });
  } else if (!isEmailValid(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }

  if (!message) {
    errors.push({ field: 'message', message: 'Message is required.' });
  } else if (message.length > MAX_MESSAGE) {
    errors.push({ field: 'message', message: `Message must be at most ${MAX_MESSAGE} characters.` });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return { valid: true, data: { name, email, message } };
}
