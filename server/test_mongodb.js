import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('Testing MongoDB Connection...');
    console.log('MONGO_URI:', process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Connected Successfully!');
    console.log('Host:', conn.connection.host);
    console.log('Name:', conn.connection.name);
    console.log('DB:', conn.connection.db.databaseName);

    // Test a ping
    await mongoose.connection.db.admin().ping();
    console.log('✅ Ping successful!');

    await mongoose.disconnect();
    console.log('✅ Disconnected successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    if (error.codeName) console.error('Code:', error.codeName);
    if (error.code) console.error('Error Code:', error.code);
    process.exit(1);
  }
};

testConnection();
