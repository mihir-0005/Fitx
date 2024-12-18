// Base64URL to ArrayBuffer conversion utilities
export const base64URLToBuffer = (base64URL) => {
    const base64 = base64URL.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (base64.length % 4)) % 4;
    const padded = base64.padEnd(base64.length + padLen, '=');
    
    const binary = atob(padded);
    const buffer = new Uint8Array(binary.length);
    
    for (let i = 0; i < binary.length; i++) {
      buffer[i] = binary.charCodeAt(i);
    }
    
    return buffer;
  };
  
  export const bufferToBase64URL = (buffer) => {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };