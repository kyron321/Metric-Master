import React, { useEffect, useState } from 'react';

interface CircleProgressProps {
  score: number;
  label: string;
}

const CircleProgress: React.FC<CircleProgressProps> = ({ score, label }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  const [offset, setOffset] = useState(circumference);

  // Determine stroke color based on the score
  const strokeColor = score >= 90 ? 'green' : score >= 50 ? 'orange' : 'red';

  useEffect(() => {
    const progressOffset = circumference - (score / 100) * circumference;
    
    // Animate the circle offset after the component has mounted
    const animate = () => {
      setOffset(progressOffset);
    };

    const timeout = setTimeout(animate, 100); // Delayed start for smoothness

    return () => clearTimeout(timeout);
  }, [circumference, score]);

  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" className="mb-2">
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="gray"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke={strokeColor}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          style={{
            transition: 'stroke-dashoffset 1s ease-in-out', // Slower transition of 1 second
          }}
        />
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dy=".3em"
          fontSize="20"
          fill="white"
        >
          {score}
        </text>
      </svg>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );
};

export default CircleProgress;
