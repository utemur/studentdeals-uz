import Link from 'next/link';

interface LogoProps {
  locale?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
};

export function Logo({ locale = 'ru', className = '', size = 'md', showText = true }: LogoProps) {
  return (
    <Link href={`/${locale}`} className={`group flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - Graduation Cap with Silk Road colors */}
      <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-soft`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className="w-3/5 h-3/5 text-white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Graduation cap */}
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      </div>
      
      {showText && (
        <div>
          <h1 className={`${textSizeClasses[size]} font-display font-bold bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent group-hover:from-brand-700 group-hover:to-brand-900 transition-all duration-300`}>
            StudentDeals.uz
          </h1>
          <p className="text-xs text-gray-500 font-medium -mt-1">
            {locale === 'ru' ? 'Экономьте вместе с нами' : 'Biz bilan tejang'}
          </p>
        </div>
      )}
    </Link>
  );
}

export function LogoIcon({ size = 'md', className = '' }: Pick<LogoProps, 'size' | 'className'>) {
  return (
    <div className={`${sizeClasses[size]} bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-soft ${className}`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        className="w-3/5 h-3/5 text-white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    </div>
  );
}

