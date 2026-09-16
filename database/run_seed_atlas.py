import os
import sys
import uuid
import random
import string
from datetime import datetime, timezone
from pymongo import MongoClient

MONGO_URI = "mongodb+srv://deepeshdesi12_db_user:lptWqaOpOe8MfiSs@cluster0.ng9xktr.mongodb.net/?retryWrites=true&w=majority"
DB_NAME = "organ-share-india-test"

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

def gen_donor_code() -> str:
    return "OBI-" + "".join(random.choices(string.digits, k=8))

def gen_queue_id() -> str:
    return "QID-" + "".join(random.choices(string.digits, k=6))

print(f"Connecting to MongoDB Atlas database '{DB_NAME}'...")
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# 1. Create collections if not exist
existing = db.list_collection_names()
print(f"Existing collections: {existing}")

for col in ["admins", "donors", "hospitals", "patients"]:
    if col not in db.list_collection_names():
        db.create_collection(col)
        print(f"[OK] Created collection: {col}")
    else:
        print(f"[OK] Collection already exists: {col}")

# 2. Setup indexes
db.admins.create_index("email", unique=True)
db.admins.create_index("id", unique=True)

db.donors.create_index("email", unique=True)
db.donors.create_index("id", unique=True)
db.donors.create_index("donor_code", unique=True)
db.donors.create_index("status")
db.donors.create_index("blood_group")

db.hospitals.create_index("email", unique=True)
db.hospitals.create_index("id", unique=True)
db.hospitals.create_index("verified")

db.patients.create_index("queue_id", unique=True)
db.patients.create_index("id", unique=True)
db.patients.create_index([("status", 1), ("urgency", -1)])
db.patients.create_index([("organ_needed", 1), ("blood_group", 1), ("status", 1)])

print("[OK] Created indexes for all collections.")

# 3. Seed data if empty
# Admin
if db.admins.count_documents({}) == 0:
    db.admins.insert_one({
        "id": "fb0f39d3-e1bd-42c4-a55b-044a2b146da4",
        "name": "OrganBridge Admin",
        "email": "admin@organbridge.in",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtG1H/LCExDPtMv1QpM4Ux7G6Myi", # Admin@123
        "created_at": now_iso()
    })
    print("[OK] Seeded admin@organbridge.in")

# Hospital
if db.hospitals.count_documents({}) == 0:
    db.hospitals.insert_one({
        "id": "f09c57e4-6e65-45f8-893d-4df335e35f78",
        "name": "AIIMS Delhi",
        "email": "aiims@organbridge.in",
        "password_hash": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", # Hospital@123
        "h_type": "government",
        "state": "Delhi",
        "district": "New Delhi",
        "address": "Ansari Nagar, New Delhi",
        "contact": "+91-11-26588500",
        "verified": True,
        "created_at": now_iso()
    })
    print("[OK] Seeded aiims@organbridge.in")

# Donor
if db.donors.count_documents({}) == 0:
    db.donors.insert_one({
        "id": "20bfac63-f9e3-4965-b976-05c285b8e888",
        "donor_code": gen_donor_code(),
        "full_name": "Test User",
        "gender": "M",
        "dob": "1996-01-01",
        "blood_group": "O+",
        "aadhaar_last4": "9012",
        "mobile": "9876543210",
        "email": "donor@focitech.in",
        "password_hash": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtG1H/LCExDPtMv1QpM4Ux7G6Myi",
        "address": "123 St",
        "state": "Delhi",
        "district": "New Delhi",
        "pincode": "110001",
        "nominee_name": "Nominee Name",
        "nominee_relation": "Spouse",
        "nominee_mobile": "9876543211",
        "organs": ["Kidney", "Liver"],
        "status": "active",
        "created_at": now_iso()
    })
    print("[OK] Seeded donor@focitech.in")

# Patients
if db.patients.count_documents({}) == 0:
    samples = [
        {"full_name": "Patient R.K.", "gender": "M", "age": 42, "blood_group": "O+", "organ_needed": "Kidney", "urgency": 5, "state": "Delhi", "district": "New Delhi"},
        {"full_name": "Patient S.M.", "gender": "F", "age": 28, "blood_group": "B+", "organ_needed": "Liver", "urgency": 4, "state": "Maharashtra", "district": "Mumbai"},
        {"full_name": "Patient A.P.", "gender": "M", "age": 55, "blood_group": "A+", "organ_needed": "Heart", "urgency": 5, "state": "Tamil Nadu", "district": "Chennai"},
        {"full_name": "Patient N.V.", "gender": "F", "age": 35, "blood_group": "AB+", "organ_needed": "Cornea", "urgency": 2, "state": "Karnataka", "district": "Bengaluru"},
        {"full_name": "Patient D.S.", "gender": "M", "age": 19, "blood_group": "O-", "organ_needed": "Lung", "urgency": 4, "state": "Gujarat", "district": "Ahmedabad"},
    ]
    for s in samples:
        s["id"] = str(uuid.uuid4())
        s["queue_id"] = gen_queue_id()
        s["hospital_id"] = "seed"
        s["notes"] = "Seeded sample"
        s["status"] = "waiting"
        s["registered_at"] = now_iso()
    db.patients.insert_many(samples)
    print("[OK] Seeded 5 sample patients")

print("\n--- Current Database Counts ---")
print(f"Admins:    {db.admins.count_documents({})}")
print(f"Donors:    {db.donors.count_documents({})}")
print(f"Hospitals: {db.hospitals.count_documents({})}")
print(f"Patients:  {db.patients.count_documents({})}")
print("\nDatabase initialization complete!")
