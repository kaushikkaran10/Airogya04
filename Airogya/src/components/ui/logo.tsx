'use client';

interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-8 h-8" }: LogoProps) {
  return (
    <svg 
      width="120" 
      height="36" 
      viewBox="0 0 120 36" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    > 
      <path 
        d="M55.433 18C55.433 14.167 57.2349 10.765 60 8.56699C57.965 6.96699 55.3981 6 52.5981 6C45.965 6 40.5981 11.367 40.5981 18C40.5981 24.633 45.965 30 52.5981 30C55.3981 30 57.965 29.033 60 27.433C57.2311 25.266 55.433 21.833 55.433 18Z" 
        stroke="currentColor" 
        strokeWidth="2" 
      /> 
      <path 
        d="M79.4019 18C79.4019 24.633 74.035 30 67.4019 30C64.6019 30 62.035 29.033 60 27.433C62.8 25.2311 64.567 21.833 64.567 18C64.567 14.167 62.765 10.765 60 8.56699C62.0311 6.96699 64.5981 6 67.3981 6C74.035 6 79.4019 11.4019 79.4019 18Z" 
        stroke="currentColor" 
        strokeWidth="2" 
      /> 
    </svg>
  );
}