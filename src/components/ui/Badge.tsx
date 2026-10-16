import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'purple' | 'gray' | 'dark' | 'outline' | 'sample' | 'green';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1 font-medium',
    md: 'text-xs px-3 py-1 gap-1.5 font-medium',
  }[size];

  const variantStyles = {
    purple: 'bg-violet-950/60 text-violet-300 border border-violet-500/30 shadow-sm shadow-violet-950/40',
    gray: 'bg-white/5 text-gray-300 border border-white/10',
    dark: 'bg-[#151519] text-gray-400 border border-white/5',
    outline: 'bg-transparent text-gray-300 border border-white/15',
    sample: 'bg-amber-950/40 text-amber-300/90 border border-amber-500/30 text-[10px] uppercase tracking-wider',
    green: 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-950/40',
  }[variant];

  return (
    <span className={`inline-flex items-center rounded-full tracking-wide ${sizeStyles} ${variantStyles} ${className}`}>
      {icon && <span className="opacity-80">{icon}</span>}
      {children}
    </span>
  );
};
