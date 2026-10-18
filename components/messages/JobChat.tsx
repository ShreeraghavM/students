'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Message, Job } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getMessagesByJobId, sendMessage } from '@/lib/storage';

interface JobChatProps {
  job: Job;
}

export default function JobChat({ job }: JobChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = () => {
    const list = getMessagesByJobId(job.id);
    setMessages(list);
  };

  useEffect(() => {
    loadMessages();
  }, [job.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || !user) return;

    const newMsg: Message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      jobId: job.id,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      text,
      createdAt: new Date().toISOString(),
    };

    sendMessage(newMsg);
    setInputText('');
    loadMessages();
  };

  const isParticipant =
    user && (user.id === job.clientId || user.id === job.hiredStudentId || user.role === 'admin');

  if (!user) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-600 text-sm">
        Please log in to access the task communication chat.
      </div>
    );
  }

  if (!isParticipant) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-600 text-sm">
        🔒 In-app direct chat is reserved for the task client, the hired student, and dispute
        arbitrators.
      </div>
    );
  }

  const quickPrompts =
    user.role === 'client'
      ? [
          'Hello! Please let me know your available schedule.',
          'Important: Please check the special care instructions.',
          'Work approved! Releasing the milestone now.',
        ]
      : [
          'Hi! I have started work on this task.',
          'Everything is on track. Updating you shortly!',
          'Task completed! I have submitted all details for your review.',
        ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-[520px] overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
          <h4 className="font-semibold text-slate-800 text-sm">Direct Task Workspace Chat</h4>
        </div>
        <div className="text-xs text-slate-600 font-medium">
          {job.hiredStudentId ? 'Active Hired Channel' : 'Pre-hire Consultation'}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/40">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-600">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-sm font-semibold text-slate-700">No messages yet</p>
            <p className="text-xs max-w-xs text-slate-600 mt-1">
              Start the conversation to discuss milestone details, scheduling, and coordinate work.
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.senderId === user.id;
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[85%] ${
                  isMe ? 'ml-auto' : 'mr-auto'
                }`}
              >
                <div className="flex items-center space-x-1.5 mb-1 px-1">
                  <span className="text-xs font-semibold text-slate-700">
                    {isMe ? 'You' : m.senderName}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                      m.senderRole === 'client'
                        ? 'bg-blue-100 text-blue-700'
                        : m.senderRole === 'student'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {m.senderRole}
                  </span>
                  <span className="text-[10px] text-slate-600">
                    {new Date(m.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isMe
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-600 shrink-0">Quick reply:</span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(p)}
            className="text-xs shrink-0 bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-600 px-2.5 py-1 rounded-full transition"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message, ask a question, or share instructions..."
            className="flex-1 border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2 text-sm outline-none transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition shadow-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
