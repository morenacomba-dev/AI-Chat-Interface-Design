import { useState } from 'react';
import {
  MessageSquare,
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Bot,
} from 'lucide-react';
import type { Conversation } from '@/lib/supabase';

type Props = {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function Sidebar({ conversations, activeId, onSelect, onNew, onDelete }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <aside
      className={`relative flex flex-col bg-[#111318] border-r border-white/[0.06] transition-all duration-300 ease-in-out shrink-0 ${
        collapsed ? 'w-[60px]' : 'w-[260px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-4 border-b border-white/[0.06]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-white/90 tracking-tight">NexusAI</span>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto">
            <Bot size={14} className="text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded-md text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* New Chat Button */}
      <div className={`px-3 py-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <button
          onClick={onNew}
          className={`flex items-center gap-2 rounded-lg bg-white/[0.07] hover:bg-white/[0.12] border border-white/[0.08] text-white/80 hover:text-white transition-all duration-150 ${
            collapsed ? 'w-9 h-9 justify-center' : 'w-full px-3 py-2 text-sm font-medium'
          }`}
          title="New conversation"
        >
          <Plus size={15} className="shrink-0" />
          {!collapsed && <span>New chat</span>}
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-1 scrollbar-thin">
        {!collapsed && conversations.length === 0 && (
          <p className="text-xs text-white/25 text-center mt-8 px-4">No conversations yet</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`relative group mx-2 mb-0.5 rounded-lg cursor-pointer transition-all duration-100 ${
              activeId === conv.id
                ? 'bg-white/[0.1] text-white'
                : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80'
            }`}
            onClick={() => onSelect(conv.id)}
            onMouseEnter={() => setHoveredId(conv.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {collapsed ? (
              <div className="flex justify-center items-center h-9 w-9 mx-auto">
                <MessageSquare size={15} />
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2">
                <MessageSquare size={13} className="shrink-0 opacity-70" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate leading-snug">
                    {conv.title}
                  </p>
                  <p className="text-[10px] text-white/25 mt-0.5">{timeAgo(conv.updated_at)}</p>
                </div>
                {hoveredId === conv.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="shrink-0 p-1 rounded text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Expand toggle (when collapsed) */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-[#1e2128] border border-white/[0.1] flex items-center justify-center text-white/50 hover:text-white hover:bg-[#2a2d36] transition-colors shadow-lg z-10"
          title="Expand sidebar"
        >
          <ChevronRight size={12} />
        </button>
      )}
    </aside>
  );
}
