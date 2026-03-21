/**
 * Seeding script to create 15 startups with different categories
 * Usage: node seed-startups.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const StartupProfile = require('./models/StartupProfile');

const STARTUPS = [
  {
    email: 'nexushub@startup.com',
    companyName: 'NexusHub',
    category: 'AI/ML',
    description: 'AI-powered platform for business intelligence and analytics',
    pitch: 'Making AI accessible to every business',
    fundingNeeded: 500000,
    technicalHelp: 'Machine Learning, Data Science, Cloud Infrastructure',
    location: 'San Francisco, CA',
    tags: ['AI', 'ML', 'Analytics', 'B2B']
  },
  {
    email: 'fintech@startup.com',
    companyName: 'FinVault',
    category: 'FinTech',
    description: 'Secure digital wallet and payment solutions for SMEs',
    pitch: 'Payment processing made simple and secure',
    fundingNeeded: 750000,
    technicalHelp: 'Blockchain, Payment APIs, Mobile Development',
    location: 'New York, NY',
    tags: ['FinTech', 'Payments', 'Security', 'B2B']
  },
  {
    email: 'healthtech@startup.com',
    companyName: 'MediConnect',
    category: 'HealthTech',
    description: 'Telemedicine platform connecting patients with doctors',
    pitch: 'Healthcare at your fingertips',
    fundingNeeded: 1000000,
    technicalHelp: 'HIPAA Compliance, Video Streaming, Backend Development',
    location: 'Boston, MA',
    tags: ['HealthTech', 'Telemedicine', 'Healthcare', 'B2C']
  },
  {
    email: 'edtech@startup.com',
    companyName: 'EduSmart',
    category: 'EdTech',
    description: 'Personalized learning platform using AI tutoring',
    pitch: 'Every student learns at their own pace',
    fundingNeeded: 600000,
    technicalHelp: 'Educational AI, Content Management, Frontend Development',
    location: 'Austin, TX',
    tags: ['EdTech', 'Learning', 'AI', 'B2B']
  },
  {
    email: 'agritech@startup.com',
    companyName: 'CropAI',
    category: 'AgriTech',
    description: 'Predictive analytics for optimal crop yield',
    pitch: 'Smart farming for the modern age',
    fundingNeeded: 800000,
    technicalHelp: 'IoT Sensors, Data Analysis, Mobile Apps',
    location: 'Iowa, IA',
    tags: ['AgriTech', 'Agriculture', 'IoT', 'B2B']
  },
  {
    email: 'climate@startup.com',
    companyName: 'GreenTrack',
    category: 'ClimateOps',
    description: 'Carbon tracking and emission reduction software',
    pitch: 'Making sustainability measurable',
    fundingNeeded: 400000,
    technicalHelp: 'Environmental Data APIs, Dashboard Development, Backend',
    location: 'Portland, OR',
    tags: ['ClimateOps', 'Sustainability', 'ESG', 'B2B']
  },
  {
    email: 'saas@startup.com',
    companyName: 'WorkFlow Pro',
    category: 'SaaS',
    description: 'All-in-one project management and collaboration tool',
    pitch: 'One tool for all your team needs',
    fundingNeeded: 1200000,
    technicalHelp: 'Full-stack Development, Real-time Collaboration, DevOps',
    location: 'Seattle, WA',
    tags: ['SaaS', 'Productivity', 'Enterprise', 'B2B']
  },
  {
    email: 'blockchain@startup.com',
    companyName: 'ChainVault',
    category: 'Blockchain',
    description: 'Enterprise blockchain solutions for supply chain',
    pitch: 'Transparency in every transaction',
    fundingNeeded: 1500000,
    technicalHelp: 'Blockchain Development, Smart Contracts, Backend',
    location: 'Singapore',
    tags: ['Blockchain', 'Web3', 'Supply Chain', 'B2B']
  },
  {
    email: 'iot@startup.com',
    companyName: 'SmartHome Tech',
    category: 'IoT',
    description: 'Connected home automation platform',
    pitch: 'Your home, intelligently connected',
    fundingNeeded: 900000,
    technicalHelp: 'IoT Development, Hardware Integration, Mobile Apps',
    location: 'San Diego, CA',
    tags: ['IoT', 'Smart Home', 'Automation', 'B2C']
  },
  {
    email: 'biotech@startup.com',
    companyName: 'BioGenesis',
    category: 'Biotech',
    description: 'Gene sequencing and personalized medicine platform',
    pitch: 'Healthcare tailored to your genes',
    fundingNeeded: 2000000,
    technicalHelp: 'Bioinformatics, Machine Learning, Data Privacy',
    location: 'San Jose, CA',
    tags: ['Biotech', 'Healthcare', 'Genomics', 'B2B']
  },
  {
    email: 'ecommerce@startup.com',
    companyName: 'ShopNow',
    category: 'E-commerce',
    description: 'Social commerce platform for small businesses',
    pitch: 'Sell directly to your community',
    fundingNeeded: 500000,
    technicalHelp: 'Payment Integration, Inventory Management, Mobile',
    location: 'Los Angeles, CA',
    tags: ['E-commerce', 'Social Commerce', 'B2C', 'SME']
  },
  {
    email: 'martech@startup.com',
    companyName: 'MarketIQ',
    category: 'MarketingTech',
    description: 'AI-powered marketing automation platform',
    pitch: 'Marketing at scale, with personal touch',
    fundingNeeded: 700000,
    technicalHelp: 'Marketing APIs, Data Analysis, Frontend Development',
    location: 'Chicago, IL',
    tags: ['MarTech', 'Marketing', 'Automation', 'B2B']
  },
  {
    email: 'cybersecurity@startup.com',
    companyName: 'SecureShield',
    category: 'CyberSecurity',
    description: 'Zero-trust security platform for enterprises',
    pitch: 'Never trust, always verify',
    fundingNeeded: 1100000,
    technicalHelp: 'Security Architecture, Penetration Testing, Backend',
    location: 'Washington, DC',
    tags: ['CyberSecurity', 'Security', 'Enterprise', 'B2B']
  },
  {
    email: 'supplychain@startup.com',
    companyName: 'LogisticsPro',
    category: 'Supply Chain',
    description: 'Real-time supply chain visibility platform',
    pitch: 'From warehouse to doorstep, see it all',
    fundingNeeded: 950000,
    technicalHelp: 'Real-time Tracking, GPS Integration, Dashboard',
    location: 'Miami, FL',
    tags: ['Supply Chain', 'Logistics', 'Tracking', 'B2B']
  },
  {
    email: 'gaming@startup.com',
    companyName: 'GameStudio',
    category: 'Gaming',
    description: 'Cloud-based gaming platform with multiplayer support',
    pitch: 'Play anywhere, anytime',
    fundingNeeded: 1300000,
    technicalHelp: 'Game Development, Cloud Infrastructure, Graphics',
    location: 'Redmond, WA',
    tags: ['Gaming', 'Cloud Gaming', 'Entertainment', 'B2C']
  }
];

const PASSWORD = 'Chand@1502';

async function seedStartups() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data if needed (uncomment if you want to reset)
    // await User.deleteMany({ role: 'startup' });
    // await StartupProfile.deleteMany({});
    // console.log('Cleared existing startup data');

    let createdCount = 0;
    let skippedCount = 0;

    for (const startup of STARTUPS) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: startup.email });
        if (existingUser) {
          console.log(`⏭️  Skipped: ${startup.email} (already exists)`);
          skippedCount++;
          continue;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(PASSWORD, 10);

        // Create user
        const user = await User.create({
          email: startup.email,
          password: hashedPassword,
          role: 'startup',
          isActive: true
        });

        // Create startup profile
        const profile = await StartupProfile.create({
          user: user._id,
          companyName: startup.companyName,
          description: startup.description,
          pitch: startup.pitch,
          fundingNeeded: startup.fundingNeeded,
          technicalHelp: startup.technicalHelp,
          location: startup.location,
          tags: startup.tags,
          isActive: true
        });

        console.log(`✅ Created: ${startup.companyName}`);
        console.log(`   Email: ${startup.email}`);
        console.log(`   Category: ${startup.category}`);
        console.log(`   User ID: ${user._id}`);
        console.log(`   ---`);

        createdCount++;
      } catch (error) {
        console.error(`❌ Error creating ${startup.companyName}:`, error.message);
        skippedCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`✅ Created: ${createdCount} startups`);
    console.log(`⏭️  Skipped: ${skippedCount} startups`);
    console.log(`📝 Total: ${createdCount + skippedCount} startups`);
    console.log(`🔐 Password: ${PASSWORD}`);
    console.log('\n✨ Seeding completed!');

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Database connection closed');
  }
}

// Run seeding
seedStartups();
