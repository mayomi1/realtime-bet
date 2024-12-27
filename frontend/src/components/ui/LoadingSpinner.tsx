import React from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: SpinnerSize;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
    </div>
  );
};

export default LoadingSpinner;
