import { useState } from "react";
import { Feedback, useFeedbackStore } from "../store/useFeedbackStore";
import { Modal } from "./Modal";
import FeedbackForm from "./FeedbackForm";

export default function FeedbackItem({ feedback }: { feedback: Feedback }) {
  const remove = useFeedbackStore(s => s.remove);
  const upvote = useFeedbackStore(s => s.upvote);
  const [open, setOpen] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const categoryInfo = {
    UI: { 
      emoji: "🎨", 
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-purple-500/20",
      textColor: "text-purple-300"
    },
    Performance: { 
      emoji: "⚡", 
      color: "from-amber-400 to-orange-500",
      bgColor: "bg-amber-500/20", 
      textColor: "text-amber-300"
    },
    Feature: { 
      emoji: "🚀", 
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-emerald-500/20",
      textColor: "text-emerald-300"
    },
    Other: { 
      emoji: "💡", 
      color: "from-gray-400 to-slate-500",
      bgColor: "bg-gray-500/20",
      textColor: "text-gray-300"
    }
  };

  const info = categoryInfo[feedback.category];

  const handleUpvote = async () => {
    if (isVoting) return;
    setIsVoting(true);
    
    // Add small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 200));
    upvote(feedback.id);
    setIsVoting(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    
    // Add animation delay
    await new Promise(resolve => setTimeout(resolve, 300));
    remove(feedback.id);
  };

  return (
    <>
      <div className={`group relative glass-effect rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] transform ${isDeleting ? 'animate-pulse opacity-50 scale-95' : ''}`}>
        {/* Animated background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Glow effect on hover */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-blue-600/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur"></div>
        
        <div className="relative z-10">
          {/* Header with category and date */}
          <div className="flex justify-between items-start mb-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r ${info.color} text-white shadow-lg backdrop-blur-sm`}>
              <span className="text-sm">{info.emoji}</span>
              <span>{feedback.category}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-white/50">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date(feedback.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
          
          {/* Feedback text */}
          <div className="mb-6">
            <p className="text-white leading-relaxed text-base break-words">
              {feedback.text}
            </p>
          </div>
          
          {/* Actions bar */}
          <div className="flex items-center justify-between">
            {/* Vote button */}
            <button
              onClick={handleUpvote}
              disabled={isVoting}
              className={`group/vote relative flex items-center gap-3 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-70 ${isVoting ? 'animate-pulse' : ''}`}
            >
              {/* Button glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl opacity-0 group-hover/vote:opacity-50 transition-opacity duration-300 blur"></div>
              
              <span className="relative z-10 flex items-center gap-3">
                <span className={`text-lg transition-transform duration-200 ${isVoting ? 'animate-bounce' : 'group-hover/vote:animate-bounce'}`}>
                  🔥
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-xs opacity-80">голосов</span>
                  <span className={`font-bold text-lg leading-none transition-all duration-300 ${isVoting ? 'scale-110' : ''}`}>
                    {feedback.votes}
                  </span>
                </div>
              </span>
            </button>
            
            {/* Action buttons */}
            <div className="flex items-center gap-3">
              {/* Edit button */}
              <button 
                onClick={() => setOpen(true)}
                className={`group/edit p-3 ${info.bgColor} hover:bg-opacity-40 ${info.textColor} rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400`}
                title="Редактировать"
              >
                <svg className="w-4 h-4 transition-transform group-hover/edit:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              
              {/* Delete button */}
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="group/delete p-3 bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-xl transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-red-500/25 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-400"
                title="Удалить"
              >
                <svg className={`w-4 h-4 transition-transform ${isDeleting ? 'animate-spin' : 'group-hover/delete:rotate-12'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Popular indicator */}
          {feedback.votes >= 5 && (
            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
              🏆 Топ
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✏️</span>
          </div>
          <h2 className="text-2xl font-bold gradient-text">
            Редактировать идею
          </h2>
          <p className="text-white/60 mt-2">
            Внесите изменения в вашу идею
          </p>
        </div>
        
        <FeedbackForm
          editId={feedback.id}
          defaultText={feedback.text}
          defaultCategory={feedback.category}
          onDone={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}