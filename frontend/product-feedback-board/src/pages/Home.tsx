import FeedbackForm from "../components/FeedbackForm";
import FeedbackList from "../components/FeedbackList";
import FilterBar from "../components/FilterBar";
import ThemeToggle from "../components/ThemeToggle";
import SearchBar from "../components/SearchBar";
import { useFeedbackStore } from "../store/useFeedbackStore";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function Home() {
  const total = useFeedbackStore(s => s.feedbacks.length);
  const lastAct = useFeedbackStore(s => s.feedbacks.at(-1));

  useEffect(() => {
    if (!lastAct) return;
    toast.success("🚀 Идея добавлена!", {
      style: {
        background: 'linear-gradient(135deg, #10b981, #059669)',
        color: 'white',
        fontWeight: '600',
      },
    });
  }, [lastAct]);

  return (
    <div className="min-h-screen">
      {/* Hero section with animated background */}
      <div className="relative overflow-hidden">
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-12">
          {/* Header */}
          <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-16">
            <div className="space-y-4">
              <h1 className="text-6xl lg:text-7xl font-black gradient-text float">
                Product Feedback
              </h1>
              <div className="text-2xl lg:text-3xl font-bold text-white/80">
                Board ✨
              </div>
              <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
                Поделитесь идеями, голосуйте за лучшие предложения и помогите улучшить продукт вместе! 
                Каждая идея важна 💡
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="glass-effect rounded-2xl px-6 py-4 glow-purple">
                <div className="text-3xl font-bold gradient-text">{total}</div>
                <div className="text-white/60 text-sm font-medium">идей собрано</div>
              </div>
              <ThemeToggle />
            </div>
          </header>

          {/* Search section */}
          <div className="mb-12">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-30"></div>
              <div className="relative">
                <SearchBar />
              </div>
            </div>
          </div>

          {/* Add feedback section */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                💭 Поделитесь своей идеей
              </h2>
              <p className="text-white/60 text-lg">
                Что бы вы хотели улучшить или добавить?
              </p>
            </div>
            <FeedbackForm />
          </div>

          {/* Filter section */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <h3 className="text-2xl font-bold text-white">
                🔥 Все идеи
              </h3>
              <FilterBar />
            </div>
          </div>

          {/* Feedback list */}
          <div className="mb-16">
            <FeedbackList />
          </div>

          {/* Stats section */}
          <div className="glass-effect rounded-3xl p-8 text-center glow-blue">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">{total}</div>
                <div className="text-white/60">Всего идей</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">
                  {useFeedbackStore.getState().feedbacks.reduce((sum, f) => sum + f.votes, 0)}
                </div>
                <div className="text-white/60">Всего голосов</div>
              </div>
              <div>
                <div className="text-4xl font-bold gradient-text mb-2">
                  {new Set(useFeedbackStore.getState().feedbacks.map(f => f.category)).size}
                </div>
                <div className="text-white/60">Категорий</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}