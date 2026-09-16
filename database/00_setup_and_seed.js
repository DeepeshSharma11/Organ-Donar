// ============================================================
// 00_setup_and_seed.js
// Run this FIRST to create all collections, validators,
// indexes, and seed initial data.
//
// Usage:
//   mongosh "mongodb+srv://<user>:<pass>@cluster.mongodb.net/organ-share-india-test" --file 00_setup_and_seed.js
//   OR in mongosh shell:
//   use organ-share-india-test
//   load("00_setup_and_seed.js")
// ============================================================

// Switch to correct database
db = db.getSiblingDB("organ-share-india-test");

print("\n========================================");
print("  OrganBridge India - DB Setup & Seed  ");
print("========================================\n");

// ─────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────
function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function randomDigits(n) {
  var s = "";
  for (var i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
  return s;
}

function nowISO() {
  return new Date().toISOString();
}

// ─────────────────────────────────────────
// 1. DROP EXISTING COLLECTIONS (fresh setup)
// ─────────────────────────────────────────
var existingCollections = db.getCollectionNames();

["admins", "donors", "hospitals", "patients"].forEach(function (col) {
  if (existingCollections.indexOf(col) !== -1) {
    db[col].drop();
    print("✓ Dropped existing collection: " + col);
  }
});

// ─────────────────────────────────────────
// 2. CREATE COLLECTIONS WITH VALIDATORS
// ─────────────────────────────────────────

// ── admins ──
db.createCollection("admins", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["id", "email", "password_hash", "name", "created_at"],
      properties: {
        id:            { bsonType: "string", description: "UUID - required" },
        email:         { bsonType: "string", description: "Email - required" },
        password_hash: { bsonType: "string", description: "bcrypt hash - required" },
        name:          { bsonType: "string", description: "Admin name - required" },
        created_at:    { bsonType: "string", description: "ISO timestamp - required" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "warn"
});
print("✓ Created collection: admins");

// ── donors ──
db.createCollection("donors", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "id", "donor_code", "full_name", "gender", "dob",
        "blood_group", "aadhaar_last4", "mobile", "email",
        "password_hash", "address", "state", "district",
        "organs", "status", "created_at"
      ],
      properties: {
        id:             { bsonType: "string" },
        donor_code:     { bsonType: "string", pattern: "^OBI-[0-9]{8}$" },
        full_name:      { bsonType: "string" },
        gender:         { bsonType: "string", enum: ["M", "F", "Other"] },
        dob:            { bsonType: "string" },
        blood_group:    { bsonType: "string", enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-"] },
        aadhaar_last4:  { bsonType: "string", minLength: 4, maxLength: 4 },
        mobile:         { bsonType: "string" },
        email:          { bsonType: "string" },
        password_hash:  { bsonType: "string" },
        address:        { bsonType: "string" },
        state:          { bsonType: "string" },
        district:       { bsonType: "string" },
        pincode:        { bsonType: "string" },
        nominee_name:   { bsonType: "string" },
        nominee_relation: { bsonType: "string" },
        nominee_mobile: { bsonType: "string" },
        organs:         { bsonType: "array", items: { bsonType: "string" } },
        status:         { bsonType: "string", enum: ["active", "verified", "honored", "inactive"] },
        created_at:     { bsonType: "string" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "warn"
});
print("✓ Created collection: donors");

// ── hospitals ──
db.createCollection("hospitals", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "id", "name", "email", "password_hash",
        "h_type", "state", "district", "address",
        "contact", "verified", "created_at"
      ],
      properties: {
        id:            { bsonType: "string" },
        name:          { bsonType: "string" },
        email:         { bsonType: "string" },
        password_hash: { bsonType: "string" },
        h_type:        { bsonType: "string", enum: ["government", "private", "trust"] },
        state:         { bsonType: "string" },
        district:      { bsonType: "string" },
        address:       { bsonType: "string" },
        contact:       { bsonType: "string" },
        verified:      { bsonType: "bool" },
        created_at:    { bsonType: "string" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "warn"
});
print("✓ Created collection: hospitals");

// ── patients ──
db.createCollection("patients", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "id", "queue_id", "hospital_id", "full_name",
        "gender", "age", "blood_group", "organ_needed",
        "urgency", "state", "district", "status", "registered_at"
      ],
      properties: {
        id:           { bsonType: "string" },
        queue_id:     { bsonType: "string", pattern: "^QID-[0-9]{6}$" },
        hospital_id:  { bsonType: "string" },
        full_name:    { bsonType: "string" },
        gender:       { bsonType: "string", enum: ["M", "F", "Other"] },
        age:          { bsonType: "int", minimum: 0, maximum: 120 },
        blood_group:  { bsonType: "string", enum: ["A+","A-","B+","B-","AB+","AB-","O+","O-"] },
        organ_needed: { bsonType: "string", enum: ["Kidney","Liver","Heart","Lung","Cornea","Pancreas","Intestine"] },
        urgency:      { bsonType: "int", minimum: 1, maximum: 5 },
        state:        { bsonType: "string" },
        district:     { bsonType: "string" },
        notes:        { bsonType: "string" },
        status:       { bsonType: "string", enum: ["waiting", "matched", "transplanted", "removed"] },
        registered_at: { bsonType: "string" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "warn"
});
print("✓ Created collection: patients");

// ─────────────────────────────────────────
// 3. CREATE INDEXES
// ─────────────────────────────────────────
print("\n--- Creating Indexes ---");

// admins
db.admins.createIndex({ email: 1 }, { unique: true, name: "idx_admins_email" });
db.admins.createIndex({ id: 1 },    { unique: true, name: "idx_admins_id" });
print("✓ Indexes: admins");

// donors
db.donors.createIndex({ email: 1 },                   { unique: true, name: "idx_donors_email" });
db.donors.createIndex({ id: 1 },                      { unique: true, name: "idx_donors_id" });
db.donors.createIndex({ donor_code: 1 },              { unique: true, name: "idx_donors_code" });
db.donors.createIndex({ status: 1 },                  { name: "idx_donors_status" });
db.donors.createIndex({ blood_group: 1 },             { name: "idx_donors_bloodgroup" });
db.donors.createIndex({ state: 1, district: 1 },      { name: "idx_donors_location" });
db.donors.createIndex({ organs: 1 },                  { name: "idx_donors_organs" });
db.donors.createIndex({ created_at: -1 },             { name: "idx_donors_created" });
print("✓ Indexes: donors");

// hospitals
db.hospitals.createIndex({ email: 1 },              { unique: true, name: "idx_hospitals_email" });
db.hospitals.createIndex({ id: 1 },                 { unique: true, name: "idx_hospitals_id" });
db.hospitals.createIndex({ verified: 1 },           { name: "idx_hospitals_verified" });
db.hospitals.createIndex({ state: 1, district: 1 }, { name: "idx_hospitals_location" });
db.hospitals.createIndex({ h_type: 1 },             { name: "idx_hospitals_type" });
print("✓ Indexes: hospitals");

// patients
db.patients.createIndex({ queue_id: 1 },                           { unique: true, name: "idx_patients_queueid" });
db.patients.createIndex({ id: 1 },                                 { unique: true, name: "idx_patients_id" });
db.patients.createIndex({ hospital_id: 1 },                        { name: "idx_patients_hospital" });
db.patients.createIndex({ status: 1, urgency: -1 },                { name: "idx_patients_status_urgency" });
db.patients.createIndex({ organ_needed: 1, blood_group: 1, status: 1 }, { name: "idx_patients_match" });
db.patients.createIndex({ state: 1, district: 1 },                 { name: "idx_patients_location" });
db.patients.createIndex({ registered_at: -1 },                     { name: "idx_patients_registered" });
print("✓ Indexes: patients");

// ─────────────────────────────────────────
// 4. SEED DATA
// ─────────────────────────────────────────
print("\n--- Seeding Data ---");

// ── Seed: Admin ──
db.admins.insertOne({
  id:            "fb0f39d3-e1bd-42c4-a55b-044a2b146da4",
  name:          "OrganBridge Admin",
  email:         "admin@organbridge.in",
  // Password: Admin@123
  password_hash: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtG1H/LCExDPtMv1QpM4Ux7G6Myi",
  created_at:    nowISO()
});
print("✓ Seeded: admins (1 record)");

// ── Seed: Hospital ──
var hospitalId = "f09c57e4-6e65-45f8-893d-4df335e35f78";
db.hospitals.insertOne({
  id:            hospitalId,
  name:          "AIIMS Delhi",
  email:         "aiims@organbridge.in",
  // Password: Hospital@123
  password_hash: "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
  h_type:        "government",
  state:         "Delhi",
  district:      "New Delhi",
  address:       "Ansari Nagar, New Delhi - 110029",
  contact:       "+91-11-26588500",
  verified:      true,
  created_at:    nowISO()
});
print("✓ Seeded: hospitals (1 record)");

// ── Seed: Sample Donor ──
db.donors.insertOne({
  id:               "20bfac63-f9e3-4965-b976-05c285b8e888",
  donor_code:       "OBI-99883480",
  full_name:        "Test User",
  gender:           "M",
  dob:              "1996-01-01",
  blood_group:      "O+",
  aadhaar_last4:    "9012",
  mobile:           "9876543210",
  email:            "donor@focitech.in",
  password_hash:    "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtG1H/LCExDPtMv1QpM4Ux7G6Myi",
  address:          "123 St",
  state:            "Delhi",
  district:         "New Delhi",
  pincode:          "110001",
  nominee_name:     "Test Nominee",
  nominee_relation: "Spouse",
  nominee_mobile:   "9876543211",
  organs:           ["Kidney", "Liver"],
  status:           "active",
  created_at:       nowISO()
});
print("✓ Seeded: donors (1 record)");

// ── Seed: Sample Patients ──
var patientSamples = [
  {
    full_name: "Patient D.S.", gender: "M", age: 19,
    blood_group: "O-", organ_needed: "Lung", urgency: 4,
    state: "Gujarat", district: "Ahmedabad"
  },
  {
    full_name: "Patient S.M.", gender: "F", age: 28,
    blood_group: "B+", organ_needed: "Liver", urgency: 4,
    state: "Maharashtra", district: "Mumbai"
  },
  {
    full_name: "Patient A.P.", gender: "M", age: 55,
    blood_group: "A+", organ_needed: "Heart", urgency: 5,
    state: "Tamil Nadu", district: "Chennai"
  },
  {
    full_name: "Patient N.V.", gender: "F", age: 35,
    blood_group: "AB+", organ_needed: "Cornea", urgency: 2,
    state: "Karnataka", district: "Bengaluru"
  },
  {
    full_name: "Patient R.K.", gender: "M", age: 42,
    blood_group: "O+", organ_needed: "Kidney", urgency: 5,
    state: "Delhi", district: "New Delhi"
  }
];

var patientsToInsert = patientSamples.map(function (p) {
  return {
    id:            uuid(),
    queue_id:      "QID-" + randomDigits(6),
    hospital_id:   "seed",
    full_name:     p.full_name,
    gender:        p.gender,
    age:           p.age,
    blood_group:   p.blood_group,
    organ_needed:  p.organ_needed,
    urgency:       p.urgency,
    state:         p.state,
    district:      p.district,
    notes:         "Seeded sample",
    status:        "waiting",
    registered_at: nowISO()
  };
});

db.patients.insertMany(patientsToInsert);
print("✓ Seeded: patients (5 records)");

// ─────────────────────────────────────────
// 5. VERIFICATION SUMMARY
// ─────────────────────────────────────────
print("\n========================================");
print("          SETUP COMPLETE ✓              ");
print("========================================");
print("  admins:    " + db.admins.countDocuments({})    + " record(s)");
print("  donors:    " + db.donors.countDocuments({})    + " record(s)");
print("  hospitals: " + db.hospitals.countDocuments({}) + " record(s)");
print("  patients:  " + db.patients.countDocuments({})  + " record(s)");
print("========================================\n");

print("Default Credentials:");
print("  Admin    → admin@organbridge.in   / Admin@123");
print("  Hospital → aiims@organbridge.in   / Hospital@123");
print("  Donor    → donor@focitech.in / (use register flow)");
print("========================================\n");
