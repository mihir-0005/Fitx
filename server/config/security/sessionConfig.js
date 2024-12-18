const isDevelopment = process.env.NODE_ENV !== 'production';

const sessionConfig = (mongoStore) => ({
  secret: process.env.SESSION_SECRET || '8c0d1a9e4b7f6d2e5c3a8b1d9f7e4c2a5b8d3f6e9c2a5b8d3f6e9c2a5b8d3f6',
  resave: false,
  saveUninitialized: true,
  store: mongoStore,
  cookie: {
    secure: !isDevelopment,
    sameSite: isDevelopment ? 'lax' : 'none',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    httpOnly: true
  }
});

export default sessionConfig;