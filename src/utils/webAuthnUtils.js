export const isWebAuthnSupported = () => {
    return window.PublicKeyCredential !== undefined &&
           typeof window.PublicKeyCredential === 'function';
  };
  
  export const checkBrowserCompatibility = () => {
    if (!isWebAuthnSupported()) {
      throw new Error('WebAuthn is not supported in this browser. Please use a modern browser that supports biometric authentication.');
    }
  
    if (!window.isSecureContext) {
      throw new Error('Biometric authentication requires a secure context (HTTPS).');
    }
  };
  
  export const parseWebAuthnError = (error) => {
    if (error.name === 'NotAllowedError') {
      return 'Operation was denied by the user or the security key.';
    }
    if (error.name === 'SecurityError') {
      return 'The operation failed for security reasons.';
    }
    if (error.name === 'AbortError') {
      return 'The operation was aborted.';
    }
    if (error.name === 'NotSupportedError') {
      return 'This operation is not supported by your browser or device.';
    }
    return error.message || 'An unknown error occurred.';
  };