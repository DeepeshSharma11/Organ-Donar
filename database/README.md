# Database Queries - organ-share-india-test

MongoDB database for **OrganBridge India** organ donation platform.

## Collections

| # | Collection | Documents |
|---|-----------|-----------|
| 1 | `admins` | Platform admins |
| 2 | `donors` | Registered organ donors |
| 3 | `hospitals` | Partner hospitals |
| 4 | `patients` | Patients on waitlist |

## Query Files (Sequential)

| File | Collection | Description |
|------|-----------|-------------|
| `01_admins_queries.js` | admins | CRUD + sort |
| `02_donors_queries.js` | donors | CRUD + aggregation + indexes |
| `03_hospitals_queries.js` | hospitals | CRUD + aggregation + indexes |
| `04_patients_queries.js` | patients | CRUD + matching + aggregation + indexes |
| `05_cross_collection_queries.js` | ALL | Donor-patient matching, dashboard stats, regional lookup |

## Schema

### admins
```
id, name, email, password_hash, created_at
```

### donors
```
id, donor_code, full_name, gender, dob, blood_group,
aadhaar_last4, mobile, email, password_hash,
address, state, district, pincode,
nominee_name, nominee_relation, nominee_mobile,
organs[], status (active/verified/honored), created_at
```

### hospitals
```
id, name, email, password_hash, h_type (government/private),
state, district, address, contact, verified (bool), created_at
```

### patients
```
id, queue_id, hospital_id, full_name, gender, age,
blood_group, organ_needed, urgency (1-5),
state, district, notes, status (waiting/matched/transplanted),
registered_at
```

## Usage

```bash
# Run in mongosh
mongosh "your-connection-string" organ-share-india-test --file 01_admins_queries.js
```
