// ============================================================
// 05_cross_collection_queries.js
// Cross-collection queries & advanced operations
// Database: organ-share-india-test
// ============================================================

// --- DONOR-PATIENT MATCHING: Find potential donors for a waiting patient ---
// Step 1: Get waiting patients who need Kidney with O+ blood
var waitingPatients = db.patients.find({
  organ_needed: "Kidney",
  blood_group: "O+",
  status: "waiting"
}).toArray()

// Step 2: Find matching active donors
db.donors.find({
  blood_group: "O+",
  organs: { $in: ["Kidney", "all"] },
  status: { $in: ["active", "verified"] }
})

// --- HOSPITAL STATS: Patients count per hospital ---
db.patients.aggregate([
  { $group: { _id: "$hospital_id", total_patients: { $sum: 1 } } },
  { $sort: { total_patients: -1 } }
])

// --- DASHBOARD STATS (mirrors /api/stats endpoint) ---
// Total active pledges (donors)
db.donors.countDocuments({})

// Waiting patients
db.patients.countDocuments({ status: "waiting" })

// Verified hospitals
db.hospitals.countDocuments({ verified: true })

// Lives saved (honored donors)
db.donors.countDocuments({ status: "honored" })

// --- FULL DATABASE OVERVIEW ---
print("=== DATABASE OVERVIEW ===")
print("Admins:    " + db.admins.countDocuments({}))
print("Donors:    " + db.donors.countDocuments({}))
print("Hospitals: " + db.hospitals.countDocuments({}))
print("Patients:  " + db.patients.countDocuments({}))

// --- REGIONAL MATCHING: Find donors in same state as waiting patients ---
db.patients.aggregate([
  { $match: { status: "waiting" } },
  {
    $lookup: {
      from: "donors",
      let: { organ: "$organ_needed", blood: "$blood_group", state: "$state" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$blood_group", "$$blood"] },
                { $eq: ["$state", "$$state"] },
                { $in: ["$$organ", "$organs"] },
                { $in: ["$status", ["active", "verified"]] }
              ]
            }
          }
        },
        { $project: { _id: 0, password_hash: 0 } }
      ],
      as: "potential_donors"
    }
  },
  {
    $project: {
      _id: 0,
      queue_id: 1,
      organ_needed: 1,
      blood_group: 1,
      urgency: 1,
      state: 1,
      potential_donors_count: { $size: "$potential_donors" }
    }
  },
  { $sort: { urgency: -1 } }
])

// --- CLEANUP: Remove all seed/test data ---
// db.admins.deleteMany({})
// db.donors.deleteMany({})
// db.hospitals.deleteMany({})
// db.patients.deleteMany({})
