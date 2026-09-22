import { describe, it, expect } from 'vitest';
import {
  validateContactPayload,
  sanitize,
  isEmailValid,
  MAX_NAME,
  MAX_EMAIL,
  MAX_MESSAGE,
} from '@/lib/contact/validation';

describe('contact form validation', () => {
  const validPayload = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'I would like to discuss a project collaboration.',
  };

  describe('isEmailValid', () => {
    it('accepts valid emails', () => {
      expect(isEmailValid('test@example.com')).toBe(true);
      expect(isEmailValid('user.name+tag@example.co.uk')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(isEmailValid('not-an-email')).toBe(false);
      expect(isEmailValid('test@')).toBe(false);
      expect(isEmailValid('@example.com')).toBe(false);
      expect(isEmailValid('test@example')).toBe(false);
      expect(isEmailValid('')).toBe(false);
    });
  });

  describe('sanitize', () => {
    it('removes HTML tags', () => {
      // Tags are stripped but text content remains (prevents HTML injection, preserves message content)
      expect(sanitize('<b>Hello</b>')).toBe('Hello');
      expect(sanitize('<script></script>Hello')).toBe('Hello');
    });

    it('trims whitespace', () => {
      expect(sanitize('  hello  ')).toBe('hello');
    });

    it('preserves normal text', () => {
      expect(sanitize('Hello, this is a test message!')).toBe('Hello, this is a test message!');
    });
  });

  describe('validateContactPayload', () => {
    it('accepts valid submission', () => {
      const result = validateContactPayload(validPayload);
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.data.name).toBe('Jane Doe');
        expect(result.data.email).toBe('jane@example.com');
        expect(result.data.message).toBe('I would like to discuss a project collaboration.');
      }
    });

    it('rejects missing required fields', () => {
      const result = validateContactPayload({ email: 'test@test.com', message: 'hi' });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors).toBeDefined();
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.errors[0].field).toBe('name');
      }
    });

    it('rejects invalid email', () => {
      const result = validateContactPayload({ ...validPayload, email: 'not-an-email' });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0].field).toBe('email');
      }
    });

    it('rejects honeypot submission', () => {
      const result = validateContactPayload({ ...validPayload, _bot: 'spam-bot' });
      expect(result.valid).toBe(false);
    });

    it('accepts empty honeypot', () => {
      const result = validateContactPayload({ ...validPayload, _bot: '' });
      expect(result.valid).toBe(true);
    });

    it('rejects messages that are too long', () => {
      const result = validateContactPayload({ ...validPayload, message: 'a'.repeat(MAX_MESSAGE + 1) });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors[0].field).toBe('message');
      }
    });

    it('rejects names that are too long', () => {
      const result = validateContactPayload({ ...validPayload, name: 'a'.repeat(MAX_NAME + 1) });
      expect(result.valid).toBe(false);
    });

    it('rejects emails that are too long', () => {
      const longEmail = 'a'.repeat(MAX_EMAIL + 1) + '@example.com';
      const result = validateContactPayload({ ...validPayload, email: longEmail });
      expect(result.valid).toBe(false);
    });

    it('trims whitespace from inputs', () => {
      const result = validateContactPayload({
        name: '  Jane Doe  ',
        email: 'jane@example.com',
        message: '  Hello!  ',
      });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.data.name).toBe('Jane Doe');
        expect(result.data.message).toBe('Hello!');
      }
    });

    it('rejects empty string values', () => {
      const result = validateContactPayload({ name: '', email: '', message: '' });
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.errors.length).toBeGreaterThanOrEqual(3);
      }
    });

    it('rejects undefined values', () => {
      const result = validateContactPayload({ name: undefined, email: undefined, message: undefined });
      expect(result.valid).toBe(false);
    });
  });
});
