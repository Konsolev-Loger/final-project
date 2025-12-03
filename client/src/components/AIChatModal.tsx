import { useEffect, useRef, useState, FormEvent } from 'react';
import { XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { closeChat, addMessage, Message } from '@/app/slice/aiChatSlice';

export const AIChatModal: React.FC = () => {
  const { isOpen, messages } = useSelector((state: RootState) => state.aiChat);
  const dispatch = useDispatch<AppDispatch>();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      dispatch(addMessage({ from: 'assistant', text: 'Задайте вопрос, который вас интересует' }));
      const audio = new Audio('/ping.mp3');
      audio.play();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { from: 'user', text: input };
    dispatch(addMessage(userMessage));
    setInput('');

    try {
      const response = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage.text }),
      });

      if (!response.ok) throw new Error('Ошибка сервера AI');

      const data = await response.json();

      const aiMessage: Message = { from: 'assistant', text: data.answer };
      dispatch(addMessage(aiMessage));
    } catch (err) {
      const errorMessage: Message = {
        from: 'assistant',
        text: 'Ошибка AI. Попробуйте снова.',
      };
      dispatch(addMessage(errorMessage));
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-5 right-5 w-90 h-105 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden"
        >
          <div className="flex justify-between items-center p-3 bg-[#8B4513] text-white">
            <span>AI Помощник</span>
            <button onClick={() => dispatch(closeChat())}>
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-md ${
                  msg.from === 'assistant' ? 'bg-gray-100 self-start' : 'bg-blue-100 self-end'
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="p-3 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Напишите сообщение..."
              className="flex-1 border rounded-md p-2 outline-none"
            />
            <button type="submit" className="bg-[#8B4513] text-white p-2 rounded-md">
              Отправить
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
