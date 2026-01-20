import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const pass = process.env.ADMIN_PASS || 'Admin123!';
    const phone = process.env.ADMIN_PHONE || '9999999999';

    // Delete existing admin
    const deleted = await User.deleteOne({ email });
    if (deleted.deletedCount > 0) {
      console.log('Deleted existing admin user:', email);
    }

    const hashed = await bcrypt.hash(pass, 10);
    const admin = await User.create({ 
      fullName: 'Administrator', 
      email, 
      phone, 
      password: hashed, 
      role: 'Admin', 
      isVerified: true, 
      isActive: true 
    });
    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Status: Active & Verified');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
