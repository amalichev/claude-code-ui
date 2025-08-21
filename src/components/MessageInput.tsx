import React, { useState, useRef } from 'react';
import { AttachedFile } from '../types';

interface MessageInputProps {
  onSendMessage: (content: string, attachedFiles?: AttachedFile[]) => void;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachedFiles.length > 0) && !disabled) {
      onSendMessage(message.trim(), attachedFiles.length > 0 ? attachedFiles : undefined);
      setMessage('');
      setAttachedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleFileSelect = async () => {
    if (window.electronAPI) {
      try {
        const filePaths = await window.electronAPI.selectFiles();
        const newFiles: AttachedFile[] = filePaths.map(path => {
          const name = path.split('/').pop() || path;
          return {
            id: Math.random().toString(36).substr(2, 9),
            name,
            path,
            size: 0, // В реальном приложении нужно получить размер файла
            type: name.split('.').pop() || 'unknown',
          };
        });
        setAttachedFiles(prev => [...prev, ...newFiles]);
      } catch (error) {
        console.error('Error selecting files:', error);
      }
    }
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 408)}px`; // 17 строк * 24px = 408px
    }
  };

  return (
    <div className="bg-claude-bg p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {attachedFiles.length > 0 && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-2">
              {attachedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-2 bg-claude-hover border border-claude-border rounded-lg px-3 py-1 text-sm"
                >
                  <span className="text-claude-text truncate max-w-40">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="text-claude-text-secondary hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="relative flex items-end">
          <div className="flex-1 relative bg-claude-input-bg border border-claude-border rounded-3xl overflow-hidden flex items-center">
            {/* Кнопка прикрепления файлов внутри поля */}
            <button
              type="button"
              onClick={handleFileSelect}
              disabled={disabled}
              className="absolute left-3 bottom-2.5 text-claude-text-secondary hover:text-claude-text disabled:opacity-50 disabled:cursor-not-allowed transition-colors p-1 rounded-full hover:bg-claude-hover"
              title="Attach files"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"/>
              </svg>
            </button>

            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="How can I help you today?"
              className="w-full resize-none bg-transparent pl-14 pr-14 py-3 text-claude-text placeholder-claude-text-secondary focus:outline-none"
              style={{ maxHeight: '408px' }}
              rows={1}
              disabled={disabled}
            />

            {/* Кнопка отправки внутри поля */}
            <button
              type="submit"
              disabled={(!message.trim() && attachedFiles.length === 0) || disabled}
              className="absolute right-3 bottom-2.5 bg-claude-accent hover:bg-claude-accent/80 disabled:bg-claude-accent/30 disabled:cursor-not-allowed text-white p-1.5 rounded-full transition-colors flex items-center justify-center"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/>
              </svg>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;