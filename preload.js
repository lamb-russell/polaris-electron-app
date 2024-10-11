// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  runCommand: (command, args) => ipcRenderer.invoke('run-command', command, args),
});
