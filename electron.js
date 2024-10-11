const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');
const { exec } = require('child_process');

// Function to create the main Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Ensure the path to preload.js is correct
      nodeIntegration: false, // Keep Node integration disabled for security
      contextIsolation: true,  // Use context isolation for secure renderer/main process communication
    },
  });

  // Load the React app (during development use the dev server, in production use build files)
  win.loadURL('http://localhost:3000'); // Ensure React dev server is running
  // For production, use: win.loadFile('path/to/your/build/index.html');

  // Optionally open DevTools
  // win.webContents.openDevTools();
}

// Handle commands from renderer via IPC
ipcMain.handle('run-command', (event, cliPath, args) => {
  return new Promise((resolve, reject) => {
    // Form the full command to be executed
    const command = `${cliPath} ${args.join(' ')}`;
 
    console.log(`Executing command: ${command}`); // Log the command being executed for debugging

    // Execute the command using child_process.exec
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${stderr}`); // Log errors
        reject(stderr); // Send the error back to the renderer
      } else {
        console.log(`Command output: ${stdout}`); // Log output for debugging
        resolve(stdout); // Send the output back to the renderer
      }
    });
  });
});

// Initialize the Electron app and create the window when ready
app.whenReady().then(createWindow);

// Handle the behavior for macOS (create a new window when the dock icon is clicked)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Quit the app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
