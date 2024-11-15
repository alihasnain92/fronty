const API_URL = 'http://localhost:8000/api';

export async function sendMessage(message) {
  try {
    const response = await fetch(`${API_URL}/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: message }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}