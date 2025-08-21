import React, { useRef, useEffect } from 'react';
import { Chat, Project } from '../types';
import MessageBubble from './MessageBubble';

interface ChatAreaProps {
  chat: Chat | null;
  activeProject?: Project | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ chat, activeProject }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-claude-bg">
        <div className="text-center">
          <div className="w-16 h-16 bg-claude-accent rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h2 className="text-2xl font-semibold text-claude-text mb-2">
            Welcome to Claude Code UI
          </h2>
          <p className="text-claude-text-secondary">
            Start a new conversation or select an existing chat from the sidebar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-claude-bg h-full">
      <header className="border-b border-claude-border p-4 flex-shrink-0">
        <h1 className="text-xl font-semibold text-claude-text truncate">
          {chat.title}
        </h1>
        {activeProject && (
          <div className="mt-2 flex items-center text-sm text-claude-text-secondary">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="whitespace-nowrap">Project: {activeProject.name}</span>
            <span className="mx-2">•</span>
            <span className="truncate">{activeProject.path}</span>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {chat.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-claude-text-secondary text-lg">
                No messages yet. Start the conversation below!
              </p>
            </div>
          </div>
        ) : (
          <>
            {chat.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default ChatArea;