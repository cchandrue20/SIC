'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { getSocket } from '@/lib/socket';

interface Message {
  _id: string;
  sender: { _id: string; email: string; role: string };
  content: string;
  read: boolean;
  createdAt: string;
}

interface ChatWindowProps {
  connectionId: string;
}

export default function ChatWindow({ connectionId }: ChatWindowProps) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/messages/${connectionId}`);
        setMessages(data.messages);
      } catch (err) {
        console.error('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [connectionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const socket = getSocket(token || undefined);

    socket.emit('join', connectionId);
    socket.emit('markRead', { connectionId });

    socket.on('newMessage', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('userTyping', ({ email, isTyping }: { email: string; isTyping: boolean }) => {
      setTypingUser(isTyping ? email : null);
    });

    socket.on('messagesRead', () => {
      setMessages(prev => prev.map(m => ({ ...m, read: true })));
    });

    return () => {
      socket.emit('leave', connectionId);
      socket.off('newMessage');
      socket.off('userTyping');
      socket.off('messagesRead');
    };
  }, [connectionId, token]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const socket = getSocket(token || undefined);
      socket.emit('sendMessage', { connectionId, content: newMessage.trim() });
      setNewMessage('');
      socket.emit('typing', { connectionId, isTyping: false });
    } catch (err) {
      // Fallback to HTTP
      try {
        const { data } = await api.post(`/messages/${connectionId}`, { content: newMessage.trim() });
        setMessages(prev => [...prev, data]);
        setNewMessage('');
      } catch {
        console.error('Failed to send message');
      }
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    const socket = getSocket(token || undefined);

    socket.emit('typing', { connectionId, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { connectionId, isTyping: false });
    }, 2000);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="glass flex-1 flex items-center justify-center">
        <div className="flex items-center gap-3 text-surface-400">
          <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          Loading messages...
        </div>
      </div>
    );
  }

  return (
    <div className="glass flex flex-col h-[calc(100vh-12rem)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-surface-400 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.sender._id === user?.id;
            return (
              <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 animate-scale-in ${
                  isOwn
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-tr-sm'
                    : 'bg-white/5 border border-white/10 text-surface-200 rounded-tl-sm'
                }`}>
                  {!isOwn && (
                    <p className="text-xs text-surface-400 mb-1">{msg.sender.email}</p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : ''}`}>
                    <span className="text-[10px] opacity-60">{formatTime(msg.createdAt)}</span>
                    {isOwn && msg.read && (
                      <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {typingUser && (
        <div className="px-4 py-1">
          <span className="text-xs text-surface-400 animate-pulse">
            {typingUser} is typing...
          </span>
        </div>
      )}

      {/* Input area */}
      <form onSubmit={handleSend} className="p-4 border-t border-white/5">
        <div className="flex gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={e => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1 text-sm"
            id="chat-message-input"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn-primary px-4"
            id="chat-send-button"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
