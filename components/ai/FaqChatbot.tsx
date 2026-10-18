'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, ChevronRight, RotateCcw, PieChart } from 'lucide-react';
import { getFaqAnswer } from '@/lib/mockAi';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  suggestions?: string[];
  timestamp: string;
}

export default function FaqChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: 'Hello! 👋 I am the GSAP 2026 AI Copilot. Ask me about our £8,000 grant proposal, 18+ university student verification, cross-border diaspora concierge, or neutral milestone escrow!',
      suggestions: [
        'How will the £8,000 GBP grant funding help GSAP?',
        'How does the London-Bangalore diaspora concierge work?',
        'Why is the 18+ verification strictly enforced?',
        'How does neutral milestone escrow protect clients?',
      ],
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Dynamic tailored responses for grant funding & corridor
    setTimeout(() => {
      let botResponse = getFaqAnswer(query);

      // Custom grant answer if query is about funding
      if (query.toLowerCase().includes('8,000') || query.toLowerCase().includes('grant') || query.toLowerCase().includes('funding')) {
        botResponse = {
          answer: "The £8,000 GBP Seed Grant directly finances four critical milestones over 3-6 months:\n\n1. £2,800 (35%): Escrow Smart Vault & multi-currency FX bridge (GBP/USD/EUR/INR).\n2. £2,000 (25%): Verified Student Ambassador Network across UK & Bangalore universities.\n3. £2,000 (25%): 18+ OCR & automated university credentials verification pipeline.\n4. £1,200 (15%): Cross-Border legal compliance & consumer rights framework.\n\nTargeting £35K monthly GMV and 23.3x LTV:CAC within 6 months!",
          suggestions: [
            'How does the London-Bangalore diaspora concierge work?',
            'Why is the 18+ verification strictly enforced?',
          ],
        };
      } else if (query.toLowerCase().includes('diaspora') || query.toLowerCase().includes('london') || query.toLowerCase().includes('bangalore') || query.toLowerCase().includes('family')) {
        botResponse = {
          answer: "The Cross-Border Diaspora Concierge allows expats living in the UK, USA, or Canada to hire vetted, bilingual local university students near their parents' hometown (e.g. Bangalore, Hyderabad, Delhi).\n\nStudents help with routine clinic checkups, doctor escorts, digital pension certificates, and smartphone setup. Clients fund in GBP/USD via neutral escrow, and students receive local INR upon verified completion!",
          suggestions: [
            'How will the £8,000 GBP grant funding help GSAP?',
            'How does neutral milestone escrow protect clients?',
          ],
        };
      }

      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: botResponse.answer,
        suggestions: botResponse.suggestions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 450);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome_${Date.now()}`,
        sender: 'bot',
        text: 'Chat history reset. How can I help evaluate or navigate GSAP today?',
        suggestions: [
          'How will the £8,000 GBP grant funding help GSAP?',
          'Why is the 18+ verification strictly enforced?',
        ],
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2.5 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-full shadow-2xl border border-zinc-700 hover:border-amber-400 transition-all duration-200"
          aria-label="Open GSAP AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
            </span>
          </div>
          <span className="text-xs font-mono font-bold tracking-wide text-zinc-200 group-hover:text-amber-400">
            Ask AI Assistant
          </span>
        </button>
      </div>

      {/* Slide-out Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] max-h-[580px] h-[540px] bg-zinc-900 border border-zinc-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fade-in text-zinc-100">
          {/* Header */}
          <div className="bg-zinc-950 px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-zinc-950 font-black shadow-glow-amber">
                <Bot className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">GSAP AI Copilot</h3>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                    2026 Engine
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">Interactive Assistant & Investor FAQ</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                title="Reset chat history"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-zinc-950 font-medium rounded-tr-none'
                      : 'bg-zinc-800 border border-zinc-700/60 text-zinc-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[10px] font-mono text-zinc-500 mt-1 px-1">
                  {m.timestamp}
                </span>

                {/* Chips */}
                {m.suggestions && m.suggestions.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {m.suggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-[11px] text-left px-2.5 py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-amber-400 hover:border-amber-500/40 transition flex items-center gap-1 group font-mono"
                      >
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                        <span>{sug}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-zinc-800 border border-zinc-750 text-zinc-400 text-xs w-28">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-mono ml-1">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-zinc-950 border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask a question about GSAP, grant, or escrow..."
                className="flex-1 bg-zinc-900 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-hidden focus:border-amber-400 font-sans"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim() || isTyping}
                className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 rounded-xl transition shadow-glow-amber shrink-0"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
