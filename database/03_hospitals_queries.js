// ============================================================
// 03_hospitals_queries.js
// Collection: hospitals
// Database: organ-share-india-test
// ============================================================

// --- SELECT (Find All) ---
db.hospitals.find({})

// --- Find by Email ---
db.hospitals.find({ email: "aiims@organbridge.in" })

// --- Find by ID ---
db.hospitals.find({ id: "<hospital_uuid>" })

// --- Find Verified Hospitals Only ---
db.hospitals.find({ verified: true })

// --- Find Hospitals by Type (government / private) ---
db.hospitals.find({ h_type: "government" })
db.hospitals.find({ h_type: "private" })

// --- Find Hospitals by State ---
db.hospitals.find({ state: "Delhi" })

// --- Find Hospitals by District ---
db.hospitals.find({ state: "Delhi", district: "New Delhi" })

// --- Projection: Exclude password_hash & _id ---
db.hospitals.find({}, { _id: 0, password_hash: 0 })

// --- INSERT (Admin adds Hospital) ---
db.hospitals.insertOne({
  id: "f09c57e4-6e65-45f8-893d-4df335e35f78",   // UUID
  name: "AIIMS Delhi",
  email: "aiims@organbridge.in",
  password_hash: "$2b$12$...",                   // bcrypt hash
  h_type: "government",
  state: "Delhi",
  district: "New Delhi",
  address: "Ansari Nagar, New Delhi",
  contact: "+91-11-26588500",
  verified: true,
  created_at: new Date().toISOString()
})

// --- UPDATE: Verify a Hospital ---
db.hospitals.updateOne(
  { id: "<hospital_uuid>" },
  { $set: { verified: true } }
)

// --- UPDATE: Unverify a Hospital ---
db.hospitals.updateOne(
  { id: "<hospital_uuid>" },
  { $set: { verified: false } }
)

// --- UPDATE: Change Contact Number ---
db.hospitals.updateOne(
  { id: "<hospital_uuid>" },
  { $set: { contact: "+91-11-99999999" } }
)

// --- UPDATE: Change Address ---
db.hospitals.updateOne(
  { id: "<hospital_uuid>" },
  { $set: { address: "New Address, New Delhi" } }
)

// --- DELETE Hospital ---
db.hospitals.deleteOne({ id: "<hospital_uuid>" })

// --- COUNT: Total Verified Hospitals ---
db.hospitals.countDocuments({ verified: true })

// --- COUNT: Total Hospitals ---
db.hospitals.countDocuments({})

// --- AGGREGATE: Count hospitals per state ---
db.hospitals.aggregate([
  { $match: { verified: true } },
  { $group: { _id: "$state", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// --- AGGREGATE: Count by hospital type ---
db.hospitals.aggregate([
  { $group: { _id: "$h_type", count: { $sum: 1 } } }
])

// --- INDEX: Recommended indexes ---
db.hospitals.createIndex({ email: 1 }, { unique: true })
db.hospitals.createIndex({ verified: 1 })
db.hospitals.createIndex({ state: 1, district: 1 })
db.hospitals.createIndex({ h_type: 1 })
