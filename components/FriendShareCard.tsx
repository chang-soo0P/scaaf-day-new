import { Users, UserPlus, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Friend {
  id: string;
  name: string;
  todayEmoji: string;
}

interface FriendShareCardProps {
  onOpenModal: () => void;
}

const mockFriends: Friend[] = [
  { id: '1', name: '김서연', todayEmoji: '⚡' },
  { id: '2', name: '박지훈', todayEmoji: '🌿' },
  { id: '3', name: '이민지', todayEmoji: '✨' },
];

export function FriendShareCard({ onOpenModal }: FriendShareCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg space-y-4 h-fit px-[24px] py-[40px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 rounded-full p-2">
            <Users className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-gray-900">친구와 공유</h3>
        </div>
        <Button 
          size="sm" 
          variant="outline"
          onClick={onOpenModal}
        >
          <UserPlus className="w-4 h-4 mr-1" />
          초대
        </Button>
      </div>

      {/* Friends List */}
      <div className="space-y-2">
        {mockFriends.map((friend) => (
          <div
            key={friend.id}
            className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm">
                  {friend.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2">
                <p className="text-sm text-gray-900">{friend.name}</p>
                <span className="text-lg">{friend.todayEmoji}</span>
              </div>
            </div>
            <button className="text-gray-400 hover:text-purple-600 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="pt-2 border-t border-gray-100">
        <button
          onClick={onOpenModal}
          className="w-full text-center text-sm text-purple-600 hover:text-purple-700 py-2 hover:bg-purple-50 rounded-lg transition-colors"
        >
          친구의 오늘 하루 더 보기 →
        </button>
      </div>
    </div>
  );
}
