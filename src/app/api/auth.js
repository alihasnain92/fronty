const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  return data;
};

export const resetPassword = async (email) => {
  const response = await fetch(`${API_URL}/forgot-password/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  if (!response.ok) {
    throw new Error('Password reset request failed');
  }
  
  const data = await response.json();
  return data;
};