import { Bot } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import { openChat } from '@/app/slice/aiChatSlice';

export const AIChatButton: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <button
      onClick={() => dispatch(openChat())}
      className="fixed bottom-5 right-5 bg-[#8B4513] hover:bg-[#A0522D] text-white p-4 rounded-full shadow-lg transition-colors duration-200"
    >
      <Bot className="w-6 h-6" />
    </button>
  );
};
