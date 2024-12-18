import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import { base64URLToBuffer } from '../utils/base64Utils';

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

const prepareRegistrationOptions = (options) => {
  return {
    ...options,
    challenge: base64URLToBuffer(options.challenge),
    user: options.user ? {
      ...options.user,
      id: base64URLToBuffer(options.user.id)
    } : undefined,
    excludeCredentials: options.excludeCredentials?.map(credential => ({
      ...credential,
      id: base64URLToBuffer(credential.id)
    }))
  };
};

const prepareAuthenticationOptions = (options) => {
  return {
    ...options,
    challenge: base64URLToBuffer(options.challenge),
    allowCredentials: options.allowCredentials?.map(credential => ({
      ...credential,
      id: base64URLToBuffer(credential.id)
    }))
  };
};

export const registerBiometric = async (googleId) => {
  try {
    const optionsResponse = await fetch(`${API_URL}/auth/register/${googleId}/challenge`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const options = await handleApiResponse(optionsResponse);
    const preparedOptions = prepareRegistrationOptions(options);
    const credential = await startRegistration(preparedOptions);

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
    throw new WebAuthnError(
      error.message || 'Failed to register biometric authentication',
      'REGISTRATION_ERROR'
    );
  }
};

export const authenticateBiometric = async (googleId) => {
  try {
    const optionsResponse = await fetch(`${API_URL}/auth/authenticate/${googleId}/challenge`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const options = await handleApiResponse(optionsResponse);
    const preparedOptions = prepareAuthenticationOptions(options);
    const credential = await startAuthentication(preparedOptions);

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
    throw new WebAuthnError(
      error.message || 'Failed to authenticate using biometrics',
      'AUTHENTICATION_ERROR'
    );
  }
};