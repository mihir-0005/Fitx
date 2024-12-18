import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const API_URL = import.meta.env.VITE_API_URL;

class WebAuthnError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'WebAuthnError';
    this.code = code;
  }
}

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new WebAuthnError(error.message || 'API request failed', response.status);
  }
  return response.json();
};

export const registerBiometric = async (googleId) => {
  try {
    // Get registration options
    const optionsResponse = await fetch(`${API_URL}/auth/register/${googleId}/challenge`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const options = await handleApiResponse(optionsResponse);
    console.log('Registration options received:', { ...options, challenge: '...' });

    // Start registration
    const credential = await startRegistration(options);
    console.log('Credential created successfully');

    // Verify registration
    const verificationResponse = await fetch(`${API_URL}/auth/register/${googleId}/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ credential })
    });

    const verification = await handleApiResponse(verificationResponse);
    console.log('Registration verification result:', verification);

    return verification;
  } catch (error) {
    console.error('Biometric registration error:', error);
    if (error instanceof WebAuthnError) {
      throw error;
    }
    throw new WebAuthnError(
      error.message || 'Failed to register biometric authentication',
      'REGISTRATION_ERROR'
    );
  }
};

export const authenticateBiometric = async (googleId) => {
  try {
    // Get authentication options
    const optionsResponse = await fetch(`${API_URL}/auth/authenticate/${googleId}/challenge`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const options = await handleApiResponse(optionsResponse);
    console.log('Authentication options received:', { ...options, challenge: '...' });

    // Start authentication
    const credential = await startAuthentication(options);
    console.log('Authentication credential created successfully');

    // Verify authentication
    const verificationResponse = await fetch(`${API_URL}/auth/authenticate/${googleId}/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ credential })
    });

    const verification = await handleApiResponse(verificationResponse);
    console.log('Authentication verification result:', verification);

    return verification;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    if (error instanceof WebAuthnError) {
      throw error;
    }
    throw new WebAuthnError(
      error.message || 'Failed to authenticate using biometrics',
      'AUTHENTICATION_ERROR'
    );
  }
};