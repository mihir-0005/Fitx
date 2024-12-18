const isDevelopment = process.env.NODE_ENV !== 'production';

const corsConfig = {
  origin: isDevelopment ? 'https://fitx-1-qqim.onrender.com' : process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default corsConfig;