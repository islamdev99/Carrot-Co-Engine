
const API_BASE_URL = 'http://localhost:5000/api';

export const apiRequest = async (method: string, endpoint: string, data?: any) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: data ? JSON.stringify(data) : undefined,
  };

  return fetch(url, options);
};
