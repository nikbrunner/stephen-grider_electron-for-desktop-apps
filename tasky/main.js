const { app, ipcMain } = require("electron");

const TimerTray = require("./app/timer_tray");
const MainWindow = require("./app/main_window");

const isWin = process.platform === "win32";

let mainWindow;
let mainTray;

app.on("ready", () => {
    // hide electron app icon from dock
    app.dock.hide();

    mainWindow = new MainWindow({
        file: "./src/index.html",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            backgroundThrottling: false
        },
        frame: false,
        resizable: false,
        show: false
    });

    mainTray = new TimerTray({
        mainWindow,
        isWin
    });
});

ipcMain.on("update-timer", (_event, timeLeft) => {
    mainTray.setTitle(timeLeft);
});
