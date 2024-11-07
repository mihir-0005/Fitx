import React from 'react';
import styled from 'styled-components';
import ProgressBar from './ProgressBar';
import { ChevronRight } from 'lucide-react';

interface ActivityCardProps {
  title: string;
  metrics: {
    label: string;
    value: number;
    max: number;
    color?: string;
    icon?: React.ReactNode;
  }[];
}

const Card = styled.div`
  padding: 1.5rem;
  background: linear-gradient(to right, #55828B, #3B6064);
  border-radius: 0.5rem;
  color: white;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const Title = styled.h3`
  font-weight: 600;
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  text-align: center;
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 0.5rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
`;

const ChevronIcon = styled(ChevronRight)`
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ActivityCard: React.FC<ActivityCardProps> = ({ title, metrics }) => {
  return (
    <Card>
      <Title>
        {title}
        <ChevronIcon size={20} />
      </Title>
      <MetricsGrid>
        {metrics.map((metric, index) => (
          <MetricItem key={index}>
            <IconWrapper>{metric.icon}</IconWrapper>
            <ProgressBar
              value={metric.value}
              max={metric.max}
              color={metric.color}
            />
            <MetricLabel>{metric.label}</MetricLabel>
            <MetricValue>
              {metric.value.toLocaleString()} / {metric.max.toLocaleString()}
            </MetricValue>
          </MetricItem>
        ))}
      </MetricsGrid>
    </Card>
  );
};

export default ActivityCard;