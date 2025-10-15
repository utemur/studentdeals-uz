import { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700 border-gray-200',
  primary: 'bg-brand-50 text-brand-700 border-brand-200',
  secondary: 'bg-amber-50 text-amber-700 border-amber-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md', 
  className = '',
  icon 
}: BadgeProps) {
  return (
    <span 
      className={`
        inline-flex items-center gap-1 font-medium rounded-lg border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
}

// Специализированные бейджи для частых случаев
export function DiscountBadge({ percentage, className = '' }: { percentage: number; className?: string }) {
  return (
    <Badge variant="danger" size="md" className={`font-bold ${className}`}>
      -{percentage}%
    </Badge>
  );
}

export function StudentOnlyBadge({ locale = 'ru', className = '' }: { locale?: string; className?: string }) {
  return (
    <Badge 
      variant="primary" 
      size="sm" 
      className={className}
      icon={
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
        </svg>
      }
    >
      {locale === 'ru' ? 'Только студентам' : 'Faqat talabalar uchun'}
    </Badge>
  );
}

export function VerifiedBadge({ locale = 'ru', className = '' }: { locale?: string; className?: string }) {
  return (
    <Badge 
      variant="success" 
      size="sm" 
      className={className}
      icon={
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      }
    >
      {locale === 'ru' ? 'Проверено' : 'Tasdiqlangan'}
    </Badge>
  );
}

export function NewBadge({ locale = 'ru', className = '' }: { locale?: string; className?: string }) {
  return (
    <Badge variant="warning" size="sm" className={`animate-pulse ${className}`}>
      {locale === 'ru' ? 'Новинка' : 'Yangi'}
    </Badge>
  );
}

export function OnlineBadge({ locale = 'ru', className = '' }: { locale?: string; className?: string }) {
  return (
    <Badge variant="info" size="sm" className={className}>
      {locale === 'ru' ? 'Онлайн' : 'Onlayn'}
    </Badge>
  );
}

export function OfflineBadge({ locale = 'ru', className = '' }: { locale?: string; className?: string }) {
  return (
    <Badge variant="default" size="sm" className={className}>
      {locale === 'ru' ? 'Оффлайн' : 'Oflayn'}
    </Badge>
  );
}

