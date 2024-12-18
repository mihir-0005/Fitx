import dotenv from 'dotenv';

dotenv.config();

const isDevelopment = process.env.NODE_ENV !== 'production';

export const webAuthnConfig = {
  rpName: 'FitTrack',
  rpID: isDevelopment ? 'fitx-1-qqim.onrender.com' : process.env.DOMAIN,
  origin: isDevelopment ? 'https://fitx-1-qqim.onrender.com' : `https://${process.env.DOMAIN}`,
  expectedOrigin: isDevelopment ? 'https://fitx-1-qqim.onrender.com' : `https://${process.env.DOMAIN}`,
};

export const authenticatorSelection = {
  authenticatorAttachment: 'platform',
  userVerification: 'preferred',
  requireResidentKey: false,
};