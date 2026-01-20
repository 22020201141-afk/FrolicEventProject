import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';
import Registration from './models/Registration.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const student = await User.findOne({ email: 'student@test.com' });
    const event = await Event.findOne({}); // Get first event

    if (!student || !event) {
      console.log('No student or event found');
      process.exit(1);
    }

    const existing = await Registration.findOne({ userId: student._id, eventId: event._id });
    if (existing) {
      console.log('Already registered');
      process.exit(0);
    }

    const reg = await Registration.create({
      userId: student._id,
      eventId: event._id,
      paymentStatus: 'PAID',
      status: 'CONFIRMED'
    });

    console.log('Created registration:', reg);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();