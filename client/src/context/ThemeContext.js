import { createContext } from 'react';

export const ThemeContext = createContext();

// Re-export ThemeProvider from ThemeContext.jsx
export { ThemeProvider } from './ThemeContext.jsx';