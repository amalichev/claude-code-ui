import { contextBridge, ipcRenderer } from 'electron';

const electronAPI = {
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  selectFiles: () => ipcRenderer.invoke('select-files'),
  runClaudeCommand: (command: string, workingDirectory?: string, attachedFiles?: string[]) => 
    ipcRenderer.invoke('run-claude-command', command, workingDirectory, attachedFiles),
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

export type ElectronAPI = typeof electronAPI;