import React, { useState, useEffect } from 'react';
import { Fingerprint, Loader } from 'lucide-react';
import { authenticateBiometric } from '../services/webAuthnService';
import { checkBrowserCompatibility, parseWebAuthnError } from '../utils/webAuthnUtils';
import styled from 'styled-components';

const OverlayContainer = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const PromptCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 28rem;
  width: 90%;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #364958;
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: #4b5563;
  margin-bottom: 1.5rem;
`;

const ErrorMessage = styled.div`
  background-color: #fee2e2;
  border: 1px solid #ef4444;
  color: #b91c1c;
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const VerifyButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #55828B;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #3B6064;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: transparent;
  color: #4b5563;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f3f4f6;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

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