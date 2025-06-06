import React, { createContext, useContext, useLayoutEffect, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface Ctx {
  theme: Theme;
  toggle: () => void;
  isTransitioning: boolean;
}

const ThemeContext = createContext<Ctx>({ 
  theme: "light", 
  toggle: () => {}, 
  isTransitioning: false 
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check system preference first, then localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("theme") as Theme;
      if (saved) return saved;
      
      // Auto-detect system theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "dark";
      }
    }
    return "light";
  });
  
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Handle theme transitions with smooth animations
  const toggle = () => {
    setIsTransitioning(true);
    
    // Add transition class to body for smooth theme switching
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    setTheme(prev => prev === "light" ? "dark" : "light");
    
    // Reset transition state
    setTimeout(() => {
      setIsTransitioning(false);
      document.body.style.transition = '';
    }, 300);
  };

  useLayoutEffect(() => {
    const root = document.documentElement;
    
    // Set theme data attribute
    root.dataset.theme = theme;
    
    // Set CSS custom properties for smoother transitions
    if (theme === "dark") {
      root.style.setProperty('--bg-primary', '#0f172a');
      root.style.setProperty('--bg-secondary', '#1e293b');
      root.style.setProperty('--text-primary', '#f8fafc');
      root.style.setProperty('--text-secondary', '#cbd5e1');
      root.style.setProperty('--border-color', '#334155');
      
      // Add dark mode gradient background
      document.body.style.background = `
        linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)
      `;
      document.body.style.minHeight = '100vh';
    } else {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--text-primary', '#1e293b');
      root.style.setProperty('--text-secondary', '#64748b');
      root.style.setProperty('--border-color', '#e2e8f0');
      
      // Add light mode gradient background
      document.body.style.background = `
        linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)
      `;
      document.body.style.minHeight = '100vh';
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Add custom CSS for glass effect
    const styleId = 'theme-glass-styles';
    let existingStyle = document.getElementById(styleId);
    
    if (!existingStyle) {
      existingStyle = document.createElement('style');
      existingStyle.id = styleId;
      document.head.appendChild(existingStyle);
    }
    
    existingStyle.textContent = `
      .glass-effect {
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        background: ${theme === 'dark' ? 'rgba(30, 41, 59, 0.7)' : 'rgba(248, 250, 252, 0.7)'};
        border: 1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.1)' : 'rgba(30, 41, 59, 0.1)'};
        box-shadow: ${theme === 'dark' 
          ? '0 25px 50px -12px rgba(0, 0, 0, 0.5)' 
          : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        };
      }
      
      .glass-card {
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        background: ${theme === 'dark' 
          ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))' 
          : 'linear-gradient(135deg, rgba(248, 250, 252, 0.8), rgba(226, 232, 240, 0.6))'
        };
        border: 1px solid ${theme === 'dark' ? 'rgba(148, 163, 184, 0.15)' : 'rgba(30, 41, 59, 0.15)'};
        box-shadow: ${theme === 'dark' 
          ? '0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2)' 
          : '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)'
        };
      }
      
      /* Smooth transitions for all elements */
      * {
        transition: background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease;
      }
      
      /* Custom scrollbar */
      ::-webkit-scrollbar {
        width: 8px;
      }
      
      ::-webkit-scrollbar-track {
        background: ${theme === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(226, 232, 240, 0.5)'};
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb {
        background: ${theme === 'dark' 
          ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' 
          : 'linear-gradient(135deg, #3b82f6, #6366f1)'
        };
        border-radius: 4px;
      }
      
      ::-webkit-scrollbar-thumb:hover {
        background: ${theme === 'dark' 
          ? 'linear-gradient(135deg, #8b5cf6, #a855f7)' 
          : 'linear-gradient(135deg, #6366f1, #8b5cf6)'
        };
      }
    `;
    
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, isTransitioning }}>
      {/* Theme transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className={`absolute inset-0 transition-opacity duration-300 ${
            theme === 'dark' 
              ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800' 
              : 'bg-gradient-to-br from-sky-100 via-white to-slate-100'
          } animate-pulse`}></div>
        </div>
      )}
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};