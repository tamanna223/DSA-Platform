# DSA Tracker Backend (MERN)

Express + MongoDB API for the DSA Sheet assignment.

## Features
- JWT authentication: `POST /api/auth/register`, `POST /api/auth/login`
- Topics list: `GET /api/topics`
- Problems per topic with user's completion flags: `GET /api/problems/by-topic/:topicId`
- Progress set/toggle: `POST /api/progress/set`
- Progress summary: `GET /api/progress/summary`
- Health check: `GET /api/health`

## Setup
1. Copy `.env.example` to `.env` and set values.
2. Install: `npm install`
3. Seed sample data (optional): `npm run seed`
4. Run dev: `npm run dev`

## Seed Data
The seed inserts sample topics (Arrays, Strings) and a few problems in each with links and levels.
