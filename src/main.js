const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const pigpio = require('pigpio-client').pigpio;
const gpioClient = pigpio();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}
let mainWindow
const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      contextIsolation: true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

let contestantButtons = []
let resetButton = null
let startButton = null
let buzzer = null

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.disableHardwareAcceleration();
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  gpioClient.once('connected', () => {
    // GPIO setup
    const bPins = [2, 3, 4, 14, 15];
    const resetPin = 17;
    const startPin = 18;
    const buzzerPin = 27;

    // Contestants
    contestantButtons = bPins.map(pin => {
      const button = gpioClient.gpio(pin)
      button.modeSet('input')
      button.glitchSet(10000) // Set glitch filter to 10ms
      button.notify((level) => {
        mainWindow.webContents.send('gpio-event', {
          type: 'contestant',
          index: bPins.indexOf(pin),
          pin: pin,
          value: level,
          timestamp: new Date().toISOString(),
        })
      })
      return button;
    });

    // Reset button
    resetButton = gpioClient.gpio(resetPin);
    resetButton.modeSet('input');
    resetButton.glitchSet(10000);
    resetButton.notify((level) => {
        mainWindow.webContents.send('gpio-event', {
            type: 'reset',
            pin: resetPin,
            value: level,
            timestamp: new Date().toISOString(),
        });
    });

    // Start button
    startButton = gpioClient.gpio(startPin);
    startButton.modeSet('input');
    startButton.glitchSet(10000);
    startButton.notify((level) => {
        mainWindow.webContents.send('gpio-event', {
            type: 'start',
            pin: startPin,
            value: level,
            timestamp: new Date().toISOString(),
        });
    });

    // Buzzer setup
    buzzer = gpioClient.gpio(buzzerPin);
    buzzer.modeSet('output');
    buzzer.glitchSet(10000);
    ipcMain.on('buzzer', (event, data) => {
      console.log(`Buzzing signal received for ${data.length}ms`)
      const length = data.length || 500; // Default to 500ms if no length is provided
      buzzer.write(1); // Turn buzzer on
        setTimeout(() => {
          buzzer.write(0); // Turn buzzer off
        }, length); // Buzz for 500ms
    });

    console.log('GPIO setup complete');
    mainWindow.webContents.send('gpio-event', {
      type: 'loaded',
      index: -1,
      pin: -1,
      value: -1,
      timestamp: new Date().toISOString(),
    })
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
