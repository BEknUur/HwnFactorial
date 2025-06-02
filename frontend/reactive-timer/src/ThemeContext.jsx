import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext({

  isDarkTheme: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() =>
    localStorage.getItem("dark") === "true"
  );

  useEffect(() => {
    localStorage.setItem("dark", isDarkTheme);
  }, [isDarkTheme]);

  const toggleTheme = () => setIsDarkTheme((p) => !p);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
