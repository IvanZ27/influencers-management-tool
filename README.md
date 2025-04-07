# Influencer Management Tool

## Overview

The Influencer Management Tool is a full-stack web application for managing social media influencers and their accounts. It allows users to:

- Create new influencers (first & last name, max 50 characters)
- Add multiple social media accounts (Instagram or TikTok)
- Edit existing influencers
- Delete influencers
- Filter the list of influencers by name (API-based)

## Tech Stack

- Frontend: React + TypeScript (with Vite)
- Backend: Node.js + Express + PostgreSQL
- Database: PostgreSQL
- Styling: CSS Modules
- Icons/UX: React Toastify, custom SVG icons
- Testing: Jest + React Testing Library (frontend), Jest + Supertest (backend)

## ⚠️ Node.js Compatibility Warning

> The project uses `react-router@7.5.0` and `react-router-dom@7.5.0`, which require Node.js version >= 20.0.0.  
> You are currently using Node v18.20.0, which will trigger warnings like the following during `npm install`:

Use a version manager like:

```bash
  nvm install 20
  nvm use 20
```

Or update your base image in Dockerfile to `node:20` or higher.

---

## Getting Started

### Running Locally (Development)

1. Clone the repository and navigate into the project root directory.
   The codebase is split into two folders: `client` (React frontend) and `server` (Node backend).

2. Install dependencies for both frontend and backend:

```bash
# Using Makefile
  make install
```

> If you are using Windows, the Makefile approach may not work unless you have `make` installed.

In that case, use the manual install commands instead:

```bash
  npm install --prefix client
  npm install --prefix server
```

3. Set up environment variables for the backend:

In `server/.env.docker` adjust if necessary:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=<your_db_user>
DB_PASSWORD=<your_db_password>
DB_NAME=influencers_db
PORT=1337
```

Make sure the database `influencers_db` exists in your PostgreSQL setup.

4. Start the backend:

```bash
  npm run dev --prefix server
```

5. Start the frontend:

```bash
  npm run dev --prefix client
```

Visit: [http://localhost:5173]

---

### Running with Docker

1. Ensure Docker and Docker Compose are installed.

2. Build and start the services:

```bash
# Using Makefile
make  up
```

Or

```bash
  docker compose up --build
```

This will:

- Start Postgres (5432)
- Start backend (1337)
- Start frontend (5173)

3. Stop containers:

```bash
  # Stop Docker:
  docker compose down
  # Or to remove DB volumes too:
  docker compose down -v
```

---

## Usage Notes

- Sample Data:

    - Boris "The Blade" – Instagram x2, TikTok x1
    - Mickey O'Neil – TikTok x1
    - Tony "Bullet Tooth" – Instagram + TikTok
    - Franky Four-Fingers – Instagram x1, TikTok x3

- Creating Influencers:

    - Add first/last name (≤ 50 chars)
    - Add at least one account
    - No duplicate (platform + username) accounts

- Editing Influencers:

    - Click ✏ to load data into form
    - Save to update

- Deleting Influencers:

    - Click 🗑 — no confirmation (deletion is instant)

- Filtering/Search:

    - Type 3+ chars to filter (case-insensitive)
    - Uses debounce (300ms delay)

- Validation & Errors:

    - Name required, ≤ 50 chars
    - At least one account required
    - Only letters, dots, underscores in usernames
    - Duplicate accounts rejected
    - Server returns 400 or 409 errors

- Notifications:

    - Toasts for success/failure messages

- Port Configuration:
    - Frontend: 5173
    - Backend: 1337

---

## Running Tests

### Frontend

```bash
  cd client
  npm run test
```

### Backend

```bash
  cd server
  npm run test
```

---

## Possible Improvements

These are additional UX/UI or feature suggestions that could improve the user experience:

- 🔍 Clear button in search input  
  Add a small "×" icon inside the search bar to quickly clear the current search text.

- ✅ Confirmation dialog before deletion  
  Show a confirmation modal or `window.confirm()` before deleting an influencer to prevent accidental data loss.

- 🧹 Reset filter after deletion  
  If a filter is active and an influencer is deleted, consider automatically clearing the filter to show the full list again.

- 🎨 Interactive buttons with hover effects  
  Improve visual feedback by adding `:hover` styles to buttons (e.g., scale, color change) to enhance interactivity and UX.

---

## Author

Created as part of a Full-Stack Developer assignment at Adcash ✌️
