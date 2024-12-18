import React, { useState } from 'react';
import { Fingerprint, Loader } from 'lucide-react';
import { startRegistration } from '@simplewebauthn/browser';

export default function BiometricSetup({ onSetupComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSetup = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = JSON.parse(localStorage.getItem('userData'));
      
      // Get registration options from server
      const optionsRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/${userData.googleId}/challenge`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!optionsRes.ok) {
        throw new Error('Failed to get registration options');
      }

      const options = await optionsRes.json();

      // Start registration process
      const credential = await startRegistration(options);

      // Verify registration with server
      const verificationRes = await fetch(`${import.meta.env.VITE_API_URL}/auth/register/${userData.googleId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
        credentials: 'include'
      });

      if (!verificationRes.ok) {
        throw new Error('Failed to verify registration');
      }

      const verification = await verificationRes.json();

      if (verification.verified) {
        onSetupComplete();
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      console.error('Error setting up biometric authentication:', err);
      setError(err.message || 'Failed to set up biometric authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-[#364958] mb-4">Set Up Biometric Authentication</h2>
      <p className="text-gray-600 mb-6">
        Enhance your account security by adding biometric authentication. 
        This will allow you to sign in using your device's fingerprint sensor or facial recognition.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handleSetup}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#55828B] text-white py-3 rounded-lg hover:bg-[#3B6064] transition-colors disabled:opacity-50"
      >
        {loading ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          <Fingerprint className="w-5 h-5" />
        )}
        {loading ? 'Setting up...' : 'Set Up Biometric Authentication'}
      </button>
    </div>
  );
}