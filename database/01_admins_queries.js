// ============================================================
// 01_admins_queries.js
// Collection: admins
// Database: organ-share-india-test
// ============================================================

// --- SELECT (Find All) ---
db.admins.find({})

// --- Find by Email ---
db.admins.find({ email: "admin@organbridge.in" })

// --- Find by ID ---
db.admins.find({ id: "<admin_uuid>" })

// --- Projection: Exclude password_hash ---
db.admins.find({}, { _id: 0, password_hash: 0 })

// --- INSERT (Create Admin) ---
db.admins.insertOne({
  id: "fb0f39d3-e1bd-42c4-a55b-044a2b146da4",   // UUID
  name: "OrganBridge Admin",
  email: "admin@organbridge.in",
  password_hash: "$2b$12$...",                    // bcrypt hash
  created_at: new Date().toISOString()
})

// --- UPDATE: Change Admin Name ---
db.admins.updateOne(
  { email: "admin@organbridge.in" },
  { $set: { name: "Super Admin", updated_at: new Date().toISOString() } }
)

// --- UPDATE: Change Password ---
db.admins.updateOne(
  { id: "<admin_uuid>" },
  { $set: { password_hash: "<new_bcrypt_hash>" } }
)

// --- DELETE Admin ---
db.admins.deleteOne({ email: "admin@organbridge.in" })

// --- COUNT ---
db.admins.countDocuments({})

// --- SORT by created_at descending ---
db.admins.find({}, { _id: 0, password_hash: 0 }).sort({ created_at: -1 })
