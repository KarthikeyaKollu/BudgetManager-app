const User = require('../models/userModel');
const { connectDB } = require('../database/db');

// CREATE User
module.exports.createUser = async (event) => {
  const { clerkId, email, username, firstName, lastName, photo } = JSON.parse(event.body);

  // Validate required fields
  if (!clerkId || !email || !username || !firstName || !lastName) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing required fields" }) };
  }

  await connectDB(); // Ensure DB connection

  const newUser = new User({ clerkId, email, username, firstName, lastName, photo });

  try {
    await newUser.save();
    return { statusCode: 201, body: JSON.stringify(newUser) };
  } catch (error) {
    console.error("Error saving user:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Error creating user" }) };
  }
};


// READ Users
module.exports.getUsers = async () => {
  await connectDB(); // Ensure DB connection

  const users = await User.find({});
  return { statusCode: 200, body: JSON.stringify(users) };
};

// UPDATE User
module.exports.updateUser = async (event) => {
  const { id } = event.pathParameters; // Assuming 'id' is actually the clerkId
  const { email, username, firstName, lastName, photo } = JSON.parse(event.body);

  await connectDB(); // Ensure DB connection

  // Use findOneAndUpdate to find by clerkId
  const updatedUser = await User.findOneAndUpdate(
    { clerkId: id }, // Find user by clerkId
    { email, username, firstName, lastName, photo }, // Fields to update
    { new: true } // Return the updated document
  );

  if (!updatedUser) {
    return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) }; // Handle case when user is not found
  }

  return { statusCode: 200, body: JSON.stringify(updatedUser) }; // Return updated user info
};



// DELETE User
module.exports.deleteUser = async (event) => {
  const { id } = event.pathParameters; // Assuming 'id' is actually the clerkId

  await connectDB(); // Ensure DB connection

  const deletedUser = await User.findOneAndDelete({ clerkId: id }); // Find and delete user by clerkId
  if (!deletedUser) {
    return { statusCode: 404, body: JSON.stringify({ message: 'User not found' }) }; // Handle case when user is not found
  }

  return { statusCode: 200, body: JSON.stringify(deletedUser) }; // Return deleted user info
};
