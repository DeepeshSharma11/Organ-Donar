# PRD — OrganBridge India

## Original Problem Statement
College project: Build a creative, animated, full-stack Organ Donation Platform website.
The site is a non-profit foundation that:
1. Acts as a strict, transparent digital queue (no bribes, no reordering)
2. Educates citizens about brain death, doctor priorities, and donation through real stories
3. Connects hospitals nationwide, with instant matching + Green Corridors for ambulances
4. Allows Aadhaar-based 2-minute signup with an instant digital Donor Card

## User Personas
- **Citizen / Donor**: Pledges organs, receives a digital donor card (QR + ID).
- **Hospital Staff**: Logs in, registers patients, sees national waitlist & corridor tracker.
- **Admin**: Verifies donors, manages hospital network, audits patients.

## Core Requirements (Static)
- Donor multi-step registration (Personal, Aadhaar, Address, Nominee, Organs, Account)
- Auto-generated Digital Donor Card with unique donor code + QR
- Public anonymized waitlist (transparency)
- Hospital Portal (auth) — patient queue + Green Corridor tracker
- Admin Panel — donors, hospitals, patients
- About / FAQ Myth-Buster / Contact pages
- Multi-language: English, Hindi, Tamil, Marathi
- Animated UI (heartbeat CTA, live counters, glowing corridor)

## Architecture
- Backend: FastAPI + MongoDB (motor). JWT auth via PyJWT, bcrypt for password hashing.
  Routes prefixed `/api`. Seeds 1 admin, 1 hospital (AIIMS Delhi), and 5 sample patients on startup.
- Frontend: React 19 + react-router-dom 7 + Tailwind + Shadcn UI.
  Fonts: Cormorant Garamond (display) + Outfit (sans). Palette: bone, deep green, terracotta accent.
- QR Codes via `api.qrserver.com` (no extra dependency).
- Donor card download via browser print + custom print CSS.

## Implemented (Feb 2026)
- Backend models & endpoints: auth (donor/hospital/admin), donors/me, stats, public waitlist,
  hospital patients CRUD, admin donors/hospitals/patients management, verify donor.
- Frontend pages: Home, About, FAQ, Contact, Register, Login, DonorDashboard,
  HospitalPortal, AdminPanel, Waitlist.
- I18n context with EN/HI/TA/MR dictionaries.
- Animated Green Corridor SVG map with random routes.
- Live animated stats counter.
- Donor card with QR via api.qrserver.com.

## Prioritized Backlog
- P1: SMS/email OTP verification (currently Aadhaar number is collected w/o real OTP)
- P1: Real PDF generation (currently uses browser print)
- P2: Hospital live alert system (matching algorithm shown but not running)
- P2: More languages, accessibility audit, RTL support
- P2: Donor family memorial wall

## Next Tasks
- Run testing agent to verify all flows
- Wire in PDF download via html2canvas + jsPDF (later)
