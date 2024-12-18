import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://fitx-6cyg.onrender.com/api';

export const createWorkout = async (workoutData) => {
  try {
    const response = await axios.post(`${API_URL}/workouts`, workoutData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error;
  }
};

export const getWorkouts = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/workouts/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error;
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    const response = await axios.delete(`${API_URL}/workouts/${workoutId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error deleting workout:', error);
    throw error;
  }
};