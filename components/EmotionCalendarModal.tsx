import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Calendar } from './ui/calendar';
import { useState } from 'react';

interface EmotionRecord {
  date: Date;
  emoji: string;
  comment: string;
  mood: string;
}

interface EmotionCalendarModalProps {
  onClose: () => void;
}

// Mock emotion history data
const emotionHistory: EmotionRecord[] = [
  { date: new Date(2025, 9, 22), emoji: '🌿', comment: '차분한 하루', mood: 'calm' },
  { date: new Date(2025, 9, 21), emoji: '🔥', comment: '에너지 넘치는 하루', mood: 'energetic' },
  { date: new Date(2025, 9, 20), emoji: '☁️', comment: '조용한 하루', mood: 'quiet' },
  { date: new Date(2025, 9, 19), emoji: '✨', comment: '영감 가득한 하루', mood: 'inspired' },
  { date: new Date(2025, 9, 18), emoji: '🌸', comment: '부드러운 하루', mood: 'gentle' },
  { date: new Date(2025, 9, 17), emoji: '⚡', comment: '생산적인 하루', mood: 'productive' },
  { date: new Date(2025, 9, 16), emoji: '🌊', comment: '흐르는 듯한 하루', mood: 'flowing' },
];

export function EmotionCalendarModal({ onClose }: EmotionCalendarModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const selectedEmotion = emotionHistory.find(
    record => record.date.toDateString() === selectedDate?.toDateString()
  );

  const emotionDates = emotionHistory.map(record => record.date);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-white">나의 감정 캘린더</h2>
              <p className="text-sm text-white/80">매일의 감정을 돌아보세요</p>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="space-y-4">
              <h3 className="text-gray-900">감정 기록</h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md"
                  modifiers={{
                    hasEmotion: emotionDates
                  }}
                  modifiersStyles={{
                    hasEmotion: {
                      fontWeight: 'bold',
                      textDecoration: 'underline'
                    }
                  }}
                />
              </div>
            </div>

            {/* Selected emotion detail */}
            <div className="space-y-4">
              <h3 className="text-gray-900">선택한 날의 감정</h3>
              {selectedEmotion ? (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 space-y-6">
                  <div className="text-center space-y-4">
                    <div className="text-8xl">{selectedEmotion.emoji}</div>
                    <div className="space-y-2">
                      <p className="text-gray-900 text-xl">{selectedEmotion.comment}</p>
                      <p className="text-gray-600">
                        {selectedEmotion.date.toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'long'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 text-center space-y-2">
                  <p className="text-gray-600">이 날은 기록이 없어요</p>
                  <p className="text-sm text-gray-500">메일을 확인하면 감정 기록이 생성됩니다</p>
                </div>
              )}

              {/* Emotion history list */}
              <div className="space-y-3">
                <h4 className="text-gray-900">최근 감정 기록</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {emotionHistory.map((record, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(record.date)}
                      className="w-full bg-white rounded-xl p-4 hover:bg-purple-50 transition-colors text-left border-2 border-transparent hover:border-purple-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{record.emoji}</span>
                        <div className="flex-1">
                          <p className="text-gray-900">{record.comment}</p>
                          <p className="text-xs text-gray-500">
                            {record.date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
