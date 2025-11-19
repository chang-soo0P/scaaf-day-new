import { Calendar, Mail } from 'lucide-react';

interface TodaySummaryHeaderProps {
  totalEmails: number;
  highlights: string[];
}

export function TodaySummaryHeader({ totalEmails, highlights }: TodaySummaryHeaderProps) {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-100">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">{today}</span>
            </div>
            <h2 className="text-white">Today's Email Highlights</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3 text-center">
            <div className="text-sm text-indigo-100">Total Emails</div>
            <div className="text-white">{totalEmails}</div>
          </div>
        </div>

        <div className="space-y-3">
          {highlights.map((highlight, index) => (
            <div 
              key={index}
              className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
            >
              <div className="bg-white/20 rounded-full p-2 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <p className="flex-1">{highlight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
