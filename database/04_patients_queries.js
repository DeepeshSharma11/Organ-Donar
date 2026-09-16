// ============================================================
// 04_patients_queries.js
// Collection: patients
// Database: organ-share-india-test
// ============================================================

// --- SELECT (Find All) ---
db.patients.find({})

// --- Find by Queue ID ---
db.patients.find({ queue_id: "QID-113330" })

// --- Find by ID ---
db.patients.find({ id: "<patient_uuid>" })

// --- Find Waiting Patients (Public Waitlist) ---
db.patients.find({ status: "waiting" })

// --- Find by Organ Needed ---
db.patients.find({ organ_needed: "Kidney" })
db.patients.find({ organ_needed: "Liver" })
db.patients.find({ organ_needed: "Heart" })
db.patients.find({ organ_needed: "Lung" })
db.patients.find({ organ_needed: "Cornea" })

// --- Find by Blood Group ---
db.patients.find({ blood_group: "O+" })

// --- Find by Hospital (hospital's own patients) ---
db.patients.find({ hospital_id: "<hospital_uuid>" })

// --- Find by State ---
db.patients.find({ state: "Delhi" })

// --- Find by State & District ---
db.patients.find({ state: "Delhi", district: "New Delhi" })

// --- Find by Urgency (1=low, 5=critical) ---
db.patients.find({ urgency: 5 })   // Critical
db.patients.find({ urgency: { $gte: 4 } })  // High + Critical

// --- Find: Matching Organ + Blood Group (Donor-Patient Match) ---
db.patients.find({
  organ_needed: "Kidney",
  blood_group: "O+",
  status: "waiting"
})

// --- Public Waitlist: Anonymized, sorted by urgency ---
db.patients.find(
  { status: "waiting" },
  {
    _id: 0,
    queue_id: 1,
    organ_needed: 1,
    blood_group: 1,
    urgency: 1,
    state: 1,
    age: 1,
    registered_at: 1
  }
).sort({ urgency: -1 }).limit(50)

// --- Hospital Full Waitlist (sorted by urgency) ---
db.patients.find({ status: "waiting" }, { _id: 0 }).sort({ urgency: -1 }).limit(200)

// --- Admin: All patients sorted by urgency ---
db.patients.find({}, { _id: 0 }).sort({ urgency: -1 }).limit(500)

// --- INSERT (Hospital adds Patient) ---
db.patients.insertOne({
  id: "bc3c2775-2059-4755-96c6-f08bf81814d8",   // UUID
  queue_id: "QID-035580",
  hospital_id: "<hospital_uuid>",
  full_name: "Patient R.K.",
  gender: "M",
  age: 42,
  blood_group: "O+",
  organ_needed: "Kidney",
  urgency: 5,
  state: "Delhi",
  district: "New Delhi",
  notes: "Critical condition",
  status: "waiting",
  registered_at: new Date().toISOString()
})

// --- Seed: Insert multiple sample patients ---
db.patients.insertMany([
  {
    id: "uuid-1", queue_id: "QID-113330", hospital_id: "seed",
    full_name: "Patient D.S.", gender: "M", age: 19, blood_group: "O-",
    organ_needed: "Lung", urgency: 4, state: "Gujarat", district: "Ahmedabad",
    notes: "Seeded sample", status: "waiting", registered_at: new Date().toISOString()
  },
  {
    id: "uuid-2", queue_id: "QID-574153", hospital_id: "seed",
    full_name: "Patient S.M.", gender: "F", age: 28, blood_group: "B+",
    organ_needed: "Liver", urgency: 4, state: "Maharashtra", district: "Mumbai",
    notes: "Seeded sample", status: "waiting", registered_at: new Date().toISOString()
  },
  {
    id: "uuid-3", queue_id: "QID-536217", hospital_id: "seed",
    full_name: "Patient A.P.", gender: "M", age: 55, blood_group: "A+",
    organ_needed: "Heart", urgency: 5, state: "Tamil Nadu", district: "Chennai",
    notes: "Seeded sample", status: "waiting", registered_at: new Date().toISOString()
  },
  {
    id: "uuid-4", queue_id: "QID-574196", hospital_id: "seed",
    full_name: "Patient N.V.", gender: "F", age: 35, blood_group: "AB+",
    organ_needed: "Cornea", urgency: 2, state: "Karnataka", district: "Bengaluru",
    notes: "Seeded sample", status: "waiting", registered_at: new Date().toISOString()
  },
  {
    id: "uuid-5", queue_id: "QID-035580", hospital_id: "seed",
    full_name: "Patient R.K.", gender: "M", age: 42, blood_group: "O+",
    organ_needed: "Kidney", urgency: 5, state: "Delhi", district: "New Delhi",
    notes: "Seeded sample", status: "waiting", registered_at: new Date().toISOString()
  }
])

// --- UPDATE: Change Patient Status (matched / transplanted) ---
db.patients.updateOne(
  { id: "<patient_uuid>" },
  { $set: { status: "matched", matched_at: new Date().toISOString() } }
)

// --- UPDATE: Mark as Transplanted ---
db.patients.updateOne(
  { id: "<patient_uuid>" },
  { $set: { status: "transplanted", transplanted_at: new Date().toISOString() } }
)

// --- UPDATE: Change Urgency Level ---
db.patients.updateOne(
  { id: "<patient_uuid>" },
  { $set: { urgency: 5 } }
)

// --- DELETE Patient ---
db.patients.deleteOne({ id: "<patient_uuid>" })

// --- COUNT: Waiting Patients ---
db.patients.countDocuments({ status: "waiting" })

// --- COUNT: Patients per Organ ---
db.patients.aggregate([
  { $match: { status: "waiting" } },
  { $group: { _id: "$organ_needed", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// --- AGGREGATE: Patients per State ---
db.patients.aggregate([
  { $match: { status: "waiting" } },
  { $group: { _id: "$state", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// --- AGGREGATE: Average urgency per organ ---
db.patients.aggregate([
  { $group: { _id: "$organ_needed", avg_urgency: { $avg: "$urgency" } } },
  { $sort: { avg_urgency: -1 } }
])

// --- AGGREGATE: Critical patients by blood group (for matching) ---
db.patients.aggregate([
  { $match: { status: "waiting", urgency: { $gte: 4 } } },
  { $group: { _id: { organ: "$organ_needed", blood: "$blood_group" }, count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// --- INDEX: Recommended indexes ---
db.patients.createIndex({ status: 1, urgency: -1 })
db.patients.createIndex({ hospital_id: 1 })
db.patients.createIndex({ organ_needed: 1, blood_group: 1, status: 1 })
db.patients.createIndex({ queue_id: 1 }, { unique: true })
db.patients.createIndex({ state: 1, district: 1 })
