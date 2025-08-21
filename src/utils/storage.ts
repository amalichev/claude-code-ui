import { Chat, Project } from '../types';

const STORAGE_KEYS = {
  CHATS: 'claude-code-ui-chats',
  PROJECTS: 'claude-code-ui-projects',
  ACTIVE_CHAT: 'claude-code-ui-active-chat',
  ACTIVE_PROJECT: 'claude-code-ui-active-project',
};

// Утилиты для работы с localStorage
const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage (${key}):`, error);
    }
  },
};

// Функции для работы с чатами
export const chatStorage = {
  save: (chats: Chat[]): void => {
    // Сериализуем даты в строки для JSON
    const serializedChats = chats.map(chat => ({
      ...chat,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages.map(message => ({
        ...message,
        timestamp: message.timestamp.toISOString(),
      })),
    }));
    storage.set(STORAGE_KEYS.CHATS, serializedChats);
  },

  load: (): Chat[] => {
    const serializedChats = storage.get<any[]>(STORAGE_KEYS.CHATS);
    if (!serializedChats) return [];

    // Десериализуем строки обратно в даты
    return serializedChats.map(chat => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((message: any) => ({
        ...message,
        timestamp: new Date(message.timestamp),
      })),
    }));
  },

  clear: (): void => {
    storage.remove(STORAGE_KEYS.CHATS);
  },
};

// Функции для работы с проектами
export const projectStorage = {
  save: (projects: Project[]): void => {
    const serializedProjects = projects.map(project => ({
      ...project,
      createdAt: project.createdAt.toISOString(),
      lastAccessedAt: project.lastAccessedAt.toISOString(),
    }));
    storage.set(STORAGE_KEYS.PROJECTS, serializedProjects);
  },

  load: (): Project[] => {
    const serializedProjects = storage.get<any[]>(STORAGE_KEYS.PROJECTS);
    if (!serializedProjects) return [];

    return serializedProjects.map(project => ({
      ...project,
      createdAt: new Date(project.createdAt),
      lastAccessedAt: new Date(project.lastAccessedAt),
    }));
  },

  clear: (): void => {
    storage.remove(STORAGE_KEYS.PROJECTS);
  },
};

// Функции для работы с активными состояниями
export const activeStateStorage = {
  saveActiveChat: (chatId: string | null): void => {
    storage.set(STORAGE_KEYS.ACTIVE_CHAT, chatId);
  },

  loadActiveChat: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.ACTIVE_CHAT);
  },

  saveActiveProject: (projectId: string | null): void => {
    storage.set(STORAGE_KEYS.ACTIVE_PROJECT, projectId);
  },

  loadActiveProject: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.ACTIVE_PROJECT);
  },

  clear: (): void => {
    storage.remove(STORAGE_KEYS.ACTIVE_CHAT);
    storage.remove(STORAGE_KEYS.ACTIVE_PROJECT);
  },
};

// Функция для очистки всех данных
export const clearAllStorage = (): void => {
  chatStorage.clear();
  projectStorage.clear();
  activeStateStorage.clear();
};