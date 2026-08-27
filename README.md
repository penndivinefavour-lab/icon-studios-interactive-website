# ICON Studios — Interactive Website

## Overview

ICON Studios builds intelligent digital products, AI systems, automation, and creative technology. This repository contains the studio’s interactive portfolio and digital experience — a cinematic Next.js website built to showcase projects, services, capabilities, and an evolving AI-guided experience.

## Experience

- Cinematic presentation with restrained motion and immersive background system
- Project exploration across Aurora, Nocturne, and Helix
- Services, experience timeline, and contact pathways
- Phase 3 AI-guided chat interface mounted globally as **Ask ICON**
- Phase 4 voice + avatar scaffolding integrated into the existing AI chat layer
  - Voice input uses browser-native speech APIs where available
  - Avatar state reflects listening, thinking, speaking, guiding, success, and error
  - Falls back gracefully when voice is unavailable

## Technology

- Next.js 16.3.3
- React 19.2.8
- TypeScript 5
- Tailwind CSS 4
- Motion
- Vitest

## Routes

- `/`
- `/about`
- `/projects`
- `/projects/[slug]`
- `/services`
- `/experience`
- `/contact`

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3001`.

## Environment Variables

See `.env.example`. Required variables are named only; no real values are committed.

- `AI_API_KEY` — optional when using local fallback behavior
- `AI_API_URL` — optional
- `AI_MODEL` — optional

Netlify environment variables should be configured in the Netlify dashboard under **Site settings > Environment variables**.

## Testing

```bash
npm test
```

## Production Build

```bash
npm run build
npm run start
```

## Deployment

This project is configured for Netlify deployment through GitHub.

Framework: Next.js  
Build command: `npm run build`  
Publish directory: `.next`

## Current Status

Public preview / active development.

- AI chat: functional text experience with local fallback
- Voice/avatar: present and integrated; browser-native voice behavior varies by platform
- Phase 5: not started

## Project Structure

```
src/
  app/
    about/
    contact/
    experience/
    projects/
    services/
    api/
      ai/
    components/
  components/
    ai/
    cards/
    layout/
    ui/
  lib/
    ai/
    data/
    social/
tests/
```

## License

License not yet specified.
