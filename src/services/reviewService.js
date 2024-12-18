import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://fitx-6cyg.onrender.com/api';

export const createReview = async (reviewData) => {
  try {
    const response = await axios.post(`${API_URL}/reviews`, reviewData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

export const getReviews = async () => {
  try {
    const response = await axios.get(`${API_URL}/reviews`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};