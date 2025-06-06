import { useFeedbackStore } from "../store/useFeedbackStore";

const filters = ["all", "latest", "popular", "UI", "Performance", "Feature", "Other"] as const;

export default function FilterBar() {
  const { filter, setFilter, feedbacks } = useFeedbackStore(s => ({
    filter: s.filter,
    setFilter: s.setFilter,
    feedbacks: s.feedbacks
  }));

  // Get count for each filter
  const getFilterCount = (filterType: typeof filters[number]) => {
    if (filterType === "all") return feedbacks.length;
    if (filterType === "latest") return feedbacks.length;
    if (filterType === "popular") return feedbacks.filter(f => f.votes > 0).length;
    return feedbacks.filter(f => f.category === filterType).length;
  };

  const filterInfo = {
    all: { emoji: "🌟", label: "Все", color: "from-purple-500 to-indigo-600" },
    latest: { emoji: "🕒", label: "Новые", color: "from-blue-500 to-cyan-600" },
    popular: { emoji: "🔥", label: "Популярные", color: "from-red-500 to-pink-600" },
    UI: { emoji: "🎨", label: "UI/UX", color: "from-purple-500 to-indigo-600" },
    Performance: { emoji: "⚡", label: "Скорость", color: "from-amber-400 to-orange-500" },
    Feature: { emoji: "🚀", label: "Функции", color: "from-emerald-400 to-teal-500" },
    Other: { emoji: "💡", label: "Другое", color: "from-gray-400 to-slate-500" }
  };

  return (
    <div className="relative">
      {/* Background glow */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 rounded-2xl blur-xl"></div>
      
      <div className="relative glass-effect rounded-2xl p-4">
        <div className="flex flex-wrap gap-3">
          {filters.map(f => {
            const info = filterInfo[f];
            const count = getFilterCount(f);
            const isActive = filter === f;
            
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-400 ${
                  isActive
                    ? `bg-gradient-to-r ${info.color} text-white shadow-lg hover:shadow-xl`
                    : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                }`}
              >
                {/* Active button glow */}
                {isActive && (
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${info.color} rounded-xl opacity-50 blur transition-opacity duration-300`}></div>
                )}
                
                <span className="relative z-10 flex items-center gap-2">
                  {/* Emoji with animation */}
                  <span className={`text-sm transition-transform duration-200 ${
                    isActive ? 'animate-pulse' : 'group-hover:scale-110'
                  }`}>
                    {info.emoji}
                  </span>
                  
                  {/* Label */}
                  <span className="font-semibold text-sm">
                    {info.label}
                  </span>
                  
                  {/* Count badge */}
                  {count > 0 && (
                    <span className={`ml-1 px-2 py-0.5 text-xs font-bold rounded-full transition-all duration-200 ${
                      isActive 
                        ? "bg-white/20 text-white" 
                        : "bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white/80"
                    }`}>
                      {count}
                    </span>
                  )}
                </span>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            );
          })}
        </div>

        {/* Filter description */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <span>{filterInfo[filter].emoji}</span>
              <span>
                {filter === "all" && "Показаны все идеи"}
                {filter === "latest" && "Сортировка по дате добавления"}
                {filter === "popular" && "Сортировка по количеству голосов"}
                {!["all", "latest", "popular"].includes(filter) && `Идеи в категории "${filterInfo[filter].label}"`}
              </span>
            </div>
            
            {/* Total count */}
            <div className="flex items-center gap-1 ml-auto">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>
                {getFilterCount(filter)} {getFilterCount(filter) === 1 ? 'идея' : getFilterCount(filter) < 5 ? 'идеи' : 'идей'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        {filter === "all" && feedbacks.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(["UI", "Performance", "Feature", "Other"] as const).map(category => {
              const categoryCount = feedbacks.filter(f => f.category === category).length;
              const categoryInfo = filterInfo[category];
              
              if (categoryCount === 0) return null;
              
              return (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className="group flex items-center gap-2 p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <span className="text-xs group-hover:scale-110 transition-transform">
                    {categoryInfo.emoji}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="text-xs font-medium text-white/80">
                      {categoryInfo.label}
                    </div>
                    <div className="text-xs text-white/50">
                      {categoryCount}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}