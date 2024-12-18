import React, { useState, useEffect } from 'react';
import { Fingerprint, Loader } from 'lucide-react';
import { registerBiometric } from '../services/webAuthnService';
import { checkBrowserCompatibility, parseWebAuthnError } from '../utils/webAuthnUtils';

export default function BiometricSetup({ onSetupComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    try {
      checkBrowserCompatibility();
    } catch (error) {
      setIsSupported(false);
      setError(error.message);
    }
  }, []);

  const handleSetup = async () => {
    if (!isSupported) return;

    try {
      setLoading(true);
      setError(null);
      
      const userData = JSON.parse(localStorage.getItem('userData'));
      const result = await registerBiometric(userData.googleId);
      
      if (result.verified) {
        onSetupComplete();
      } else {
        throw new Error('Verification failed');
      }
    } catch (err) {
      console.error('Biometric setup error:', err);
      setError(parseWebAuthnError(err));
    } finally {
      setLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-red-600 mb-4">Not Supported</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

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