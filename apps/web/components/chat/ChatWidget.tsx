'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  MessageCircle, Send, Paperclip, Search, MoreVertical, 
  Users, Hash, Lock, X, Smile, Image, File, Check, CheckCheck 
} from 'lucide-react';
import { Button, Card, Input } from '../../../../packages/ui/src/index';
import { useWebSocket } from '../../hooks/useWebSocket';
import { formatDistanceToNow } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';

interface Thread {
  id: string;
  type: 'DIRECT' | 'GROUP' | 'ANNOUNCEMENT';
  title?: string;
  participants: Array<{
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
    };
  }>;
  lastMessage?: Message;
  unreadCount: number;
  lastActivityAt: string;
}

interface Message {
  id: string;
  threadId?: string;
  content: string;
  contentType: 'TEXT' | 'IMAGE' | 'FILE';
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  createdAt: string;
  isEdited: boolean;
  reads?: Array<{
    userId: string;
    readAt: string;
  }>;
  attachmentUrl?: string;
  attachmentName?: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { socket, sendMessage, onMessage, offMessage } = useWebSocket();

  useEffect(() => {
    fetchThreads();
    
    // Socket event listeners
    if (socket) {
      onMessage('chat:message', handleNewMessage);
      onMessage('chat:typing', handleTypingIndicator);
      onMessage('chat:read', handleMessageRead);
      onMessage('chat:thread:created', handleNewThread);
      
      return () => {
        offMessage('chat:message');
        offMessage('chat:typing');
        offMessage('chat:read');
        offMessage('chat:thread:created');
      };
    }
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/v1/chat/threads', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error('Failed to fetch threads:', error);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const response = await fetch(`/api/v1/chat/threads/${threadId}/messages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setMessages(data);
      markThreadAsRead(threadId);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedThread) return;

    try {
      const response = await fetch(`/api/v1/chat/threads/${selectedThread.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          content: messageInput,
          contentType: 'TEXT',
        }),
      });

      if (response.ok) {
        setMessageInput('');
        stopTyping();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleNewMessage = (message: Message) => {
    if (selectedThread && message.threadId === selectedThread.id) {
      setMessages((prev) => [...prev, message]);
    }
    
    // Update thread list
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === message.threadId
          ? { ...thread, lastMessage: message, lastActivityAt: message.createdAt }
          : thread
      )
    );
  };

  const handleTypingIndicator = ({ threadId, userId, isTyping }: any) => {
    if (selectedThread?.id === threadId) {
      if (isTyping) {
        setTypingUsers((prev) => Array.from(new Set([...prev, userId])));
      } else {
        setTypingUsers((prev) => prev.filter((id) => id !== userId));
      }
    }
  };

  const handleMessageRead = ({ messageId, userId }: any) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              reads: [...(msg.reads || []), { userId, readAt: new Date().toISOString() }],
            }
          : msg
      )
    );
  };

  const handleNewThread = (thread: Thread) => {
    setThreads((prev) => [thread, ...prev]);
  };

  const startTyping = () => {
    if (!isTyping && selectedThread) {
      setIsTyping(true);
      sendMessage('chat:typing', { threadId: selectedThread.id, isTyping: true });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 3000);
  };

  const stopTyping = () => {
    if (isTyping && selectedThread) {
      setIsTyping(false);
      sendMessage('chat:typing', { threadId: selectedThread.id, isTyping: false });
    }
  };

  const markThreadAsRead = async (threadId: string) => {
    try {
      await fetch(`/api/v1/chat/threads/${threadId}/read`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error) {
      console.error('Failed to mark thread as read:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getThreadIcon = (type: string) => {
    switch (type) {
      case 'GROUP':
        return <Users className="h-4 w-4" />;
      case 'ANNOUNCEMENT':
        return <Hash className="h-4 w-4" />;
      default:
        return <Lock className="h-4 w-4" />;
    }
  };

  const getMessageStatus = (message: Message, currentUserId: string) => {
    if (message.senderId !== currentUserId) return null;
    
    const readCount = message.reads?.filter((r) => r.userId !== currentUserId).length || 0;
    
    if (readCount > 0) {
      return <CheckCheck className="h-3 w-3 text-primary-500" />;
    }
    return <Check className="h-3 w-3 text-neutral-400" />;
  };

  const filteredThreads = threads.filter((thread) => {
    if (!searchQuery) return true;
    
    const participantNames = thread.participants
      .map((p) => `${p.user.firstName} ${p.user.lastName}`)
      .join(' ')
      .toLowerCase();
    
    return (
      thread.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      participantNames.includes(searchQuery.toLowerCase())
    );
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-500 text-white rounded-full p-4 shadow-lg hover:bg-primary-600 transition-colors z-40"
      >
        <MessageCircle className="h-6 w-6" />
        {threads.some((t) => t.unreadCount > 0) && (
          <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {threads.reduce((sum, t) => sum + t.unreadCount, 0)}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all ${
        isExpanded ? 'w-[800px] h-[600px]' : 'w-[400px] h-[500px]'
      }`}
    >
      <Card className="h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Messages</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isExpanded
                      ? 'M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
                      : 'M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5M4 8l5 5M4 8V4m0 4h4M4 4l5 5m11-5l-5 5m5-5v4m0-4h-4'
                  }
                />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Thread List */}
          <div className={`${isExpanded ? 'w-80' : 'w-full'} ${selectedThread && !isExpanded ? 'hidden' : ''} border-r border-neutral-200`}>
            {/* Search */}
            <div className="p-3 border-b border-neutral-100">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Search messages..."
                  className="pl-9 h-9 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Threads */}
            <div className="overflow-y-auto h-[380px]">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => {
                    setSelectedThread(thread);
                    fetchMessages(thread.id);
                  }}
                  className={`w-full p-3 hover:bg-neutral-50 transition-colors text-left ${
                    selectedThread?.id === thread.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      {thread.type === 'DIRECT' && thread.participants[0]?.user.avatar ? (
                        <img
                          src={thread.participants[0].user.avatar}
                          alt=""
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        getThreadIcon(thread.type)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-neutral-900 truncate">
                          {thread.title ||
                            thread.participants
                              .filter((p) => p.user.id !== 'currentUserId') // Replace with actual current user ID
                              .map((p) => `${p.user.firstName} ${p.user.lastName}`)
                              .join(', ')}
                        </h4>
                        {thread.unreadCount > 0 && (
                          <span className="bg-primary-500 text-white text-xs rounded-full px-2 py-0.5">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                      {thread.lastMessage && (
                        <p className="text-xs text-neutral-600 truncate mt-1">
                          {thread.lastMessage.content}
                        </p>
                      )}
                      <span className="text-xs text-neutral-400">
                        {formatDistanceToNow(new Date(thread.lastActivityAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          {selectedThread ? (
            <div className="flex-1 flex flex-col">
              {/* Thread Header */}
              <div className="p-3 border-b border-neutral-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!isExpanded && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedThread(null)}
                      className="p-1 mr-2"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </Button>
                  )}
                  <h4 className="font-medium">
                    {selectedThread.title ||
                      selectedThread.participants
                        .filter((p) => p.user.id !== 'currentUserId')
                        .map((p) => `${p.user.firstName} ${p.user.lastName}`)
                        .join(', ')}
                  </h4>
                  {typingUsers.length > 0 && (
                    <span className="text-xs text-neutral-500 italic">typing...</span>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="p-1">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => {
                  const isOwn = message.senderId === 'currentUserId'; // Replace with actual current user ID
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[70%] ${isOwn ? 'flex-row-reverse' : ''}`}>
                        {!isOwn && (
                          <div className="flex-shrink-0 w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
                            {message.sender.avatar ? (
                              <img
                                src={message.sender.avatar}
                                alt=""
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <span className="text-xs font-medium">
                                {message.sender.firstName[0]}
                              </span>
                            )}
                          </div>
                        )}
                        <div>
                          {!isOwn && (
                            <p className="text-xs text-neutral-500 mb-1">
                              {message.sender.firstName}
                            </p>
                          )}
                          <div
                            className={`rounded-lg px-3 py-2 ${
                              isOwn
                                ? 'bg-primary-500 text-white'
                                : 'bg-neutral-100 text-neutral-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            {message.isEdited && (
                              <span className="text-xs opacity-70">(edited)</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-neutral-400">
                              {formatDistanceToNow(new Date(message.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                            {getMessageStatus(message, 'currentUserId')}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-neutral-200">
                <div className="flex items-end gap-2">
                  <Button variant="ghost" size="sm" className="p-2">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => {
                        setMessageInput(e.target.value);
                        startTyping();
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="pr-10"
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-2 top-2 text-neutral-400 hover:text-neutral-600"
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2">
                        <EmojiPicker
                          onEmojiClick={(emojiObject) => {
                            setMessageInput((prev) => prev + emojiObject.emoji);
                            setShowEmojiPicker(false);
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-400">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-3" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
