# ShaadiScout

A wedding-services marketplace for venues, catering, DJs, mehndi artists, and more.

## Run locally

1. Create `backend/.env` from `backend/.env.example` and add a MongoDB connection string and secure JWT secret.
2. `npm install`
3. `npm run install:all`
4. `npm run dev`

The API runs at `http://localhost:5000/api`; the web app runs at `http://localhost:5173`.

For a first set of categories and listings, run `npm --prefix backend run seed` after MongoDB is available.
