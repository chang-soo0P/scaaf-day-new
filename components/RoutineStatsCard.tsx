import { TrendingUp, Mail, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const weeklyData = [
  { day: 'Mon', emails: 18, processed: 18 },
  { day: 'Tue', emails: 24, processed: 24 },
  { day: 'Wed', emails: 31, processed: 30 },
  { day: 'Thu', emails: 27, processed: 27 },
  { day: 'Fri', emails: 35, processed: 33 },
  { day: 'Sat', emails: 12, processed: 12 },
  { day: 'Sun', emails: 22, processed: 22 },
];

const moodTrend = [
  { day: 'Mon', score: 7 },
  { day: 'Tue', score: 8 },
  { day: 'Wed', score: 6 },
  { day: 'Thu', score: 7 },
  { day: 'Fri', score: 9 },
  { day: 'Sat', score: 8 },
  { day: 'Sun', score: 7 },
];

export function RoutineStatsCard() {
  const totalEmails = weeklyData.reduce((acc, day) => acc + day.emails, 0);
  const processedEmails = weeklyData.reduce((acc, day) => acc + day.processed, 0);
  const completionRate = Math.round((processedEmails / totalEmails) * 100);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-gray-900">My Mail Routine</h3>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="w-5 h-5" />
          <span className="text-sm">This Week +12%</span>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center space-y-2">
          <Mail className="w-6 h-6 text-blue-600 mx-auto" />
          <div className="text-2xl text-gray-900">{totalEmails}</div>
          <p className="text-xs text-gray-600">This Week Emails</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 text-center space-y-2">
          <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto" />
          <div className="text-2xl text-gray-900">{completionRate}%</div>
          <p className="text-xs text-gray-600">Completion Rate</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 text-center space-y-2">
          <span className="text-2xl">⭐</span>
          <div className="text-2xl text-gray-900">7.4</div>
          <p className="text-xs text-gray-600">Average Mood Score</p>
        </div>
      </div>

      {/* Weekly Chart */}
      <div className="space-y-3">
        <h4 className="text-gray-900">Weekly Email Volume</h4>
        <div className="bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="emails" fill="#818cf8" radius={[8, 8, 0, 0]} />
              <Bar dataKey="processed" fill="#34d399" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood Trend */}
      <div className="space-y-3">
        <h4 className="text-gray-900">Weekly Mood Trend</h4>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4">
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" />
              <YAxis stroke="#6b7280" domain={[0, 10]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#ec4899" 
                strokeWidth={3}
                dot={{ fill: '#ec4899', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
