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
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const options = await handleApiResponse(optionsResponse);

    // Convert base64URL strings to Uint8Arrays
    options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
    if (options.user) {
      options.user.id = Uint8Array.from(atob(options.user.id), c => c.charCodeAt(0));
    }
    if (options.excludeCredentials) {
      options.excludeCredentials = options.excludeCredentials.map(credential => ({
        ...credential,
        id: Uint8Array.from(atob(credential.id), c => c.charCodeAt(0))
      }));
    }

    // Start registration
    const credential = await startRegistration(options);

    // Verify registration
    const verificationResponse = await fetch(`${API_URL}/auth/register/${googleId}/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credential)
    });

    return await handleApiResponse(verificationResponse);
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
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const options = await handleApiResponse(optionsResponse);

    // Convert base64URL strings to Uint8Arrays
    options.challenge = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));
    if (options.allowCredentials) {
      options.allowCredentials = options.allowCredentials.map(credential => ({
        ...credential,
        id: Uint8Array.from(atob(credential.id), c => c.charCodeAt(0))
      }));
    }

    // Start authentication
    const credential = await startAuthentication(options);

    // Verify authentication
    const verificationResponse = await fetch(`${API_URL}/auth/authenticate/${googleId}/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credential)
    });

    return await handleApiResponse(verificationResponse);
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