import { useTheme } from "../contexts/ThemeContext";
import { useState } from "react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    toggle();
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="relative group">
      {/* Floating background glow */}
      <div className={`absolute -inset-2 rounded-2xl transition-all duration-500 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30' 
          : 'bg-gradient-to-r from-yellow-300/30 via-orange-300/30 to-red-300/30'
      } blur-xl opacity-0 group-hover:opacity-100`}></div>
      
      {/* Main toggle button */}
      <button
        onClick={handleToggle}
        className={`relative flex items-center justify-center w-16 h-16 rounded-2xl transition-all duration-500 hover:scale-110 focus:outline-none focus:ring-4 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 focus:ring-purple-400/30 shadow-2xl shadow-indigo-500/20'
            : 'bg-gradient-to-br from-amber-200 via-yellow-200 to-orange-200 focus:ring-yellow-400/30 shadow-2xl shadow-yellow-500/20'
        } group-hover:shadow-2xl ${
          isAnimating ? 'animate-pulse' : ''
        }`}
      >
        {/* Inner glow effect */}
        <div className={`absolute inset-1 rounded-xl transition-all duration-500 ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-slate-600/50 to-slate-800/50'
            : 'bg-gradient-to-br from-yellow-100/50 to-orange-100/50'
        }`}></div>

        {/* Icon container with 3D effect */}
        <div className={`relative z-10 transition-all duration-700 ${
          isAnimating ? 'rotate-180 scale-125' : 'group-hover:scale-110'
        }`}>
          {theme === 'light' ? (
            // Moon icon for dark mode
            <div className="relative">
              {/* Moon */}
              <svg className="w-7 h-7 text-slate-700 transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
              </svg>
              {/* Stars around moon */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-slate-600 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-slate-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          ) : (
            // Sun icon for light mode
            <div className="relative">
              {/* Sun center */}
              <div className="w-6 h-6 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full shadow-lg shadow-yellow-500/50 animate-pulse"></div>
              
              {/* Sun rays */}
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-0.5 h-3 bg-gradient-to-t from-yellow-400 to-orange-300 rounded-full`}
                    style={{
                      top: '-8px',
                      left: '50%',
                      transformOrigin: '50% 20px',
                      transform: `translateX(-50%) rotate(${i * 45}deg)`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Ripple effect on click */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isAnimating 
            ? theme === 'dark'
              ? 'bg-purple-400/20 animate-ping'
              : 'bg-yellow-400/20 animate-ping'
            : ''
        }`}></div>
      </button>

      {/* Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
        <div className="glass-effect px-3 py-2 rounded-lg text-sm text-white/80 whitespace-nowrap">
          {theme === 'light' ? 'Темная тема' : 'Светлая тема'}
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white/10 rotate-45"></div>
        </div>
      </div>

      {/* Floating particles effect */}
      {isAnimating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 rounded-full animate-ping ${
                theme === 'dark' ? 'bg-purple-400' : 'bg-yellow-400'
              }`}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
}