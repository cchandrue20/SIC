require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@gmail.com' });
    if (existing) {
      console.log('Admin account already exists:', existing.email, '| role:', existing.role);
      const salt = await bcrypt.genSalt(10);
      existing.password = await bcrypt.hash('Admin@123', salt);
      existing.role = 'admin';
      existing.isActive = true;
      await existing.save();
      console.log('Updated admin password to Admin@123 and ensured role=admin and isActive=true');
      console.log('Final state in DB:', { email: existing.email, role: existing.role, isActive: existing.isActive });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin@123', salt);
      const admin = await User.create({
        email: 'admin@gmail.com',
        password: hashedPassword,
        role: 'admin',
        isActive: true,
      });
      console.log('Admin account created:', admin.email, '| role:', admin.role);
    }

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
