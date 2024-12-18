import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import GoogleAuth from './GoogleAuth';
import OnboardingForm from './OnboardingForm';
import BiometricSetup from './BiometricSetup';
import BiometricPrompt from './BiometricPrompt';
import styled from 'styled-components';
import axios from 'axios';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(to bottom right, #C9E4CA, #87BBA2, #55828B);
`;

const ContentContainer = styled.div`
  padding: 2rem;
`;

const AuthContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Layout = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [needsBiometricSetup, setNeedsBiometricSetup] = useState(false);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkUserProfile = async () => {
      const token = localStorage.getItem('googleToken');
      const userData = localStorage.getItem('userData');
      
      if (!token || !userData) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        setIsAuthenticated(true);
        const { googleId } = JSON.parse(userData);
        const response = await axios.get(`https://fitx-6cyg.onrender.com/api/users/${googleId}`);
        const user = response.data.data;
        
        const needsOnboarding = !user.age || !user.weight || !user.height || !user.goals;
        setNeedsOnboarding(needsOnboarding);
        
        if (!needsOnboarding && !user.mfaEnabled) {
          setNeedsBiometricSetup(true);
        } else if (!needsOnboarding && user.mfaEnabled) {
          setShowBiometricPrompt(true);
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
        setNeedsOnboarding(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserProfile();
  }, []);

  const handleBiometricSetupComplete = () => {
    setNeedsBiometricSetup(false);
    setShowBiometricPrompt(true);
  };

  const handleBiometricSuccess = () => {
    setShowBiometricPrompt(false);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </PageContainer>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <Navbar />
        <AuthContainer>
          <h2 className="text-xl font-bold text-[#364958] mb-4">Sign in to continue</h2>
          <GoogleAuth />
        </AuthContainer>
      </PageContainer>
    );
  }

  if (needsOnboarding) {
    return <OnboardingForm />;
  }

  if (needsBiometricSetup) {
    return (
      <PageContainer>
        <Navbar />
        <div className="container mx-auto max-w-md mt-10">
          <BiometricSetup onSetupComplete={handleBiometricSetupComplete} />
        </div>
      </PageContainer>
    );
  }

  if (showBiometricPrompt) {
    return (
      <BiometricPrompt
        onSuccess={handleBiometricSuccess}
        onCancel={() => {
          localStorage.removeItem('googleToken');
          window.location.reload();
        }}
      />
    );
  }

  if (location.pathname === '/') {
    return <Navigate to="/home" replace />;
  }

  return (
    <PageContainer>
      <Navbar />
      <ContentContainer>
        <Outlet />
      </ContentContainer>
    </PageContainer>
  );
};

export default Layout;