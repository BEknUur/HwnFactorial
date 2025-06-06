import { useState, useEffect } from "react";
import { useFeedbackStore } from "../store/useFeedbackStore";
import FeedbackItem from "./FeedbackItem";

export default function FeedbackList() {
  const { feedbacks, filter } = useFeedbackStore((s) => ({
    feedbacks: s.feedbacks,
    filter: s.filter
  }));

  const [isLoading, setIsLoading] = useState(true);
  const [animatedItems, setAnimatedItems] = useState<string[]>([]);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [filter]);

  // Add staggered animation for new items
  useEffect(() => {
    const newItems = filtered.map(f => f.id);
    setAnimatedItems([]);
    
    newItems.forEach((id, index) => {
      setTimeout(() => {
        setAnimatedItems(prev => [...prev, id]);
      }, index * 100);
    });
  }, [feedbacks.length, filter]);

  const filtered = feedbacks
    .filter((f) =>
      filter === "all"
        ? true
        : filter === "latest"
        ? true
        : filter === "popular"
        ? true
        : f.category === filter
    )
    .sort((a, b) => {
      if (filter === "latest") return +new Date(b.createdAt) - +new Date(a.createdAt);
      if (filter === "popular") return b.votes - a.votes;
      return 0;
    });

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-effect rounded-2xl p-6 animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 w-20 bg-white/20 rounded-full skeleton"></div>
              <div className="h-4 w-24 bg-white/20 rounded skeleton"></div>
            </div>
            <div className="space-y-2 mb-6">
              <div className="h-4 bg-white/20 rounded skeleton"></div>
              <div className="h-4 bg-white/20 rounded w-3/4 skeleton"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-10 w-24 bg-white/20 rounded-xl skeleton"></div>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-white/20 rounded-lg skeleton"></div>
                <div className="h-8 w-8 bg-white/20 rounded-lg skeleton"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!filtered.length) {
    return (
      <div className="text-center py-16">
        <div className="relative">
          {/* Animated background circles */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-purple-500/10 rounded-full animate-ping"></div>
            <div className="absolute w-24 h-24 bg-pink-500/10 rounded-full animate-ping animation-delay-200"></div>
            <div className="absolute w-16 h-16 bg-blue-500/10 rounded-full animate-ping animation-delay-400"></div>
          </div>
          
          <div className="relative z-10 glass-effect rounded-3xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-6 animate-bounce">🤔</div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              {filter === "all" ? "Пока нет идей" : `Нет идей в категории "${filter}"`}
            </h3>
            
            <p className="text-white/60 mb-8 leading-relaxed">
              {filter === "all" 
                ? "Станьте первым, кто поделится своей идеей! Каждое предложение важно для улучшения продукта."
                : `Попробуйте другую категорию или добавьте первую идею в "${filter}"`
              }
            </p>

            {/* Animated suggestions */}
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                <span className="animate-pulse">💡</span>
                <span>Предложите новую функцию</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                <span className="animate-pulse animation-delay-200">🎨</span>
                <span>Улучшите дизайн</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-white/50">
                <span className="animate-pulse animation-delay-400">⚡</span>
                <span>Повысьте производительность</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-white">
            {filter === "all" ? "Все идеи" : 
             filter === "latest" ? "Новые идеи" :
             filter === "popular" ? "Популярные идеи" :
             `Категория: ${filter}`}
          </h3>
          
          <div className="glass-effect px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-white/80">
              {filtered.length} {filtered.length === 1 ? 'идея' : filtered.length < 5 ? 'идеи' : 'идей'}
            </span>
          </div>
        </div>

        {/* Sort indicator */}
        {(filter === "latest" || filter === "popular") && (
          <div className="flex items-center gap-2 text-sm text-white/60">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>
              {filter === "latest" ? "По дате" : "По популярности"}
            </span>
          </div>
        )}
      </div>

      {/* Feedback items with staggered animation */}
      <div className="grid gap-6">
        {filtered.map((feedback, index) => (
          <div
            key={feedback.id}
            className={`transform transition-all duration-500 ${
              animatedItems.includes(feedback.id)
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <FeedbackItem feedback={feedback} />
          </div>
        ))}
      </div>

      {/* Load more hint for future implementation */}
      {filtered.length >= 10 && (
        <div className="text-center pt-8">
          <div className="glass-effect rounded-2xl p-6 max-w-md mx-auto">
            <div className="text-4xl mb-4">🎉</div>
            <p className="text-white/60 text-sm">
              Отличная коллекция идей! Продолжайте добавлять предложения.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}