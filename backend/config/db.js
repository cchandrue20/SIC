const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const tryConnect = async () => {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully');
    } catch (err) {
      retries++;
      console.error(`MongoDB connection error (attempt ${retries}/${maxRetries}):`, err.message);
      if (retries < maxRetries) {
        console.log('Retrying in 5 seconds...');
        setTimeout(tryConnect, 5000);
      } else {
        console.error('Could not connect to MongoDB after multiple attempts.');
        console.error('Please ensure MongoDB is running or update MONGO_URI in .env');
        console.error('The server will continue running but database features will not work.');
      }
    }
  };

  await tryConnect();
};

module.exports = connectDB;
