import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function OnboardingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    goals: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      ...formData,
      googleId: JSON.parse(localStorage.getItem('userData')).googleId
    };

    try {
      await axios.post('https://fitx-6cyg.onrender.com/api/users/onboarding', userData);
      navigate('/home');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C9E4CA] via-[#87BBA2] to-[#55828B] flex items-center justify-center p-4">
      <div className="bg-white/90 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-[#364958] mb-6">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goals</label>
            <textarea
              name="goals"
              value={formData.goals}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows="3"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#55828B] text-white py-2 rounded-md hover:bg-[#3B6064] transition-colors"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
}