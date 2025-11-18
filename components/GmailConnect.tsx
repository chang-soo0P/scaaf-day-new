import { Mail, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

interface GmailConnectProps {
  onConnect: () => void;
}

export function GmailConnect({ onConnect }: GmailConnectProps) {
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-30 animate-pulse" />
              <div className="relative bg-white rounded-full p-6 shadow-lg">
                <Mail className="w-16 h-16 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-indigo-900">Scaaf.day</h1>
            <p className="text-gray-600">
              매일 당신의 이메일을 감성적으로 정리해드려요
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex items-start gap-3 text-left">
            <Sparkles className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-gray-700">AI가 하루의 메일을 요약하고</p>
              <p className="text-gray-500 text-sm">감정적 하이라이트를 전달합니다</p>
            </div>
          </div>

          <div className="flex items-start gap-3 text-left">
            <Sparkles className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-gray-700">발신자별 자동 그룹화로</p>
              <p className="text-gray-500 text-sm">중요한 메시지를 놓치지 않아요</p>
            </div>
          </div>
        </div>

        <Button
          onClick={onConnect}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          size="lg"
        >
          <Mail className="w-5 h-5 mr-2" />
          Gmail 연결하기
        </Button>
      </div>
    </div>
  );
}
