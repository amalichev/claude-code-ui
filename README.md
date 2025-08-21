# Claude Code UI

A modern Electron-based graphical user interface for [Claude Code](https://claude.ai/code), providing an intuitive chat interface for interacting with Claude AI within your development workflow.

## Overview

Claude Code UI is a cross-platform desktop application that brings the power of Claude AI to your development environment through a clean, modern interface. Built with Electron, React, and TypeScript, it provides seamless integration with Claude Code's command-line interface while offering project management, file attachment capabilities, and persistent chat history.

## Features

- **Modern Chat Interface**: Clean, responsive UI designed for developer productivity
- **Project Management**: Organize your work by projects with directory-based context
- **File Attachments**: Attach files directly to your conversations for context-aware assistance
- **Persistent Chat History**: All conversations are automatically saved and restored
- **Real-time Claude Integration**: Direct integration with Claude Code CLI for authentic responses
- **Cross-platform Support**: Available for macOS, Windows, and Linux
- **Dark Theme**: Developer-friendly dark interface with Claude-inspired color scheme

## Prerequisites

- [Claude Code CLI](https://claude.ai/code) must be installed and configured
- Node.js 18+ or Bun runtime
- Operating System: macOS, Windows, or Linux

## Installation

### From Source

1. Clone the repository:
```bash
git clone https://github.com/your-username/claude-code-ui.git
cd claude-code-ui
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
# or
bun run dev
```

### Building for Production

1. Build the application:
```bash
npm run build:all
```

2. Create distributable packages:
```bash
npm run dist
```

The built application will be available in the `release/` directory.

## Development

### Project Structure

```
claude-code-ui/
├── src/                       # React application source
│   ├── components/            # React components
│   │   ├── ChatArea.tsx       # Main chat display area
│   │   ├── MessageBubble.tsx  # Individual message display
│   │   ├── MessageInput.tsx   # Message input with file attachments
│   │   ├── ProjectManager.tsx # Project management interface
│   │   └── Sidebar.tsx        # Navigation sidebar
│   ├── utils/                 # Utility functions
│   │   └── storage.ts         # Local storage management
│   ├── types.ts               # TypeScript type definitions
│   ├── App.tsx                # Main application component
│   └── main.tsx               # React application entry point
├── electron/                  # Electron main process
│   ├── main.ts                # Main Electron process
│   ├── preload.ts             # Preload script for security
│   └── tsconfig.json          # Electron TypeScript config
├── assets/icons/              # Application icons
├── scripts/                   # Build and utility scripts
└── dist/                      # Built application files
```

### Technologies Used

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop**: Electron 26
- **Build Tools**: Vite, electron-builder
- **Package Manager**: npm/bun
- **Styling**: Tailwind CSS with custom Claude theme

### Available Scripts

- `npm run dev` - Start development with hot reload
- `npm run build` - Build React application
- `npm run build:electron` - Build Electron main process
- `npm run build:all` - Build both React and Electron
- `npm run start` - Build and start the application
- `npm run dist` - Create distributable packages
- `npm run generate-icons` - Generate icon variants from SVG

## Configuration

### Claude Code Integration

The application automatically detects your Claude Code installation. Ensure Claude Code is:

1. Properly installed and available in your PATH
2. Authenticated with your Anthropic account
3. Accessible via the `claude` command

### Project Setup

1. Create a new project by clicking "New Project" in the sidebar
2. Select a directory that contains your code or project files
3. The application will use this directory as context for Claude Code commands

## Usage

### Basic Chat

1. Create a new chat or select an existing one from the sidebar
2. Type your message in the input field at the bottom
3. Press Enter or click Send to submit your message
4. Claude will respond based on the current project context

### File Attachments

1. Click the paperclip icon in the message input
2. Select one or more files to attach
3. The selected files will be included in your message context
4. Claude can analyze, modify, or reference these files in responses

### Project Management

1. Use the Projects section in the sidebar to manage your workspaces
2. Switch between projects to change the working directory context
3. Each project maintains its own chat history and context

## Building and Distribution

### Development Build

```bash
npm run dev
```

This starts both the React development server and Electron in development mode with hot reload.

### Production Build

```bash
npm run build:all
npm run dist
```

This creates optimized builds and generates platform-specific installers in the `release/` directory.

### Platform-Specific Notes

#### macOS
- Requires code signing for distribution
- Supports both Intel and Apple Silicon
- DMG installer included

#### Windows
- NSIS installer provided
- Windows Defender SmartScreen may require approval

#### Linux
- AppImage format for universal compatibility
- Requires GTK libraries

## Security

The application follows Electron security best practices:

- Context isolation enabled
- Node integration disabled in renderer
- Content Security Policy enforced
- No arbitrary code execution from web content

## Troubleshooting

### Claude Command Not Found

If you receive "Claude command not found" errors:

1. Verify Claude Code is installed: `which claude`
2. Ensure it's in your PATH
3. Try running `claude --version` in terminal
4. Restart the application after installing Claude Code

### Permission Issues

On macOS, if the app won't start:

1. Right-click the app and select "Open"
2. Allow the app in System Preferences > Security & Privacy
3. For development builds, run: `xattr -cr "Claude Code UI.app"`

### File Attachment Issues

If file attachments aren't working:

1. Check file permissions in the selected directory
2. Ensure the file paths are accessible
3. Try attaching files from your project directory

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit with clear messages: `git commit -m "Add feature description"`
5. Push to your fork: `git push origin feature-name`
6. Create a pull request

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

- Built for the [Claude Code](https://claude.ai/code) ecosystem
- Inspired by modern developer tools and AI-assisted development workflows
- Uses the Anthropic Claude AI API through Claude Code CLI

## Support

For issues and support:

1. Check the troubleshooting section above
2. Search existing issues in the GitHub repository
3. Create a new issue with detailed information about your problem
4. Include your operating system, Node.js version, and error messages

---

**Note**: This is an unofficial community project and is not affiliated with Anthropic. For official Claude Code documentation and support, visit [claude.ai/code](https://claude.ai/code).