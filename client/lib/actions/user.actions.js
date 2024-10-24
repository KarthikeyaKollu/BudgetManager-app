const host = process.env.NEXT_PUBLIC_HOST_API;

// Utility functions for encoding and decoding
const encodeToken = (userId) => {
  return btoa(userId); // Encode to Base64
};



export async function createUser(userData) {
  try {
    const response = await fetch(`${host}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) throw new Error('Failed to create user');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getUsers(userId) {
  try {
    const response = await fetch(`${host}/users`, {
      headers: {
        'Authorization': `Bearer ${encodeToken(userId)}`, // Add encoded user ID to headers
      },
    });

    if (!response.ok) throw new Error('Failed to fetch users');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function updateUser(userId) {
  try {
    const response = await fetch(`${host}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${encodeToken(userId)}`, // Add encoded user ID to headers
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) throw new Error('Failed to update user');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function deleteUser(userId) {
  try {
    const response = await fetch(`${host}/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${encodeToken(userId)}`, // Add encoded user ID to headers
      },
    });

    if (!response.ok) throw new Error('Failed to delete user');

  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getUserById(userId) {
  try {
    const response = await fetch(`${host}/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${encodeToken(userId)}`, // Add encoded user ID to headers
      },
    });

    if (!response.ok) throw new Error('Failed to fetch user');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
