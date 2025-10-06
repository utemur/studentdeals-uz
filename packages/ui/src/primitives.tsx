import * as React from 'react';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' };
export const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg ${variant === 'primary' ? 'bg-black text-white' : 'bg-white text-black border'}`}
  />
);
