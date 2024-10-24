const User = require('../models/userModel');
const { connectDB } = require('../database/db');

const decodeToken = (token) => {
  try {
    return atob(token); // Decode from Base64
  } catch (error) {
    throw new Error('Failed to decode token');
  }
};

const verifyUser = async (event) => {
  try {
    const authHeader = event.headers.Authorization || event.headers.authorization;
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
    const decodedToken = decodeToken(token); // Decode the token

    if (!decodedToken) {
      throw new Error('Invalid token');
    }

    await connectDB(); // Ensure DB connection

    const user = await User.findOne({ clerkId: decodedToken }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error('Error in verifyUser:', error);
    throw new Error('User verification failed');
  }
};

// CREATE User
module.exports.createUser = async (event) => {
  try {
    const { clerkId, email, username, firstName, lastName, photo } = JSON.parse(event.body);

    if (!clerkId || !email || !username || !firstName || !lastName) {
      return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    await connectDB(); // Ensure DB connection

    const newUser = new User({ clerkId, email, username, firstName, lastName, photo });
    await newUser.save();

    return { statusCode: 201, body: JSON.stringify(newUser) };
  } catch (error) {
    console.error('Error creating user:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error creating user' }) };
  }
};

// READ Users
module.exports.getUsers = async (event) => {
  try {
    await connectDB(); // Ensure DB connection
    await verifyUser(event); // Verify user before proceeding


    const users = await User.find({});
    return { statusCode: 200, body: JSON.stringify(users) };
  } catch (error) {
    console.error('Error fetching users:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error fetching users' }) };
  }
};

// UPDATE User
module.exports.updateUser = async (event) => {
  try {
    const { id } = event.pathParameters; // Assuming 'id' is the clerkId
    const { email, username, firstName, lastName, photo } = JSON.parse(event.body);
    await connectDB(); // Ensure DB connection
    await verifyUser(event); // Verify user before proceeding


    const updatedUser = await User.findOneAndUpdate(
      { clerkId: id }, // Find user by clerkId
      { email, username, firstName, lastName, photo }, // Fields to update
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }

    return { statusCode: 200, body: JSON.stringify(updatedUser) };
  } catch (error) {
    console.error('Error updating user:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error updating user' }) };
  }
};

// DELETE User
module.exports.deleteUser = async (event) => {
  try {
    const { id } = event.pathParameters; // Assuming 'id' is the clerkId
    await connectDB(); // Ensure DB connection
    await verifyUser(event); // Verify user before proceeding
    

    const deletedUser = await User.findOneAndDelete({ clerkId: id });
    if (!deletedUser) {
      return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) };
    }

    return { statusCode: 200, body: JSON.stringify(deletedUser) };
  } catch (error) {
    console.error('Error deleting user:', error);
    return { statusCode: 500, body: JSON.stringify({ error: 'Error deleting user' }) };
  }
};
