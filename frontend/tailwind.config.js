/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#18181b',  
        secondary: '#262626', 
        tertiary: '',
        accent: '#2e1065',       
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        gordita: ['Gordita', 'sans-serif']
      },
    },
  },
  plugins: [
    forms,
  ],
};
