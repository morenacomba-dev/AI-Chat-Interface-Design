import { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import MessageBubble from '@/components/MessageBubble';
import TypingIndicator from '@/components/TypingIndicator';
import ChatInput from '@/components/ChatInput';
import EmptyState from '@/components/EmptyState';
import { supabase, type Conversation, type Message } from '@/lib/supabase';

const AI_RESPONSES = [
  "That's a fascinating question! Let me think through this carefully. The topic you've raised touches on several interconnected ideas that are worth exploring in depth.",
  "Great point! I'd approach this by breaking it down into smaller, manageable parts. First, let's consider the core concept, then we can build on it.",
  "Absolutely! Here's what I know about this: it's a nuanced subject with multiple perspectives worth considering. The key insight is that context matters enormously.",
  "Interesting! This reminds me of a fundamental principle: complex problems usually have elegant solutions once you identify the right framing.",
  "I can definitely help with that. Let me give you a thorough answer that covers both the basics and some deeper insights you might find useful.",
  "Sure thing! The short answer is: it depends on your specific situation. But here's the general framework I'd recommend thinking about it with.",
  "What a thoughtful question! There are a few ways to look at this. The most common approach is X, but depending on your goals, Y might actually serve you better.",
];

function getAIResponse(): string {
  return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
}

function generateTitle(firstMessage: string): string {
  const words = firstMessage.trim().split(/\s+/).slice(0, 6).join(' ');
  return words.length < firstMessage.trim().length ? words + '…' : words;
}

export default function App() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    loadMessages(activeId);
  }, [activeId]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  async function loadConversations() {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false });
    if (!error && data) setConversations(data as Conversation[]);
  }

  async function loadMessages(conversationId: string) {
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    if (!error && data) setMessages(data as Message[]);
    setLoadingMessages(false);
  }

  const handleNewConversation = useCallback(() => {
    setActiveId(null);
    setMessages([]);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  const handleDeleteConversation = useCallback(async (id: string) => {
    await supabase.from('conversations').delete().eq('id', id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
    }
  }, [activeId]);

  const handleSend = useCallback(async (text: string) => {
    let conversationId = activeId;

    // Create a new conversation if needed
    if (!conversationId) {
      const title = generateTitle(text);
      const { data, error } = await supabase
        .from('conversations')
        .insert({ title })
        .select()
        .maybeSingle();
      if (error || !data) return;
      conversationId = data.id;
      setActiveId(conversationId);
      setConversations((prev) => [data as Conversation, ...prev]);
    }

    // Insert user message
    const { data: userMsg, error: msgError } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, role: 'user', content: text })
      .select()
      .maybeSingle();
    if (msgError || !userMsg) return;

    setMessages((prev) => [...prev, userMsg as Message]);

    // Update conversation updated_at + potentially title
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    // Simulate AI typing
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 1000 + Math.random() * 1200));
    setIsTyping(false);

    const aiContent = getAIResponse();
    const { data: aiMsg, error: aiError } = await supabase
      .from('messages')
      .insert({ conversation_id: conversationId, role: 'assistant', content: aiContent })
      .select()
      .maybeSingle();
    if (aiError || !aiMsg) return;

    setMessages((prev) => [...prev, aiMsg as Message]);

    // Refresh conversation list order
    loadConversations();
  }, [activeId]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  return (
    <div className="flex h-screen w-screen bg-[#13151a] text-white overflow-hidden">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
        onDelete={handleDeleteConversation}
      />

      {/* Main chat area */}
      <main className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] shrink-0">
          {activeConversation ? (
            <h1 className="text-sm font-medium text-white/80 truncate">{activeConversation.title}</h1>
          ) : (
            <h1 className="text-sm font-medium text-white/30">NexusAI</h1>
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {loadingMessages ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-5 h-5 border-2 border-sky-500/30 border-t-sky-500 rounded-full animate-spin" />
            </div>
          ) : !activeId || messages.length === 0 ? (
            <EmptyState onSuggest={handleSend} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isTyping} />
      </main>
    </div>
  );
}
