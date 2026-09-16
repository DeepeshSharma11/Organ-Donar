# Memory

- Fixed frontend npm dependency resolution by pinning `date-fns` to `3.6.0`, which satisfies `react-day-picker@8.10.1` peer requirements.
- Removed `emergentintegrations` package from backend `requirements.txt` to fix pip installation error (package was removed from PyPI).
- Created `frontend/.npmrc` with `legacy-peer-deps=true` to automatically resolve npm peer dependency conflicts (specifically React 19 vs react-day-picker).
- Removed all "emergent" packages, scripts, visual edits config, meta headers, test ID keys, and comments across the entire frontend (including craco config, index.html, package.json, and constants).
- Cleaned up forced `ajv` and `schema-utils` package overrides in `frontend/package.json` to allow standard npm nested dependency resolution, fixing `validateOptions is not a function` in `babel-loader` and ensuring `@craco/craco` loads cleanly.
- Updated backend `server.py` to provide local fallback defaults for `MONGO_URL` and `DB_NAME` environment variables.
- Configured MongoDB Atlas connection URI (`MONGO_URL`) and `DB_NAME` in `backend/.env`.
- Created `database` folder with collection schemas, indexes, sequenced queries (`01` to `05`), JavaScript seed file (`00_setup_and_seed.js`), and executed `run_seed_atlas.py` to initialize MongoDB Atlas cluster database `organ-share-india-test` with all 4 tables/collections (`admins`, `donors`, `hospitals`, `patients`).
- Updated default donor email to `donor@focitech.in` in database schemas, setup/seed scripts, database query files, and updated the frontend login interface helper text.
- Connected to MongoDB Atlas cluster and updated existing database records to use the new `donor@focitech.in` email.
- Added `"dev": "craco start"` script to `frontend/package.json` to support both `npm run dev` and `npm start`.
- Added `backend/main.py` entrypoint alias (`from server import app`) to support running `uvicorn main:app` alongside `uvicorn server:app`.
- Configured root Git repository, removed nested `frontend/.git`, updated root `.gitignore` to exclude `backend/data/` and `.emergent/`.
