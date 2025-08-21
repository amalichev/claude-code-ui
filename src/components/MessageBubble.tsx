import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-3xl ${isUser ? 'ml-12' : 'mr-12'}`}>
        {!isUser && (
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-claude-accent rounded-full flex items-center justify-center mr-3">
              <span className="text-white text-sm font-medium">C</span>
            </div>
            <span className="text-claude-text font-medium">Claude</span>
          </div>
        )}

        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-claude-accent text-white ml-auto'
              : 'bg-claude-input-bg text-claude-text'
          }`}
        >
          {message.attachedFiles && message.attachedFiles.length > 0 && (
            <div className="mb-3">
              <div className="text-xs mb-2 opacity-75">Attached files:</div>
              <div className="flex flex-wrap gap-2">
                {message.attachedFiles.map((file) => (
                  <div
                    key={file.id}
                    className={`flex items-center gap-2 px-2 py-1 rounded text-xs ${
                      isUser
                        ? 'bg-white/20 text-white'
                        : 'bg-claude-hover text-claude-text'
                    }`}
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
                    </svg>
                    <span className="truncate max-w-32">{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="whitespace-pre-wrap break-words message-content">{message.content}</div>
          <div className={`text-xs mt-2 ${isUser ? 'text-white/70' : 'text-claude-text-secondary'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {isUser && (
          <div className="flex items-center justify-end mt-2">
            <span className="text-claude-text font-medium mr-3">You</span>
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">U</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;