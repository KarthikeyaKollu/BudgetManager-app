const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

let conn = null;

async function connectDB()  {
  if (conn == null) {
    console.log("Creating new connection to the database....");
    conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    return conn;
  }
  console.log(
    "Connection already established, reusing the existing connection"
  );
};

module.exports = { connectDB };