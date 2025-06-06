import { useState, useEffect } from "react";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  
  // Имитация функции поиска (в реальном проекте здесь будет useFeedbackStore)
  const handleSearch = (query: string) => {
    console.log("Поиск по запросу:", query);
    // Здесь будет setFilter("all") из store
  };
  
  useEffect(() => {
    if (q) handleSearch(q);
  }, [q]);

  return (
    <div className="relative group">
      {/* Animated background glow */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl blur-xl opacity-30 transition-opacity duration-500 ${
        focused || q ? 'opacity-60' : 'opacity-30'
      }`}></div>
      
      {/* Glass container */}
      <div className="relative glass-effect rounded-2xl p-1">
        <div className="relative flex items-center">
          {/* Search icon with animation */}
          <div className="absolute left-4 z-10">
            <svg 
              className={`w-5 h-5 transition-all duration-300 ${
                focused || q 
                  ? 'text-purple-400 scale-110' 
                  : 'text-white/50 group-hover:text-white/70'
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>

          {/* Input field */}
          <input
            type="search"
            placeholder="Найти идею... ✨"
            value={q}
            onChange={e => setQ(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`w-full bg-transparent pl-12 pr-12 py-4 text-white placeholder-white/50 border-0 rounded-2xl focus:outline-none focus:ring-0 transition-all duration-300 ${
              focused ? 'placeholder-white/70' : ''
            }`}
          />

          {/* Clear button */}
          {q && (
            <button
              onClick={() => setQ("")}
              className="absolute right-4 z-10 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all duration-200 hover:scale-110"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Animated border effect */}
        <div className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          focused 
            ? 'ring-2 ring-purple-400/50 ring-offset-2 ring-offset-transparent' 
            : ''
        }`}></div>
      </div>

      {/* Search suggestions/hints */}
      {focused && !q && (
        <div className="absolute top-full left-0 right-0 mt-2 z-20">
          <div className="glass-effect rounded-xl p-4 border border-white/10">
            <div className="text-sm text-white/60 mb-2">Быстрый поиск:</div>
            <div className="flex flex-wrap gap-2">
              {['UI улучшения', 'производительность', 'новые функции'].map((hint, i) => (
                <button
                  key={hint}
                  onClick={() => setQ(hint)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs text-white/70 hover:text-white transition-all duration-200 hover:scale-105"
                >
                  {hint}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search results count */}
      {q && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <div className="flex items-center gap-2 px-4 py-2 glass-effect rounded-lg">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-white/70">
              Поиск по запросу "{q}"
            </span>
          </div>
        </div>
      )}
    </div>
  );
}