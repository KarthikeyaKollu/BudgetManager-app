const host = process.env.NEXT_PUBLIC_HOST_API
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

export async function getUsers() {
  try {
    const response = await fetch(`${host}/users`);

    if (!response.ok) throw new Error('Failed to fetch users');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

export async function updateUser(userId, updatedData) {
  try {
    const response = await fetch(`${host}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
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
    });

    if (!response.ok) throw new Error('Failed to delete user');

  } catch (error) {
    console.error('Error:', error);
  }
}

export async function getUserById(userId) {
  try {
    const response = await fetch(`${host}/users/${userId}`);

    if (!response.ok) throw new Error('Failed to fetch user');

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
