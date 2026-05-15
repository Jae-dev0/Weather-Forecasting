'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin`}
        ></div>
        
        {/* Weather icon in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">🌤️</span>
        </div>
      </div>
      
      {message && (
        <p className="mt-4 text-gray-600 animate-pulse">{message}</p>
      )}
    </div>
  );
}
