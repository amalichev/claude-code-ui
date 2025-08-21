export interface AttachedFile {
  id: string;
  name: string;
  path: string;
  size: number;
  type: string;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachedFiles?: AttachedFile[];
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;
}

export interface Project {
  id: string;
  name: string;
  path: string;
  createdAt: Date;
  lastAccessedAt: Date;
}