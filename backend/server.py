"""Organ Donation Platform - FastAPI backend."""
from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import random
import string
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'organ_donation')]

JWT_SECRET = os.environ.get('JWT_SECRET', 'organ-donation-secret-key-change-me')
JWT_ALGO = 'HS256'
JWT_EXP_HOURS = 24 * 30

app = FastAPI(title="OrganBridge India")
api_router = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)


# ---------------- Helpers ----------------
def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def hash_password(pwd: str) -> str:
    return bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(pwd: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(pwd.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def create_token(payload: dict) -> str:
    data = payload.copy()
    data['exp'] = datetime.now(timezone.utc) + timedelta(hours=JWT_EXP_HOURS)
    return jwt.encode(data, JWT_SECRET, algorithm=JWT_ALGO)


def decode_token(token: str) -> dict:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGO])


def gen_donor_code() -> str:
    return "OBI-" + "".join(random.choices(string.digits, k=8))


async def get_current(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing token")
    try:
        return decode_token(credentials.credentials)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")


async def require_role(role: str, payload: dict = Depends(get_current)) -> dict:
    if payload.get('role') != role:
        raise HTTPException(status_code=403, detail="Forbidden")
    return payload


async def require_admin(payload: dict = Depends(get_current)) -> dict:
    return await require_role('admin', payload)


async def require_hospital(payload: dict = Depends(get_current)) -> dict:
    return await require_role('hospital', payload)


# ---------------- Models ----------------
class DonorRegister(BaseModel):
    model_config = ConfigDict(extra="ignore")
    full_name: str
    gender: str
    dob: str
    blood_group: str
    aadhaar: str
    mobile: str
    email: EmailStr
    password: str
    address: str
    state: str
    district: str
    pincode: str
    nominee_name: str
    nominee_relation: str
    nominee_mobile: str
    organs: List[str] = Field(default_factory=list)


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class PatientInput(BaseModel):
    full_name: str
    gender: str
    age: int
    blood_group: str
    organ_needed: str
    urgency: int = Field(ge=1, le=5)
    state: str
    district: str
    notes: Optional[str] = ""


class HospitalInput(BaseModel):
    name: str
    email: EmailStr
    password: str
    h_type: str
    state: str
    district: str
    address: str
    contact: str


# ---------------- Public Stats ----------------
@api_router.get("/")
async def root():
    return {"app": "OrganBridge India", "status": "ok"}


@api_router.get("/stats")
async def get_stats():
    total_pledges = await db.donors.count_documents({})
    patients = await db.patients.count_documents({"status": "waiting"})
    hospitals = await db.hospitals.count_documents({"verified": True})
    lives_saved = await db.donors.count_documents({"status": "honored"})
    return {
        "total_pledges": total_pledges + 12847,  # baseline for demo
        "waiting_patients": patients + 5,
        "partner_hospitals": hospitals + 248,
        "lives_saved": lives_saved + 4321,
    }


@api_router.get("/waitlist/public")
async def public_waitlist():
    """Anonymized public waitlist showing transparency."""
    items = await db.patients.find({"status": "waiting"}, {"_id": 0}).sort("urgency", -1).to_list(50)
    result = []
    for p in items:
        result.append({
            "queue_id": p.get("queue_id"),
            "organ_needed": p.get("organ_needed"),
            "blood_group": p.get("blood_group"),
            "urgency": p.get("urgency"),
            "state": p.get("state"),
            "age_band": f"{(p.get('age', 0) // 10) * 10}s",
            "registered_at": p.get("registered_at"),
        })
    return result


# ---------------- Donor Auth ----------------
@api_router.post("/auth/register")
async def register_donor(data: DonorRegister):
    existing = await db.donors.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    donor_id = str(uuid.uuid4())
    donor_code = gen_donor_code()
    while await db.donors.find_one({"donor_code": donor_code}):
        donor_code = gen_donor_code()

    doc = {
        "id": donor_id,
        "donor_code": donor_code,
        "full_name": data.full_name,
        "gender": data.gender,
        "dob": data.dob,
        "blood_group": data.blood_group,
        "aadhaar_last4": data.aadhaar[-4:] if len(data.aadhaar) >= 4 else data.aadhaar,
        "mobile": data.mobile,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "address": data.address,
        "state": data.state,
        "district": data.district,
        "pincode": data.pincode,
        "nominee_name": data.nominee_name,
        "nominee_relation": data.nominee_relation,
        "nominee_mobile": data.nominee_mobile,
        "organs": data.organs or ["all"],
        "status": "active",
        "created_at": now_iso(),
    }
    await db.donors.insert_one(doc)
    token = create_token({"sub": donor_id, "role": "donor", "email": data.email})
    doc.pop('password_hash', None)
    doc.pop('_id', None)
    return {"token": token, "donor": doc}


@api_router.post("/auth/login")
async def login_donor(data: LoginInput):
    user = await db.donors.find_one({"email": data.email})
    if not user or not verify_password(data.password, user.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": user["id"], "role": "donor", "email": user["email"]})
    user.pop('password_hash', None)
    user.pop('_id', None)
    return {"token": token, "donor": user}


@api_router.get("/donors/me")
async def donor_me(payload: dict = Depends(get_current)):
    if payload.get('role') != 'donor':
        raise HTTPException(status_code=403, detail="Forbidden")
    user = await db.donors.find_one({"id": payload['sub']}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status_code=404, detail="Not found")
    return user


# ---------------- Hospital Portal ----------------
@api_router.post("/hospital/login")
async def hospital_login(data: LoginInput):
    h = await db.hospitals.find_one({"email": data.email})
    if not h or not verify_password(data.password, h.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": h["id"], "role": "hospital", "email": h["email"]})
    h.pop('password_hash', None)
    h.pop('_id', None)
    return {"token": token, "hospital": h}


@api_router.post("/hospital/patients")
async def add_patient(data: PatientInput, payload: dict = Depends(require_hospital)):
    queue_id = "QID-" + "".join(random.choices(string.digits, k=6))
    doc = {
        "id": str(uuid.uuid4()),
        "queue_id": queue_id,
        "hospital_id": payload['sub'],
        "full_name": data.full_name,
        "gender": data.gender,
        "age": data.age,
        "blood_group": data.blood_group,
        "organ_needed": data.organ_needed,
        "urgency": data.urgency,
        "state": data.state,
        "district": data.district,
        "notes": data.notes,
        "status": "waiting",
        "registered_at": now_iso(),
    }
    await db.patients.insert_one(doc)
    doc.pop('_id', None)
    return doc


@api_router.get("/hospital/patients")
async def list_my_patients(payload: dict = Depends(require_hospital)):
    items = await db.patients.find({"hospital_id": payload['sub']}, {"_id": 0}).sort("urgency", -1).to_list(200)
    return items


@api_router.get("/hospital/waitlist")
async def hospital_waitlist(payload: dict = Depends(require_hospital)):
    """Full regional waitlist visible to verified hospital staff."""
    items = await db.patients.find({"status": "waiting"}, {"_id": 0}).sort("urgency", -1).to_list(200)
    return items


# ---------------- Admin ----------------
@api_router.post("/admin/login")
async def admin_login(data: LoginInput):
    a = await db.admins.find_one({"email": data.email})
    if not a or not verify_password(data.password, a.get("password_hash", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_token({"sub": a["id"], "role": "admin", "email": a["email"]})
    return {"token": token, "admin": {"email": a["email"], "name": a.get("name", "Admin")}}


@api_router.get("/admin/donors")
async def admin_donors(payload: dict = Depends(require_admin)):
    items = await db.donors.find({}, {"_id": 0, "password_hash": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.get("/admin/hospitals")
async def admin_hospitals(payload: dict = Depends(require_admin)):
    items = await db.hospitals.find({}, {"_id": 0, "password_hash": 0}).to_list(500)
    return items


@api_router.post("/admin/hospitals")
async def admin_add_hospital(data: HospitalInput, payload: dict = Depends(require_admin)):
    existing = await db.hospitals.find_one({"email": data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Already exists")
    doc = {
        "id": str(uuid.uuid4()),
        "name": data.name,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "h_type": data.h_type,
        "state": data.state,
        "district": data.district,
        "address": data.address,
        "contact": data.contact,
        "verified": True,
        "created_at": now_iso(),
    }
    await db.hospitals.insert_one(doc)
    doc.pop('password_hash', None)
    doc.pop('_id', None)
    return doc


@api_router.get("/admin/patients")
async def admin_patients(payload: dict = Depends(require_admin)):
    items = await db.patients.find({}, {"_id": 0}).sort("urgency", -1).to_list(500)
    return items


@api_router.put("/admin/donors/{donor_id}/verify")
async def admin_verify(donor_id: str, payload: dict = Depends(require_admin)):
    await db.donors.update_one({"id": donor_id}, {"$set": {"status": "verified"}})
    return {"ok": True}


# ---------------- Seed ----------------
@app.on_event("startup")
async def seed_data():
    # Admin
    if not await db.admins.find_one({"email": "admin@organbridge.in"}):
        await db.admins.insert_one({
            "id": str(uuid.uuid4()),
            "email": "admin@organbridge.in",
            "password_hash": hash_password("Admin@123"),
            "name": "OrganBridge Admin",
            "created_at": now_iso(),
        })
    # Hospital
    if not await db.hospitals.find_one({"email": "aiims@organbridge.in"}):
        await db.hospitals.insert_one({
            "id": str(uuid.uuid4()),
            "name": "AIIMS Delhi",
            "email": "aiims@organbridge.in",
            "password_hash": hash_password("Hospital@123"),
            "h_type": "government",
            "state": "Delhi",
            "district": "New Delhi",
            "address": "Ansari Nagar, New Delhi",
            "contact": "+91-11-26588500",
            "verified": True,
            "created_at": now_iso(),
        })
    # Sample patients
    if await db.patients.count_documents({}) == 0:
        samples = [
            {"full_name": "Patient R.K.", "gender": "M", "age": 42, "blood_group": "O+", "organ_needed": "Kidney", "urgency": 5, "state": "Delhi", "district": "New Delhi"},
            {"full_name": "Patient S.M.", "gender": "F", "age": 28, "blood_group": "B+", "organ_needed": "Liver", "urgency": 4, "state": "Maharashtra", "district": "Mumbai"},
            {"full_name": "Patient A.P.", "gender": "M", "age": 55, "blood_group": "A+", "organ_needed": "Heart", "urgency": 5, "state": "Tamil Nadu", "district": "Chennai"},
            {"full_name": "Patient N.V.", "gender": "F", "age": 35, "blood_group": "AB+", "organ_needed": "Cornea", "urgency": 2, "state": "Karnataka", "district": "Bengaluru"},
            {"full_name": "Patient D.S.", "gender": "M", "age": 19, "blood_group": "O-", "organ_needed": "Lung", "urgency": 4, "state": "Gujarat", "district": "Ahmedabad"},
        ]
        for s in samples:
            s["id"] = str(uuid.uuid4())
            s["queue_id"] = "QID-" + "".join(random.choices(string.digits, k=6))
            s["status"] = "waiting"
            s["registered_at"] = now_iso()
            s["hospital_id"] = "seed"
            s["notes"] = "Seeded sample"
        await db.patients.insert_many(samples)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
