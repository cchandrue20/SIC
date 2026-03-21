const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const tryConnect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected successfully');
      console.log(`Connection State: ${mongoose.connection.readyState} (1=connected)`);
      console.log(`Database: ${mongoose.connection.db.s.namespace.db}`);
    } catch (err) {
      retries++;
      console.error(`❌ MongoDB connection error (attempt ${retries}/${maxRetries}):`, err.message);
      if (retries < maxRetries) {
        console.log(`⏳ Retrying in 5 seconds...`);
        setTimeout(tryConnect, 5000);
      } else {
        console.error('❌ Could not connect to MongoDB after multiple attempts.');
        console.error('📝 Please ensure MongoDB is running or update MONGO_URI in .env');
        console.error('ℹ️  Connection check: Use GET /api/db-check endpoint to verify connection status');
        console.error('ℹ️  The server will continue running but database features will not work.');
      }
    }
  };

  await tryConnect();
};

module.exports = connectDB;
