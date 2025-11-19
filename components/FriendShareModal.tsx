import { X, UserPlus, Send, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface Friend {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  todayMood: string;
  todayEmoji: string;
}

interface FriendShareModalProps {
  onClose: () => void;
}

const mockFriends: Friend[] = [
  { id: '1', name: 'Sarah Kim', email: 'kim@example.com', todayMood: 'Productive day', todayEmoji: '⚡' },
  { id: '2', name: 'James Park', email: 'park@example.com', todayMood: 'Calm day', todayEmoji: '🌿' },
  { id: '3', name: 'Emma Lee', email: 'lee@example.com', todayMood: 'Inspiring day', todayEmoji: '✨' },
];

export function FriendShareModal({ onClose }: FriendShareModalProps) {
  const [inviteEmail, setInviteEmail] = useState('');
  const [copied, setCopied] = useState(false);
  const inviteLink = 'https://scaaf.day/invite/abc123';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    console.log('Inviting:', inviteEmail);
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-white">Share Emotions with Friends</h2>
              <p className="text-sm text-white/80">Look back on your day together</p>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Invite Section */}
          <div className="space-y-4">
            <h3 className="text-gray-900">Invite Friends</h3>
            
            {/* Email invite */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 space-y-3">
              <p className="text-sm text-gray-700">Invite by Email</p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="friend@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleInvite} className="bg-indigo-600 hover:bg-indigo-700">
                  <Send className="w-4 h-4 mr-2" />
                  Invite
                </Button>
              </div>
            </div>

            {/* Link invite */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 space-y-3">
              <p className="text-sm text-gray-700">Invite by Link</p>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="flex-1"
                />
                <Button 
                  onClick={handleCopyLink}
                  variant={copied ? 'default' : 'outline'}
                  className={copied ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Friends List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">My Friends</h3>
              <span className="text-sm text-gray-600">{mockFriends.length}</span>
            </div>

            <div className="space-y-3">
              {mockFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-white border-2 border-gray-100 rounded-2xl p-4 hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                        {friend.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div>
                        <p className="text-gray-900">{friend.name}</p>
                        <p className="text-xs text-gray-500">{friend.email}</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{friend.todayEmoji}</span>
                          <p className="text-sm text-gray-700">{friend.todayMood}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-shrink-0"
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share Newsletter Section */}
          <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 space-y-3">
            <h4 className="text-gray-900">💌 Share Newsletter</h4>
            <p className="text-sm text-gray-600">
              Share interesting newsletters you received today with your friends
            </p>
            <Button className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              <UserPlus className="w-4 h-4 mr-2" />
              Select Newsletter to Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
