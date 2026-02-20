# Tarot Reading Web App - PRD

## Overview
Premium-quality AI-powered tarot card reading web application built with React.
Mobile-first design with immersive starlight animations, 3D card flipping, and AI interpretation via OpenRouter.

## Tech Stack
- **Frontend**: Vite + React, Tailwind CSS v4, Framer Motion
- **Backend**: Vercel Serverless Functions
- **AI**: OpenRouter API (DeepSeek R1)
- **Assets**: 78 custom tarot card images (Korean filenames)

## User Flow
1. **Intro** - Starlight particle background + title fade-in + "Begin Reading" button
2. **Question** - Optional question input with glass-morphism UI
3. **Spread Selection** - 7 spread types (1/2/3/5/7/10/Custom cards)
4. **Card Reading** - 3D flip cards with light burst effects
5. **AI Interpretation** - Loading animation + markdown-rendered reading
6. **Result** - Card thumbnails + full interpretation + screenshot download

## Features
- Bilingual support (Korean/English)
- 78 card deck (22 Major + 56 Minor Arcana)
- 7 spread types including Celtic Cross
- 3D card flip with perspective animation
- Canvas-based star particle background
- Screenshot capture and download
- Mobile-first responsive design (375px to 1280px+)
- iOS safe area support

## Design System
- Background: Deep navy (#0a0e1a) with purple/indigo radial gradients
- Primary: Gold gradient (#fbbf24 → #f59e0b)
- Accent: Purple (#a855f7), Indigo (#6366f1)
- Typography: Playfair Display (serif) + Inter (sans-serif)
- Glass morphism panels with backdrop blur

## Environment Variables
- `OPENROUTER_API_KEY` - OpenRouter API key
- `OPENROUTER_MODEL` - AI model (default: deepseek/deepseek-r1)
