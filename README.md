# MediQueue — Tutor Booking System

🌐 **Live Site:** [https://mediqueue.vercel.app](https://mediqueue.vercel.app)

A modern tutor booking platform where students can find, book, and manage learning sessions with expert tutors.

## Features

- 🔐 **Secure Authentication** — Email/password + Google OAuth with JWT token management
- 🔍 **Smart Search & Filter** — Search tutors by name (case-insensitive) and filter by session start date range
- 📅 **Slot-Based Booking** — Real-time slot tracking with automatic decrement on successful booking
- 🌙 **Dark / Light Theme** — System-wide theme toggle persisted across sessions
- 📱 **Fully Responsive** — Optimized for mobile, tablet, and desktop

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **UI Library:** HeroUI + Tailwind CSS v4
- **Auth:** BetterAuth (email/password + Google)
- **Forms:** React Hook Form + Zod validation
- **HTTP:** Axios with JWT interceptor
- **Notifications:** React Hot Toast

## Getting Started

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your API URL
npm run dev
```
# phero-b13-l1-a9-client
