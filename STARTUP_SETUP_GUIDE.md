# Setup 15 Startups - Guide

## 🚀 Quick Setup

### Option 1: Using Seeding Script (Recommended)

```bash
cd backend
node seed-startups.js
```

**Output:**
```
✅ Connected to MongoDB
✅ Created: NexusHub
   Email: nexushub@startup.com
   Category: AI/ML
   ...
📊 Summary:
✅ Created: 15 startups
⏭️  Skipped: 0 startups
📝 Total: 15 startups
🔐 Password: Chand@1502
✨ Seeding completed!
```

---

## 15 Startups Created

| # | Company Name | Email | Category | Funding |
|---|---|---|---|---|
| 1 | NexusHub | nexushub@startup.com | AI/ML | $500K |
| 2 | FinVault | fintech@startup.com | FinTech | $750K |
| 3 | MediConnect | healthtech@startup.com | HealthTech | $1M |
| 4 | EduSmart | edtech@startup.com | EdTech | $600K |
| 5 | CropAI | agritech@startup.com | AgriTech | $800K |
| 6 | GreenTrack | climate@startup.com | ClimateOps | $400K |
| 7 | WorkFlow Pro | saas@startup.com | SaaS | $1.2M |
| 8 | ChainVault | blockchain@startup.com | Blockchain | $1.5M |
| 9 | SmartHome Tech | iot@startup.com | IoT | $900K |
| 10 | BioGenesis | biotech@startup.com | Biotech | $2M |
| 11 | ShopNow | ecommerce@startup.com | E-commerce | $500K |
| 12 | MarketIQ | martech@startup.com | MarketingTech | $700K |
| 13 | SecureShield | cybersecurity@startup.com | CyberSecurity | $1.1M |
| 14 | LogisticsPro | supplychain@startup.com | Supply Chain | $950K |
| 15 | GameStudio | gaming@startup.com | Gaming | $1.3M |

**Password for all:** `Chand@1502`

---

## Test Login

### Login with any startup:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nexushub@startup.com",
    "password": "Chand@1502"
  }'
```

**Expected Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "nexushub@startup.com",
    "role": "startup"
  },
  "token": "eyJhbGc..."
}
```

### Get Startup Profile:

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer <token>" \
  -H "Cookie: token=<token>"
```

---

## View All Startups

```bash
curl http://localhost:5000/api/startups
```

**Response:**
```json
{
  "startups": [
    {
      "user": "user_id",
      "companyName": "NexusHub",
      "description": "AI-powered platform for business intelligence and analytics",
      "category": "AI/ML",
      "tags": ["AI", "ML", "Analytics", "B2B"],
      ...
    },
    ...
  ]
}
```

---

## 🔧 Manual Setup (Alternative)

If you prefer to create startups manually via API:

```bash
# 1. Register first startup
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nexushub@startup.com",
    "password": "Chand@1502",
    "role": "startup"
  }'

# Save the token from response

# 2. Create startup profile
curl -X POST http://localhost:5000/api/startups \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "NexusHub",
    "description": "AI-powered platform for business intelligence",
    "pitch": "Making AI accessible to every business",
    "fundingNeeded": 500000,
    "technicalHelp": "Machine Learning, Data Science",
    "location": "San Francisco, CA",
    "tags": ["AI", "ML", "Analytics", "B2B"]
  }'
```

---

## 💡 Key Features

Each startup includes:
- ✅ **Unique Email** - Easy identification
- ✅ **Security** - Password hashed with bcryptjs
- ✅ **Company Info** - Name, description, pitch
- ✅ **Funding Details** - Amount needed, tech help required
- ✅ **Location** - Different cities across US
- ✅ **Tags** - Category and industry tags for filtering
- ✅ **Active Status** - All ready to use

---

## 🔍 Verify Setup

### Check startup count:
```bash
curl http://localhost:5000/api/startups | grep -i "total"
```

### Search by category via tags:
```bash
# Get all AI startups
curl "http://localhost:5000/api/startups?tags=AI"

# Get all FinTech startups
curl "http://localhost:5000/api/startups?tags=FinTech"
```

### Test all 15 logins:
```bash
for email in nexushub@startup.com fintech@startup.com healthtech@startup.com \
  edtech@startup.com agritech@startup.com climate@startup.com \
  saas@startup.com blockchain@startup.com iot@startup.com \
  biotech@startup.com ecommerce@startup.com martech@startup.com \
  cybersecurity@startup.com supplychain@startup.com gaming@startup.com; do
  
  echo "Testing: $email"
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$email\", \"password\": \"Chand@1502\"}" | grep -i "token"
done
```

---

## ⚡ Quick Reference

### All Startup Emails & Passwords
```
Email: nexushub@startup.com | Password: Chand@1502 | Category: AI/ML
Email: fintech@startup.com | Password: Chand@1502 | Category: FinTech
Email: healthtech@startup.com | Password: Chand@1502 | Category: HealthTech
Email: edtech@startup.com | Password: Chand@1502 | Category: EdTech
Email: agritech@startup.com | Password: Chand@1502 | Category: AgriTech
Email: climate@startup.com | Password: Chand@1502 | Category: ClimateOps
Email: saas@startup.com | Password: Chand@1502 | Category: SaaS
Email: blockchain@startup.com | Password: Chand@1502 | Category: Blockchain
Email: iot@startup.com | Password: Chand@1502 | Category: IoT
Email: biotech@startup.com | Password: Chand@1502 | Category: Biotech
Email: ecommerce@startup.com | Password: Chand@1502 | Category: E-commerce
Email: martech@startup.com | Password: Chand@1502 | Category: MarketingTech
Email: cybersecurity@startup.com | Password: Chand@1502 | Category: CyberSecurity
Email: supplychain@startup.com | Password: Chand@1502 | Category: Supply Chain
Email: gaming@startup.com | Password: Chand@1502 | Category: Gaming
```

---

## 📝 Notes

- All startups are created with `isActive: true`
- Passwords are hashed before storage (bcryptjs with salt 10)
- Each has unique email for identification
- Different funding amounts and requirements
- Location spread across major US cities + Singapore
- Tags help with searching and filtering

---

**Setup Date:** March 14, 2026
**Total Startups:** 15
**Status:** Ready to use ✅
