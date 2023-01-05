const electron = require("electron");
const ffmpeg = require("fluent-ffmpeg");

const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on("video:submit", (_event, path) => {
    ffmpeg.ffprobe(path, (error, data) => {
        if (error) {
            console.error(error);
        }

        mainWindow.webContents.send("video:duration", data.format.duration);
    });
});
