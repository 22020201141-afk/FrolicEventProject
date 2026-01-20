import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Event from './models/Event.js';
import Registration from './models/Registration.js';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('Users:');
    const users = await User.find({});
    users.forEach(u => console.log(`- ${u.fullName} (${u.email}) - ${u.role}`));

    console.log('\nEvents:');
    const events = await Event.find({});
    events.forEach(e => console.log(`- ${e.name} (${e._id})`));

    console.log('\nRegistrations:');
    const regs = await Registration.find({}).populate('eventId').populate('userId');
    regs.forEach(r => console.log(`- ${r.userId?.fullName} registered for ${r.eventId?.name} (${r.status})`));

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

run();