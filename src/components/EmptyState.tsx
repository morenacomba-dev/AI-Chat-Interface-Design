import { Bot, Zap, Shield, Layers } from 'lucide-react';

const SUGGESTIONS = [
  'Explain quantum computing in simple terms',
  'Write a short story about a robot who discovers music',
  'What are the best practices for writing clean code?',
  'Help me plan a 7-day trip to Japan',
];

type Props = { onSuggest: (text: string) => void };

export default function EmptyState({ onSuggest }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-4 shadow-xl shadow-blue-900/30">
        <Bot size={26} className="text-white" />
      </div>
      <h2 className="text-xl font-semibold text-white/90 mb-1">How can I help you today?</h2>
      <p className="text-sm text-white/35 mb-8 max-w-sm">
        Ask anything — I can write, analyze, explain, code, and more.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-xl mb-8">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggest(s)}
            className="text-left px-4 py-3 rounded-xl bg-[#1a1d24] border border-white/[0.06] text-sm text-white/55 hover:text-white/85 hover:border-white/[0.12] hover:bg-[#1e2128] transition-all duration-150"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-5 text-[11px] text-white/20">
        <span className="flex items-center gap-1.5"><Zap size={11} /> Fast responses</span>
        <span className="flex items-center gap-1.5"><Shield size={11} /> Private & secure</span>
        <span className="flex items-center gap-1.5"><Layers size={11} /> Multi-turn memory</span>
      </div>
    </div>
  );
}
