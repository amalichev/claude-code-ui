import React from 'react';
import { Chat, Project } from '../types';
import ProjectManager from './ProjectManager';

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  projects: Project[];
  activeProject: string | null;
  onSelectProject: (projectId: string | null) => void;
  onCreateProject: (name: string, path: string) => void;
  onDeleteProject: (projectId: string) => void;
  onSelectDirectory: () => Promise<string | null>;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  projects,
  activeProject,
  onSelectProject,
  onCreateProject,
  onDeleteProject,
  onSelectDirectory
}) => {
  // Фильтруем чаты по активному проекту
  const filteredChats = chats.filter(chat =>
    activeProject ? chat.projectId === activeProject : !chat.projectId
  );

  return (
    <div className="w-80 bg-claude-sidebar border-r border-claude-border flex flex-col h-screen fixed left-0 top-0">
      <div className="pt-8 flex-shrink-0"></div>
      <div className="flex-shrink-0">
        <ProjectManager
          projects={projects}
          activeProject={activeProject}
          onSelectProject={onSelectProject}
          onCreateProject={onCreateProject}
          onDeleteProject={onDeleteProject}
          onSelectDirectory={onSelectDirectory}
        />
      </div>

      <div className="p-4 border-b border-claude-border flex-shrink-0">
        <button
          onClick={onNewChat}
          className="w-full bg-claude-accent hover:bg-claude-accent/80 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          + New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`p-4 mb-1 rounded-lg transition-colors group flex items-center justify-between ${
              activeChat === chat.id
                ? 'bg-claude-hover text-claude-text'
                : 'text-claude-text-secondary hover:bg-claude-hover/50 hover:text-claude-text'
            }`}
          >
            <div
              onClick={() => onSelectChat(chat.id)}
              className="cursor-pointer flex-1 min-w-0 pr-2"
            >
              <div className="font-medium truncate">{chat.title}</div>
              <div className="text-xs text-claude-text-secondary mt-1">
                {chat.updatedAt.toLocaleDateString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-black/20 flex-shrink-0 self-center ${
                activeChat === chat.id
                  ? 'text-white'
                  : 'text-red-400'
              }`}
              title="Delete chat"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3,6 5,6 21,6"></polyline>
                <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-claude-border flex-shrink-0">
        <div className="text-xs text-claude-text-secondary text-center">
          Claude Code UI v1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;