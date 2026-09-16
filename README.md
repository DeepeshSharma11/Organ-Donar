# OrganBridge India

OrganBridge India is a secure, transparent, and animated full-stack Organ Donation Platform. The system functions as a non-profit foundation database and verification system that acts as a strict, transparent digital queue for organ matches, connects hospitals nationwide with instant matching and green corridor ambulance tracking, and provides citizens with a 2-minute Aadhaar-based signup flow to generate instant digital donor cards.

## Features

- **Donor Registration Flow**: Multi-step registration wizard collecting personal details, Aadhaar number, nominee details, and organ pledge preferences.
- **Digital Donor Card**: Auto-generated donor card with a unique OBI code and dynamic QR code (powered by `api.qrserver.com`) printable directly via custom CSS styles.
- **Public Waitlist Queue**: A fully transparent, anonymized patient queue to prevent match manipulation.
- **Hospital Portal**: Authenticated dashboard for hospital staff to manage patients, coordinate Green Corridors, and view national waitlists.
- **Admin Panel**: Complete admin interface to audit patient queues, verify donors, and manage the hospital network.
- **Multi-Language Support**: Fully internationalized UI supporting English, Hindi, Tamil, and Marathi.
- **Animated Dashboards**: Live animated stat counters, a pulsing heartbeat matching CTA, and interactive SVG Green Corridor routing.

## Tech Stack

### Backend
- **Core**: FastAPI (Python)
- **Database**: MongoDB (via Motor async driver)
- **Authentication**: JWT (using PyJWT) and password hashing with `bcrypt`
- **Testing**: pytest & pytest-xdist

### Frontend
- **Core**: React 19 & react-router-dom v7
- **Styling**: Tailwind CSS & Shadcn UI
- **Typography**: Cormorant Garamond & Outfit fonts

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB instance (local or Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=organ-share-india-test
   JWT_SECRET=your_super_secret_jwt_key
   ```

### Database Setup & Queries

Sequenced database creation and seed scripts are located in the `database/` folder:

- `00_setup_and_seed.js`: Creates collections with JSON Schema validation, sets up indexes, and seeds initial data.
- `01_admins_queries.js` to `05_cross_collection_queries.js`: Sequenced query files for CRUD operations, aggregations, and donor-patient matching.

To initialize database collections and seed data on MongoDB Atlas:
```bash
python database/run_seed_atlas.py
```


5. Run the FastAPI development server:
   ```bash
   uvicorn server:app --reload # or uvicorn main:app --reload
   ```
   *Note: On startup, the backend automatically seeds 1 admin, 1 hospital (AIIMS Delhi), and 5 sample patients if the database is empty.*

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start # or npm run dev
   ```

---

## Testing

Backend test suites can be executed via `pytest`. Parallel execution is enabled by default via `pytest-xdist`:
```bash
cd backend
pytest
```
