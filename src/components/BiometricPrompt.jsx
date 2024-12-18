import React, { useState, useEffect } from 'react';
import { Fingerprint, Loader } from 'lucide-react';
import { authenticateBiometric } from '../services/webAuthnService';
import { checkBrowserCompatibility, parseWebAuthnError } from '../utils/webAuthnUtils';
import styled from 'styled-components';

// ... (styled components remain the same)

export default function BiometricPrompt({ onSuccess, onCancel }) {
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

  const handleAuthenticate = async () => {
    if (!isSupported) return;

    try {
      setLoading(true);
      setError(null);

      const userData = JSON.parse(localStorage.getItem('userData'));
      const result = await authenticateBiometric(userData.googleId);

      if (result.verified) {
        onSuccess();
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('Biometric authentication error:', err);
      setError(parseWebAuthnError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <OverlayContainer>
      <PromptCard>
        <Title>Biometric Authentication</Title>
        <Description>
          Please verify your identity using your device's biometric authentication.
        </Description>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <ButtonContainer>
          <VerifyButton onClick={handleAuthenticate} disabled={loading || !isSupported}>
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Fingerprint className="w-5 h-5" />}
            {loading ? 'Verifying...' : 'Verify'}
          </VerifyButton>
          <CancelButton onClick={onCancel} disabled={loading}>Cancel</CancelButton>
        </ButtonContainer>
      </PromptCard>
    </OverlayContainer>
  );
}