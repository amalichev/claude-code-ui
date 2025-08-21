import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';
import { spawn, execFile, exec } from 'child_process';
import * as path from 'path';

// Устанавливаем название приложения
app.setName('Claude Code UI');

// Устанавливаем информацию о приложении для macOS
if (process.platform === 'darwin') {
  app.setAboutPanelOptions({
    applicationName: 'Claude Code UI',
    applicationVersion: '1.0.0',
    copyright: '© 2024 Claude Code UI'
  });
}

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow;

const createWindow = (): void => {
  const iconPath = isDev 
    ? path.join(__dirname, '../assets/icons/icon.png')
    : path.join(__dirname, '../assets/icons/icon.png');
    
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: 'Claude Code UI',
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: 'hiddenInset',
    trafficLightPosition: { x: 20, y: 20 },
    show: false,
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    app.quit();
  });
};

const createMenu = (): void => {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: app.getName(),
      submenu: [
        { 
          label: `About ${app.getName()}`,
          role: 'about' 
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { 
          label: `Hide ${app.getName()}`,
          role: 'hide' 
        },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { 
          label: `Quit ${app.getName()}`,
          role: 'quit' 
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};

app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  
  return null;
});

ipcMain.handle('select-files', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'All Files', extensions: ['*'] },
      { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'] },
      { name: 'Documents', extensions: ['pdf', 'doc', 'docx', 'txt', 'md'] },
      { name: 'Code', extensions: ['js', 'ts', 'tsx', 'jsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go', 'rs'] },
    ],
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths;
  }
  
  return [];
});

ipcMain.handle('run-claude-command', async (event, command: string, workingDirectory?: string, attachedFiles?: string[]) => {
  return new Promise((resolve, reject) => {
    // Формируем промпт с прикрепленными файлами
    let enhancedPrompt = command;
    
    // Добавляем информацию о прикрепленных файлах в промпт
    if (attachedFiles && attachedFiles.length > 0) {
      const fileReferences = attachedFiles.map(filePath => `Please analyze this file: ${filePath}`).join('\n');
      enhancedPrompt = `${fileReferences}\n\n${command}`;
    }
    
    // Формируем аргументы для команды claude
    const args = ['-p', enhancedPrompt];
    
    // Добавляем рабочую директорию если указана
    if (workingDirectory) {
      args.push('--add-dir', workingDirectory);
    }
    
    // Добавляем директории прикрепленных файлов
    if (attachedFiles && attachedFiles.length > 0) {
      const uniqueDirs = [...new Set(attachedFiles.map(filePath => path.dirname(filePath)))];
      uniqueDirs.forEach(dir => {
        args.push('--add-dir', dir);
      });
    }
    
    console.log('Running claude with args:', args);
    console.log('Working directory:', workingDirectory || process.cwd());
    console.log('Attached files:', attachedFiles);
    
    // Динамически находим путь к claude
    let claudePath = 'claude';
    try {
      const { execSync } = require('child_process');
      claudePath = execSync('which claude', { encoding: 'utf-8' }).trim();
      console.log('Found claude at:', claudePath);
    } catch (e) {
      console.log('Could not find claude path, using default');
    }
    
    // Подготавливаем переменные окружения
    const env = {
      ...process.env,
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      USER: process.env.USER,
      SHELL: process.env.SHELL
    };
    
    console.log('Environment PATH:', env.PATH);
    console.log('Environment HOME:', env.HOME);
    
    // Формируем полную команду как строку с перенаправлением stdin
    const fullCommand = `"${claudePath}" ${args.map(arg => `"${arg}"`).join(' ')} < /dev/null`;
    console.log('Full command:', fullCommand);
    
    // Используем exec с shell для лучшей совместимости
    exec(fullCommand, {
      cwd: workingDirectory || process.cwd(),
      timeout: 0, // Убираем ограничение по времени
      env,
      maxBuffer: 1024 * 1024 * 10, // 10MB buffer
    }, (error, stdout, stderr) => {
      console.log('Claude exec completed');
      console.log('Error:', error);
      console.log('Stdout length:', stdout?.length || 0);
      console.log('Stdout preview:', stdout?.substring(0, 200));
      console.log('Stderr length:', stderr?.length || 0);
      console.log('Stderr preview:', stderr?.substring(0, 200));
      
      if (error) {
        console.log('Error details:', {
          code: error.code,
          signal: error.signal,
          killed: error.killed
        });
        
        if ((error as any).code === 'ENOENT') {
          reject(new Error('Claude command not found. Please ensure Claude Code is installed and accessible.'));
        } else if ((error as any).code === 143 || error.signal === 'SIGTERM' || error.killed) {
          reject(new Error('Claude command was terminated'));
        } else {
          const errorMsg = stderr?.trim() || error.message || 'Unknown error';
          reject(new Error(`Claude error: ${errorMsg}`));
        }
      } else {
        const result = stdout?.trim() || 'Claude responded but provided no output.';
        console.log('Resolving with result length:', result.length);
        resolve(result);
      }
    });
  });
});

app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });

  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:5173' && !isDev) {
      event.preventDefault();
    }
  });
});