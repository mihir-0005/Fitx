import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import DashboardCard from '../components/DashboardCard';
import StatCard from '../components/StatCard';
import axios from 'axios';
import { Activity, Target, Award, TrendingUp, Scale, Ruler, Calendar, Flag } from 'lucide-react';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #C9E4CA, #87BBA2, #55828B);
`;

const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
`;

const WelcomeSection = styled.div`
  margin-bottom: 2rem;
  color: #364958;
`;

const Greeting = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  opacity: 0.9;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  margin-top: 0.5rem;
  overflow: hidden;
`;

const Progress = styled.div`
  width: ${props => props.$progress}%;
  height: 100%;
  background: ${props => props.$color || '#55828B'};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const MetricValue = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
`;

const MetricLabel = styled.div`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
`;

const MetricHighlight = styled.span`
  color: #87BBA2;
  font-weight: 600;
`;

export default function Home() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const response = await axios.get(`https://fitx-6cyg.onrender.com/api/users/${userData.googleId}`);
        setUserProfile(response.data.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <Navbar />
        <DashboardContainer>
          <div className="text-center text-white text-xl">Loading...</div>
        </DashboardContainer>
      </PageContainer>
    );
  }

  // Calculate BMI
  const heightInMeters = userProfile.height / 100;
  const bmi = (userProfile.weight / (heightInMeters * heightInMeters)).toFixed(1);

  // Calculate ideal weight range
  const idealWeightLow = (18.5 * heightInMeters * heightInMeters).toFixed(1);
  const idealWeightHigh = (24.9 * heightInMeters * heightInMeters).toFixed(1);

  return (
    <PageContainer>
      <Navbar />
      <DashboardContainer>
        <WelcomeSection>
          <Greeting>Welcome back, {userProfile.name}! 👋</Greeting>
          <Subtitle>Track your progress and achieve your fitness goals</Subtitle>
        </WelcomeSection>

        <Grid>
          <StatCard
            icon={<Scale size={24} />}
            label="Current Weight"
            value={`${userProfile.weight} kg`}
          />
          <StatCard
            icon={<Ruler size={24} />}
            label="Height"
            value={`${userProfile.height} cm`}
          />
          <StatCard
            icon={<Calendar size={24} />}
            label="Age"
            value={`${userProfile.age} years`}
          />
          <StatCard
            icon={<Activity size={24} />}
            label="BMI"
            value={bmi}
          />
        </Grid>

        <Grid>
          <DashboardCard title="Body Mass Index (BMI)">
            <div>
              <MetricLabel>Current BMI: <MetricHighlight>{bmi}</MetricHighlight></MetricLabel>
              <ProgressBar>
                <Progress $progress={Math.min((bmi / 30) * 100, 100)} $color="#55828B" />
              </ProgressBar>
              <MetricValue>
                <span>Underweight</span>
                <span>Normal</span>
                <span>Overweight</span>
              </MetricValue>
            </div>
          </DashboardCard>

          <DashboardCard title="Weight Range">
            <div>
              <MetricLabel>Ideal Weight Range:</MetricLabel>
              <div className="text-lg font-semibold text-[#87BBA2]">
                {idealWeightLow} - {idealWeightHigh} kg
              </div>
              <ProgressBar>
                <Progress 
                  $progress={Math.min(
                    ((userProfile.weight - idealWeightLow) / (idealWeightHigh - idealWeightLow)) * 100,
                    100
                  )}
                  $color="#55828B"
                />
              </ProgressBar>
            </div>
          </DashboardCard>

          <DashboardCard title="Fitness Goals">
            <div className="space-y-2">
              {userProfile.goals.split('\n').map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Target size={16} className="text-[#87BBA2]" />
                  <span className="text-white/90">{goal}</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </Grid>
      </DashboardContainer>
    </PageContainer>
  );
}