'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, HelpCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { getFaqAnswer, FAQ_DATABASE } from '@/lib/mockAi';

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
      text: 'Hi there! 👋 I am the GSAP Assistant (rule-based FAQ demo). Ask me any questions regarding student verification, our strict 18+ policy, hiring, or payments!',
      suggestions: [
        'Is this platform strictly 18+ only?',
        'How does student verification work?',
        'How do clients review and hire applicants?',
        'How is the AI Match Score calculated?',
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

    // Simulate realistic 400ms conversational processing
    setTimeout(() => {
      const response = getFaqAnswer(query);
      const botMessage: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        suggestions: response.suggestions,
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
        text: 'Chat history cleared. How can I help you today?',
        suggestions: [
          'Is this platform strictly 18+ only?',
          'How does student verification work?',
          'How do clients hire applicants?',
        ],
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-brand-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-200 border border-brand-400/40"
            aria-label="Open GSAP FAQ Assistant"
          >
            <div className="relative">
              <Bot className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <span className="text-sm font-semibold tracking-wide">Ask AI Assistant</span>
          </button>
        )}
      </div>

      {/* Chatbot Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-4 sm:right-6 w-[92vw] sm:w-[400px] h-[540px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm leading-tight">GSAP Assistant</h3>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-white/20 text-white">
                    Simulated AI
                  </span>
                </div>
                <p className="text-[11px] text-indigo-100/90">Rule-based FAQ & platform guide</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-brand-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Suggested Questions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-2.5 space-y-1.5 w-full">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Quick Questions:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(suggestion)}
                          className="text-left text-[11px] font-medium bg-white hover:bg-brand-50 text-slate-700 hover:text-brand-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition flex items-center gap-1 group shadow-xs"
                        >
                          <span>{suggestion}</span>
                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-brand-500 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 text-xs py-1 px-2">
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-brand-400 animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[11px] ml-1">Assistant is answering...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about 18+ policy, hiring, or rates..."
              className="flex-1 text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-900 transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="p-2.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white rounded-xl transition flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
