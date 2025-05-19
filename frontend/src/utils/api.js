import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const startProcessing = async (path) => {
  try {
    const response = await axios.post(`${API_BASE}/start`, { path });
    return response.data;
  } catch (error) {
    throw new Error('Failed to start processing');
  }
};

export const getStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE}/status`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch status');
  }
};