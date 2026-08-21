import { useState, useRef, type KeyboardEvent } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';

type Props = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export default function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  // Handle multiple button commands
  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleInput() {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 180) + 'px';
  }

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-2 bg-[#1a1d24] border border-white/[0.08] rounded-2xl px-4 py-3 focus-within:border-sky-500/50 focus-within:shadow-[0_0_0_3px_rgba(14,165,233,0.08)] transition-all duration-200">
          <button
            className="shrink-0 mb-0.5 p-1 text-white/25 hover:text-white/50 transition-colors"
            title="Attach file (coming soon)"
            tabIndex={-1}
          >
            <Paperclip size={16} />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder="Message NexusAI…"
            rows={1}
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-white/90 placeholder:text-white/25 resize-none outline-none leading-relaxed max-h-[180px] overflow-y-auto scrollbar-thin py-0.5"
          />

          <button
            onClick={handleSend}
            disabled={!canSend}
            className={`shrink-0 mb-0.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
              canSend
                ? 'bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-md shadow-blue-900/30 hover:shadow-blue-800/40 hover:scale-105'
                : 'bg-white/[0.05] text-white/20 cursor-not-allowed'
            }`}
            title="Send (Enter)"
          >
            <ArrowUp size={15} />
          </button>
        </div>
        <p className="text-center text-[10px] text-white/15 mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
