# Stub · Event Management System

A React app for finding live events, registering for them and keeping track of the ones you're going to.
Event data comes from the **Ticketmaster Discovery API**.

Built with **React**, **Redux Toolkit**, **React Router** and **Vite**.

## Features

**Accounts**
- Register with name, email and password (with form validation)
- Log in and log out
- Stay logged in after refreshing the page (saved in localStorage)
- Pages like My Events are protected and send guests to the login page

> This is a frontend-only simulation of authentication, as the assignment allows. Users are stored in the
> browser's localStorage and passwords are hashed with SHA-256 before saving.

**Exploring events**
- Browse upcoming events from Ticketmaster, 20 per page
- Search by keyword (artist, team, show)
- Filter by category, city, country and date range, and sort by date, name or relevance
- Browse by category from the home page
- Loading, error and "no results" states

**Event details**
- Name, date and time, venue, address, city, category and genre, image
- Price range, ticket limit, line-up, notes, seat map and a Google Maps link when available

**Registration and My Events**
- Logged-in users can register for an event
- Duplicate registrations are prevented
- A message confirms each registration or cancellation
- My Events splits registrations into **Upcoming** and **Attended** (past) events
- Upcoming registrations can be cancelled
- Each user only sees their own registrations

## Getting started

### 1. Requirements

- [Node.js](https://nodejs.org/) 18 or newer

### 2. Install

```bash
git clone https://github.com/AbdulahAzmat/Event-Management-System-webDev.git
cd Event-Management-System-webDev
npm install
```

### 3. Add a Ticketmaster API key

1. Create a free account at https://developer.ticketmaster.com/
2. Open **My Apps** and copy the **Consumer Key**
3. Copy `.env.example` to a new file called `.env` and paste your key in:

```
VITE_TM_API_KEY=your_consumer_key_here
```

The `.env` file is listed in `.gitignore`, so the key is never committed.

### 4. Run

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | Check the code for problems |

## Project structure

```
src/
  api/ticketmaster.js     All calls to the Ticketmaster API
  store/                  Redux Toolkit store and slices
  components/             Reusable components (Header, EventRow, TicketCard, Toast, ...)
  pages/                  One file per page (Home, Events, EventDetails, Login, Register, MyEvents)
  utils/                  Small helpers (localStorage, validation, date and price formatting)
  App.jsx                 Routes
  main.jsx                App entry point
```

## Redux store

| Slice | What it holds |
|---|---|
| `auth` | The logged-in user, loading status and login/register errors |
| `events` | Search results, filters, paging, the "coming up" list and the event open on the details page |
| `registrations` | Each user's registered events, saved to localStorage |
| `toast` | The feedback message shown after registering or cancelling |

The app uses `configureStore`, `createSlice`, `createAsyncThunk`, `useSelector` and `useDispatch`.

## Routes

| Path | Page |
|---|---|
| `/` | Home |
| `/events` | All events with search and filters |
| `/events/:id` | Event details |
| `/login` | Log in |
| `/register` | Create account |
| `/my-events` | My Events (logged-in users only) |
| `*` | Page not found |

## Notes

- Ticketmaster only lists events in the countries where it sells tickets, such as the US, Canada, the UK,
  Ireland, Australia, New Zealand, Mexico and much of Europe. Searching other countries returns no results.
- The free API key allows 5,000 requests a day and 2 requests a second.
