'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Message, Job } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { getMessagesByJobId, sendMessage } from '@/lib/storage';
import { Send, Sparkles, CheckCheck, Lock, ShieldCheck, User as UserIcon } from 'lucide-react';

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
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center text-zinc-400 text-xs font-mono">
        Please log in to access the task communication workspace.
      </div>
    );
  }

  if (!isParticipant) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center text-zinc-400 text-xs font-mono space-y-2">
        <Lock className="w-5 h-5 text-amber-400 mx-auto" />
        <p>🔒 In-app direct chat is reserved for the task client, the hired student, and dispute arbitrators.</p>
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
    <div className="bg-white border border-zinc-200 rounded-3xl shadow-xs flex flex-col h-[540px] overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-950 border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between text-white">
        <div className="flex items-center space-x-2.5">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <h4 className="font-bold text-sm tracking-tight">Direct Task Workspace Chat</h4>
        </div>
        <div className="text-[11px] text-zinc-400 font-mono font-bold">
          {job.hiredStudentId ? 'Active Hired Channel (Escrow Locked)' : 'Pre-hire Consultation'}
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-zinc-50/60">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-xs font-mono font-bold text-zinc-700">No messages in this workspace yet</p>
            <p className="text-[11px] text-zinc-500 max-w-xs mt-1">
              Coordinate schedule, task milestones, and photo receipts safely inside GSAP.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === user.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center space-x-1.5 mb-1 text-[11px] text-zinc-400 font-mono">
                  <span className="font-semibold text-zinc-700">{msg.senderName}</span>
                  <span className="text-zinc-300">•</span>
                  <span className="capitalize text-zinc-500">({msg.senderRole})</span>
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                    isMe
                      ? 'bg-zinc-950 text-white rounded-tr-none'
                      : 'bg-white border border-zinc-200 text-zinc-800 rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>

                <div className="flex items-center space-x-1 mt-1 text-[10px] text-zinc-400 font-mono">
                  <span>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {isMe && <CheckCheck className="w-3 h-3 text-amber-500" />}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-white border-t border-zinc-100 flex items-center space-x-2 overflow-x-auto text-[11px]">
        <span className="text-zinc-400 font-mono text-[10px] uppercase font-bold shrink-0">
          Quick Suggestions:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-amber-100 hover:text-amber-900 text-zinc-600 transition shrink-0"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3 bg-white border-t border-zinc-200">
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
            placeholder="Type your message, milestone update, or question..."
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-sans"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-zinc-950 font-bold rounded-xl text-xs transition shadow-glow-amber flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
