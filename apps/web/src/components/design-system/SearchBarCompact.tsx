import React from 'react';
import { cn } from '@/lib/utils';

interface SearchBarCompactProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onSearch?: (query: string) => void;
  placeholder?: string;
}

export const SearchBarCompact: React.FC<SearchBarCompactProps> = ({
  className,
  onSearch,
  placeholder = "Поиск...",
  ...props
}) => {
  const [query, setQuery] = React.useState(props.value || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query as string);
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          {...props}
        />
      </div>
    </form>
  );
};
