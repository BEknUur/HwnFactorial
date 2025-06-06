import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  darkMode: 'class',                              
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },

      
      colors: {
        primary: '#0088cc',
        'light-blue': '#5da9eb',
        'dark-blue': '#0068b3',

        'bg-primary': '#ffffff',
        'bg-secondary': '#f4f4f5',
        'text-primary': '#000000',
        'text-secondary': '#707579',
        'border-color': '#e4e4e7',
        'message-out': '#ffe0de',
        'message-in': '#ffffff',

        
        'dark-bg': '#1e1e22',
        'dark-panel': '#27272a',
        'dark-border': '#3f3f46',
        'dark-text': '#e4e4e7',
        'dark-text-secondary': '#9ca3af',
        'dark-message-in': '#2f2f33',
        'dark-message-out': '#404047',
      },
    },
  },
  plugins: [],
};
