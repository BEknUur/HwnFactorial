import { useState } from "react";
import { Category, useFeedbackStore } from "../store/useFeedbackStore";

export default function FeedbackForm({
  defaultText = "",
  defaultCategory = "UI",
  editId,
  onDone
}: {
  defaultText?: string;
  defaultCategory?: Category;
  editId?: string;
  onDone?: () => void;
}) {
  const add = useFeedbackStore(s => s.add);
  const edit = useFeedbackStore(s => s.edit);
  const [text, setText] = useState(defaultText);
  const [category, setCategory] = useState<Category>(defaultCategory);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!text.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate API call delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));
    
    editId ? edit(editId, text, category) : add(text, category);
    onDone?.();
    setText("");
    setIsSubmitting(false);
  };

  const categoryEmojis = {
    UI: "🎨",
    Performance: "⚡",
    Feature: "🚀", 
    Other: "💡"
  };

  const categoryColors = {
    UI: "from-purple-500 to-indigo-600",
    Performance: "from-amber-400 to-orange-500",
    Feature: "from-emerald-400 to-teal-500", 
    Other: "from-gray-400 to-slate-500"
  };

  return (
    <div className="relative">
      {/* Glow effect background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-20"></div>
      
      <div className="relative glass-effect rounded-3xl p-8 shadow-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              {editId ? "✏️ Редактировать идею" : "✨ Новая идея"}
            </h3>
            <p className="text-white/60 text-sm">
              {editId ? "Внесите изменения в вашу идею" : "Расскажите, что вы хотели бы улучшить"}
            </p>
          </div>

          {/* Text area */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-focus-within:opacity-50 transition-opacity duration-300 blur"></div>
            <textarea
              className="relative w-full bg-black/20 backdrop-blur-sm border border-white/30 rounded-2xl p-4 text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 min-h-[120px]"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Поделитесь своей идеей... Например: 'Добавить темную тему для лучшего пользовательского опыта' 💭"
              maxLength={500}
            />
            
            {/* Character counter */}
            <div className="absolute bottom-3 right-3 text-xs text-white/40">
              {text.length}/500
            </div>
          </div>

          {/* Category and submit section */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Category selector */}
            <div className="relative flex-1">
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full bg-black/20 backdrop-blur-sm border border-white/30 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all appearance-none cursor-pointer"
              >
                {(["UI", "Performance", "Feature", "Other"] as Category[]).map(c => (
                  <option key={c} value={c} className="bg-gray-900 text-white">
                    {categoryEmojis[c]} {c}
                  </option>
                ))}
              </select>
              
              {/* Custom dropdown arrow */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={submit}
              disabled={!text.trim() || isSubmitting}
              className={`relative group px-8 py-3 bg-gradient-to-r ${categoryColors[category]} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-400 min-w-[140px]`}
            >
              {/* Button glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 blur"></div>
              
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <span>{editId ? "💾" : "🚀"}</span>
                    <span>{editId ? "Сохранить" : "Добавить"}</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Quick tips */}
          {!editId && (
            <div className="bg-black/20 rounded-xl p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-2">💡 Советы для хорошей идеи:</h4>
              <ul className="text-xs text-white/60 space-y-1">
                <li>• Будьте конкретны и понятны</li>
                <li>• Объясните проблему и предложите решение</li>
                <li>• Укажите, как это поможет пользователям</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}