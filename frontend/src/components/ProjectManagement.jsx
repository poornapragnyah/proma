import React from 'react';
import { Activity, FolderOpen } from 'lucide-react';
import Card from './Card';

const CircularProgress = ({ value, label, sublabel }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - value) / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="fill-none stroke-[#e2f8fd]"
            strokeWidth="12"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            className="fill-none stroke-[#3ccbe7]"
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <span className="text-3xl font-bold text-gray-700">{value}%</span>
        </div>
      </div>
      <div className="text-center mt-4">
        <div className="text-lg font-semibold">{label}</div>
        <div className="text-gray-600 text-sm">{sublabel}</div>
      </div>
    </div>
  );
};

const ProjectDashboard = (props) => {
const activeRatio = Math.floor((props.active / props.total) * 1000) / 10;

  return (
    <div className="flex gap-6 flex-wrap">
      <Card 
        name="Active Projects"
        svg={<Activity className="ml-2 h-6 w-6" />}
        description={
          <CircularProgress 
            value={activeRatio}
            label={`${props.active} Active Projects`}
            sublabel={`Out of ${props.total} total`}
          />
        }
        button="View Active Projects"
      />

      <Card 
        name="Project Progress"
        svg={<FolderOpen className="ml-2 h-6 w-6" />}
        description={
          <CircularProgress 
            value={75}
            label="Overall Progress"
            sublabel="Project completion rate"
          />
        }
        button="View All"
      />
    </div>
  );
};

export default ProjectDashboard;