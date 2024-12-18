import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://fitx-6cyg.onrender.com/api';

export const createChallenge = async (challengeData) => {
  try {
    const response = await axios.post(`${API_URL}/challenges`, challengeData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw error;
  }
};

export const getChallenges = async () => {
  try {
    const response = await axios.get(`${API_URL}/challenges`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw error;
  }
};

export const joinChallenge = async (challengeId, userData) => {
  try {
    const response = await axios.post(`${API_URL}/challenges/${challengeId}/join`, userData);
    return response.data.data;
  } catch (error) {
    console.error('Error joining challenge:', error);
    throw error;
  }
};