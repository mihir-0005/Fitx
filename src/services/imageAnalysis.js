import axios from 'axios';
import { validateImageFile, fileToBase64 } from '../utils/imageUtils';

const API_URL = 'https://fitx-6cyg.onrender.com/api';

export const analyzeImage = async (imageFile) => {
  try {
    validateImageFile(imageFile);
    const base64Image = await fileToBase64(imageFile);
    
    const response = await axios.post(`${API_URL}/analyze-image`, {
      base64Image
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to analyze image');
    }
    throw error;
  }
};