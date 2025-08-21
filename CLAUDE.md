# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git Commit Guidelines

**Important commit requirements:**
- Write all commit messages in English
- Do not include Claude signatures or "Co-Authored-By: Claude" lines in commit messages
- Use conventional commit format: `type: description`
- Keep commit messages concise and descriptive

## Development Commands

**Development workflow:**
```bash
npm run dev                 # Start development server with hot reload
npm run build:all          # Build both React and Electron components
npm run start              # Build and start the production application
npm run dist               # Create distributable packages for all platforms
```

**Individual build commands:**
```bash
npm run build              # Build React app only (outputs to dist/)
npm run build:electron     # Build Electron main process only
npm run generate-icons     # Generate PNG icons from SVG source
```

**Development server details:**
- React dev server runs on port 5173
- Electron automatically launches after React server is ready
- Uses `concurrently` to run React dev server and Electron simultaneously

## Architecture Overview

This is an Electron-based desktop application that provides a GUI for Claude Code CLI. The architecture consists of three main layers:

### 1. Electron Layer (Desktop App Shell)
- **Main Process** (`electron/main.ts`): Manages application lifecycle, creates browser windows, handles system dialogs, and executes Claude CLI commands
- **Preload Script** (`electron/preload.ts`): Secure bridge between main process and renderer, exposes specific APIs to React app
- **IPC Communication**: Handles directory selection, file selection, and Claude command execution

### 2. React Frontend (Renderer Process)
- **Component Architecture**: 
  - `App.tsx`: Root component managing application state and data flow
  - `Sidebar.tsx`: Navigation with project management and chat list (filters chats by active project)
  - `ChatArea.tsx`: Main conversation display with project context indicator
  - `MessageInput.tsx`: Input field with file attachment capabilities
  - `ProjectManager.tsx`: Project creation/selection interface
  - `MessageBubble.tsx`: Individual message display component

### 3. Data Management
- **Local Storage** (`utils/storage.ts`): Persistent storage for chats, projects, and UI state
- **State Management**: React hooks for managing chat sessions, active projects, and file attachments
- **Data Flow**: Projects filter chats (each chat can be associated with a project), active project affects Claude command execution context

## Key Integration Points

### Claude Code CLI Integration
The application integrates with Claude Code through the main Electron process:
- Commands are executed with project directory context (`--add-dir` flag)
- File attachments are passed as additional directory contexts
- Working directory is set to active project path when available
- Error handling for missing Claude CLI installation

### Project-Chat Relationship
- Chats can be associated with projects (optional `projectId` field)
- Sidebar filters chats based on active project selection
- When no project is active, shows only chats without project association
- Project context is passed to Claude commands for better responses

### File Attachment System
- Files are selected through Electron's native file dialog
- File paths are stored in message metadata
- Attached files' parent directories are added to Claude command context
- UI shows file names with removal capability before sending

## Build System Details

### Development Build
- Uses Vite for React development with hot module replacement
- TypeScript compilation for both React and Electron code
- Tailwind CSS for styling with custom Claude theme colors
- Concurrent execution of React dev server and Electron

### Production Build
- React app builds to `dist/` directory
- Electron main process compiles TypeScript to JavaScript
- electron-builder creates platform-specific packages in `release/`
- Supports macOS (DMG), Windows (NSIS), and Linux (AppImage)

### Icon Generation
- Source SVG icon in `assets/icons/icon.svg`
- Script generates multiple PNG sizes (16px to 1024px)
- Platform-specific icon formats (ICNS for macOS, ICO for Windows)

## Storage Schema

### Chats
```typescript
interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;  // Links chat to project
}
```

### Projects  
```typescript
interface Project {
  id: string;
  name: string;
  path: string;        // Directory path for Claude context
  createdAt: Date;
  lastAccessedAt: Date;
}
```

### Messages with File Attachments
```typescript
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  attachedFiles?: AttachedFile[];
}
```

All data persists in localStorage with automatic serialization/deserialization of Date objects.