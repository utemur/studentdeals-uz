import * as React from 'react';
import { cn } from '../lib/cn';

type Sizes = 'sm'|'md'|'lg'|'xl'|'full';
const sizes: Record<Sizes, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  full: 'max-w-full'
};

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: Sizes;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mx-auto px-4', sizes[size], className)}
      {...props}
    />
  )
);
Container.displayName = 'Container';
