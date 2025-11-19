import { Calendar } from 'lucide-react';

interface EmotionCommentProps {
  text: string;
  subtext: string;
  emoji: string;
  onClick: () => void;
}

export function EmotionComment({ text, subtext, emoji, onClick }: EmotionCommentProps) {
  return (
    <button 
      onClick={onClick}
      className="relative w-full group cursor-pointer"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity animate-pulse" />
      
      {/* Main card */}
      <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 shadow-2xl group-hover:shadow-3xl transition-all duration-300 group-hover:scale-[1.02]">
        <div className="flex items-center justify-between gap-6">
          {/* Emoji - Large and prominent */}
          <div className="text-7xl animate-bounce-slow flex-shrink-0">
            {emoji}
          </div>
          
          {/* Text content */}
          <div className="flex-1 text-left space-y-2">
            <p className="text-white text-2xl">{text}</p>
            <p className="text-white/80">{subtext}</p>
          </div>
          
          {/* Calendar hint */}
          <div className="flex flex-col items-center gap-2 text-white/60 group-hover:text-white/90 transition-colors">
            <Calendar className="w-6 h-6" />
            <span className="text-xs">View Records</span>
          </div>
        </div>
      </div>
    </button>
  );
}
