import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6D28D9',
          dark: '#5B21B6',
          light: '#EDE9FE',
        },
      },
    },
  },
  plugins: [],
};

export default config;
