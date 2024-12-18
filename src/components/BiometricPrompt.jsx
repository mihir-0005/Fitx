import React, { useState } from 'react';
import { Fingerprint, Loader } from 'lucide-react';
import { startAuthentication } from '@simplewebauthn/browser';
import styled from 'styled-components';

const OverlayContainer = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, rgba(201, 228, 202, 0.95), rgba(135, 187, 162, 0.95), rgba(85, 130, 139, 0.95));
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PromptCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  width: 220px; /* Reduced width */
  height: 220px; /* Reduced height */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 1rem; /* Reduced padding */
`;

const Title = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  color: #364958;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #4B5563;
  margin-bottom: 1rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const VerifyButton = styled.button`
  background: #55828B;
  color: white;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex: 1;
  font-size: 0.875rem;
  transition: transform 0.2s;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #f3f4f6;
  color: #4B5563;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background-color: #e0e7ff;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background-color: #FEE2E2;
  color: #B91C1C;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

export default function BiometricPrompt({ onSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuthenticate = async () => {
    try {
      setLoading(true);
      setError(null);

      const userData = JSON.parse(localStorage.getItem('userData'));

      const optionsRes = await fetch(`https://fitx-6cyg.onrender.com/api/auth/authenticate/${userData.googleId}/challenge`, {
        method: 'POST',
        credentials: 'include',
      });
      const options = await optionsRes.json();

      const credential = await startAuthentication(options);

      const verificationRes = await fetch(`https://fitx-6cyg.onrender.com/api/auth/authenticate/${userData.googleId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential }),
        credentials: 'include',
      });

      const verification = await verificationRes.json();

      if (verification.verified) {
        onSuccess();
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('Error during biometric authentication:', err);
      setError(err.message || 'Authentication failed');
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
          <VerifyButton onClick={handleAuthenticate} disabled={loading}>
            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Fingerprint className="w-5 h-5" />}
            {loading ? 'Verifying...' : 'Verify'}
          </VerifyButton>
          <CancelButton onClick={onCancel} disabled={loading}>Cancel</CancelButton>
        </ButtonContainer>
      </PromptCard>
    </OverlayContainer>
  );
}
