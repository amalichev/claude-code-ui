export interface ElectronAPI {
  selectDirectory: () => Promise<string | null>;
  selectFiles: () => Promise<string[]>;
  runClaudeCommand: (command: string, workingDirectory?: string, attachedFiles?: string[]) => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}