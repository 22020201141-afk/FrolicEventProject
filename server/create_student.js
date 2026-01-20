import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = 'student@test.com';
    const pass = 'student123';

    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Student user already exists:', email);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(pass, 10);
    const student = await User.create({
      fullName: 'Test Student',
      email,
      phone: '8888888888',
      password: hashed,
      role: 'Student',
      isVerified: true,
      isActive: true
    });
    console.log('Created student user:', student.email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();