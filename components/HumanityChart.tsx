import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, PolarRadiusAxis } from 'recharts';
import { StageData, ProjectPhase } from '../types';

interface Props {
  stages: Record<ProjectPhase, StageData>;
}

const HumanityChart: React.FC<Props> = ({ stages }) => {
  const data = (Object.values(stages) as StageData[]).map(stage => ({
    subject: stage.phase,
    A: stage.peerRating, // The rating
    fullMark: 20,
  }));

  return (
    <div className="h-64 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
          <PolarRadiusAxis angle={30} domain={[0, 20]} tick={false} axisLine={false} />
          <Radar
            name="Humanity"
            dataKey="A"
            stroke="#2563eb"
            strokeWidth={2}
            fill="#3b82f6"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HumanityChart;