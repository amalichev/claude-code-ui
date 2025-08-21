import React, { useState, useEffect } from 'react';
import { Chat, Message, Project, AttachedFile } from './types';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import MessageInput from './components/MessageInput';
import ProjectManager from './components/ProjectManager';
import { chatStorage, projectStorage, activeStateStorage } from './utils/storage';

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);

  // Сохраняем чаты при их изменении
  useEffect(() => {
    if (chats.length > 0) {
      chatStorage.save(chats);
    }
  }, [chats]);

  // Сохраняем проекты при их изменении
  useEffect(() => {
    if (projects.length > 0) {
      projectStorage.save(projects);
    }
  }, [projects]);

  // Сохраняем активный чат при его изменении
  useEffect(() => {
    activeStateStorage.saveActiveChat(activeChat);
  }, [activeChat]);

  // Сохраняем активный проект при его изменении
  useEffect(() => {
    activeStateStorage.saveActiveProject(activeProject);
  }, [activeProject]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Project management functions
  const createProject = (name: string, path: string) => {
    const newProject: Project = {
      id: generateId(),
      name,
      path,
      createdAt: new Date(),
      lastAccessedAt: new Date(),
    };
    
    setProjects(prev => [newProject, ...prev]);
    setActiveProject(newProject.id);
    
    // Создаем новый чат для проекта
    setTimeout(() => {
      const newChat: Chat = {
        id: generateId(),
        title: `${name} Chat`,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        projectId: newProject.id,
      };
      
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newChat.id);
    }, 100);
  };

  const deleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId));
    if (activeProject === projectId) {
      setActiveProject(null);
    }
    // Удаляем чаты связанные с проектом
    setChats(prev => prev.filter(chat => chat.projectId !== projectId));
  };

  const selectProject = (projectId: string | null) => {
    setActiveProject(projectId);
    if (projectId) {
      // Обновляем время последнего доступа
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, lastAccessedAt: new Date() }
          : p
      ));
    }
  };

  const selectDirectory = async (): Promise<string | null> => {
    if (window.electronAPI) {
      return await window.electronAPI.selectDirectory();
    }
    return null;
  };

  const createNewChat = () => {
    const newChat: Chat = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      projectId: activeProject || undefined,
    };
    
    setChats(prev => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (activeChat === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId);
      if (remainingChats.length > 0) {
        setActiveChat(remainingChats[0].id);
      } else {
        setActiveChat(null);
      }
    }
  };

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === activeChat) || null;
  };

  const addMessage = (content: string, role: 'user' | 'assistant', attachedFiles?: AttachedFile[]) => {
    if (!activeChat) return;

    const newMessage: Message = {
      id: generateId(),
      content,
      role,
      timestamp: new Date(),
      attachedFiles,
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChat) {
        const updatedMessages = [...chat.messages, newMessage];
        let title = chat.title;
        
        if (chat.messages.length === 0 && role === 'user') {
          title = content.length > 30 ? content.substring(0, 30) + '...' : content;
        }
        
        return {
          ...chat,
          title,
          messages: updatedMessages,
          updatedAt: new Date(),
        };
      }
      return chat;
    }));
  };

  const handleSendMessage = async (content: string, attachedFiles?: AttachedFile[]) => {
    if (!activeChat) {
      createNewChat();
      setTimeout(() => {
        addMessage(content, 'user', attachedFiles);
        simulateClaudeResponse(content, attachedFiles);
      }, 100);
    } else {
      addMessage(content, 'user', attachedFiles);
      simulateClaudeResponse(content, attachedFiles);
    }
  };

  const simulateClaudeResponse = async (userMessage: string, attachedFiles?: AttachedFile[]) => {
    const currentChat = getCurrentChat();
    const currentProject = activeProject ? projects.find(p => p.id === activeProject) : null;
    
    // Добавляем индикатор загрузки
    const loadingMessage: Message = {
      id: generateId(),
      content: 'Claude is thinking...',
      role: 'assistant',
      timestamp: new Date(),
    };
    
    if (activeChat) {
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, loadingMessage],
            updatedAt: new Date(),
          };
        }
        return chat;
      }));
    }
    
    try {
      let response: string;
      
      if (window.electronAPI) {
        // Всегда используем реальную команду claude
        const workingDirectory = currentProject?.path;
        
        // Получаем пути к прикрепленным файлам
        const attachedFilePaths = attachedFiles?.map(f => f.path);
        
        response = await window.electronAPI.runClaudeCommand(userMessage, workingDirectory, attachedFilePaths);
      } else {
        // Fallback для веб-версии
        response = "Claude Code UI is running in web mode. Please use the Electron app for full Claude integration.";
      }
      
      // Убираем сообщение о загрузке и добавляем реальный ответ
      if (activeChat) {
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChat) {
            const messagesWithoutLoading = chat.messages.filter(m => m.id !== loadingMessage.id);
            const realResponse: Message = {
              id: generateId(),
              content: response,
              role: 'assistant',
              timestamp: new Date(),
            };
            
            return {
              ...chat,
              messages: [...messagesWithoutLoading, realResponse],
              updatedAt: new Date(),
            };
          }
          return chat;
        }));
      }
    } catch (error) {
      console.error('Claude command error:', error);
      
      // Убираем сообщение о загрузке и показываем ошибку
      if (activeChat) {
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChat) {
            const messagesWithoutLoading = chat.messages.filter(m => m.id !== loadingMessage.id);
            const errorMessage: Message = {
              id: generateId(),
              content: `Error connecting to Claude: ${error instanceof Error ? error.message : 'Unknown error occurred'}\n\nPlease make sure Claude Code is properly installed and configured.`,
              role: 'assistant',
              timestamp: new Date(),
            };
            
            return {
              ...chat,
              messages: [...messagesWithoutLoading, errorMessage],
              updatedAt: new Date(),
            };
          }
          return chat;
        }));
      }
    }
  };

  // Загружаем данные при запуске приложения
  useEffect(() => {
    const loadData = () => {
      // Загружаем проекты
      const savedProjects = projectStorage.load();
      if (savedProjects.length > 0) {
        setProjects(savedProjects);
      }

      // Загружаем чаты
      const savedChats = chatStorage.load();
      if (savedChats.length > 0) {
        setChats(savedChats);
      } else {
        // Если нет сохраненных чатов, создаем демонстрационный
        const sampleChat: Chat = {
          id: generateId(),
          title: 'Welcome Chat',
          messages: [
            {
              id: generateId(),
              content: 'Welcome to Claude Code UI! This is a demonstration chat interface.',
              role: 'assistant',
              timestamp: new Date(),
            }
          ],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setChats([sampleChat]);
        setActiveChat(sampleChat.id);
        return;
      }

      // Загружаем активные состояния
      const savedActiveProject = activeStateStorage.loadActiveProject();
      if (savedActiveProject && savedProjects.some(p => p.id === savedActiveProject)) {
        setActiveProject(savedActiveProject);
      }

      const savedActiveChat = activeStateStorage.loadActiveChat();
      if (savedActiveChat && savedChats.some(c => c.id === savedActiveChat)) {
        setActiveChat(savedActiveChat);
      } else if (savedChats.length > 0) {
        // Если нет активного чата, выбираем последний
        setActiveChat(savedChats[0].id);
      }
    };

    loadData();
  }, []);

  return (
    <div className="flex h-screen bg-claude-bg text-claude-text overflow-hidden">
      <div className="fixed top-0 left-0 right-0 h-8 z-50 drag-region"></div>
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onSelectChat={setActiveChat}
        onNewChat={createNewChat}
        onDeleteChat={deleteChat}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={selectProject}
        onCreateProject={createProject}
        onDeleteProject={deleteProject}
        onSelectDirectory={selectDirectory}
      />
      
      <div className="flex-1 flex flex-col ml-80 h-screen">
        <ChatArea 
          chat={getCurrentChat()} 
          activeProject={activeProject ? projects.find(p => p.id === activeProject) : null}
        />
      </div>
      <div className="fixed bottom-0 left-80 right-0 bg-claude-bg border-t border-claude-border">
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default App;