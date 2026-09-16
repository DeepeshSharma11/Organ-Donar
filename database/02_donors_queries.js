// ============================================================
// 02_donors_queries.js
// Collection: donors
// Database: organ-share-india-test
// ============================================================

// --- SELECT (Find All) ---
db.donors.find({})

// --- Find by Email ---
db.donors.find({ email: "donor@focitech.in" })

// --- Find by Donor Code ---
db.donors.find({ donor_code: "OBI-99883480" })

// --- Find by ID ---
db.donors.find({ id: "<donor_uuid>" })

// --- Find Active Donors Only ---
db.donors.find({ status: "active" })

// --- Find Verified Donors ---
db.donors.find({ status: "verified" })

// --- Find Donors by Blood Group ---
db.donors.find({ blood_group: "O+" })

// --- Find Donors by State & District ---
db.donors.find({ state: "Delhi", district: "New Delhi" })

// --- Find Donors who can donate specific organ ---
db.donors.find({ organs: { $in: ["Kidney"] } })

// --- Projection: Exclude password_hash & _id ---
db.donors.find({}, { _id: 0, password_hash: 0 })

// --- INSERT (Register Donor) ---
db.donors.insertOne({
  id: "20bfac63-f9e3-4965-b976-05c285b8e888",   // UUID
  donor_code: "OBI-99883480",
  full_name: "Test User",
  gender: "M",
  dob: "01/01/1996, 05:30:00",
  blood_group: "O+",
  aadhaar_last4: "9012",
  mobile: "9876543210",
  email: "donor@focitech.in",
  password_hash: "$2b$12$...",                   // bcrypt hash
  address: "123 St",
  state: "Delhi",
  district: "New Delhi",
  pincode: "110001",
  nominee_name: "Nominee Name",
  nominee_relation: "Spouse",
  nominee_mobile: "9876543211",
  organs: ["Kidney", "Liver"],
  status: "active",
  created_at: new Date().toISOString()
})

// --- UPDATE: Verify a Donor ---
db.donors.updateOne(
  { id: "<donor_uuid>" },
  { $set: { status: "verified" } }
)

// --- UPDATE: Mark Donor as Honored (after death donation) ---
db.donors.updateOne(
  { id: "<donor_uuid>" },
  { $set: { status: "honored", honored_at: new Date().toISOString() } }
)

// --- UPDATE: Update Mobile Number ---
db.donors.updateOne(
  { id: "<donor_uuid>" },
  { $set: { mobile: "9999999999" } }
)

// --- DELETE Donor ---
db.donors.deleteOne({ id: "<donor_uuid>" })

// --- COUNT: Total Active Donors ---
db.donors.countDocuments({ status: "active" })

// --- COUNT: Total Honored Donors ---
db.donors.countDocuments({ status: "honored" })

// --- SORT by created_at descending (latest first) ---
db.donors.find({}, { _id: 0, password_hash: 0 }).sort({ created_at: -1 })

// --- LIMIT: Get latest 10 donors ---
db.donors.find({}, { _id: 0, password_hash: 0 }).sort({ created_at: -1 }).limit(10)

// --- AGGREGATE: Count donors per blood group ---
db.donors.aggregate([
  { $group: { _id: "$blood_group", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// --- AGGREGATE: Count donors per state ---
db.donors.aggregate([
  { $group: { _id: "$state", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])

// --- INDEX: Recommended indexes ---
db.donors.createIndex({ email: 1 }, { unique: true })
db.donors.createIndex({ donor_code: 1 }, { unique: true })
db.donors.createIndex({ status: 1 })
db.donors.createIndex({ blood_group: 1 })
db.donors.createIndex({ state: 1, district: 1 })
