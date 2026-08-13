import { Bot, User } from 'lucide-react';
import type { Message } from '@/lib/supabase';

type Props = {
  message: Message;
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end gap-3 group">
        <div className="max-w-[72%]">
          <div className="bg-gradient-to-br from-sky-500 to-blue-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-lg shadow-blue-900/20">
            {message.content}
          </div>
          <p className="text-[10px] text-white/20 text-right mt-1 px-1">
            {formatTime(message.created_at)}
          </p>
        </div>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shrink-0 mt-0.5 shadow-md">
          <User size={13} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 group">
      <div className="w-7 h-7 rounded-full bg-[#1e2128] border border-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
        <Bot size={13} className="text-sky-400" />
      </div>
      <div className="max-w-[72%]">
        <div className="bg-[#1a1d24] border border-white/[0.06] text-white/85 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed">
          {message.content}
        </div>
        <p className="text-[10px] text-white/20 mt-1 px-1">
          {formatTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
