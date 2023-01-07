const electron = require("electron");

const { app, BrowserWindow, Menu, ipcMain } = electron;

// By convention could be "production", "development", "staging" or "test"
const isDev = process.env.NODE_ENV !== "production";
const isMac = process.platform === "darwin";

let mainWindow;
let addTodoWindow;

const menuTemplate = [
    // Top Level Menu Entries (e.g. `File`, `Edit` etc.)
    {
        label: "File",
        // Sub Level Menu Entries (e.g. `New Window`, `Save Window` etc.)
        submenu: [
            {
                label: "New Todo",
                accelerator: isMac ? "Command+N" : "Ctrl+N",
                click: createAddTodoWindow
            },
            {
                label: "Delete All Todos",
                accelerator: isMac ? "Command+Shift+D" : "Ctrl+Shift+D",
                click: () => {
                    mainWindow.webContents.send("todo:delete:all");
                }
            },
            {
                label: "Quit",
                // accelerator: (() => {
                //     if (isMac) {
                //         return "Command+q"
                //     } elseif (isWin) {
                //         return "Ctrl+q"
                //
                //     }
                // })(),
                // accelerator: "CmdOrCtrl+q",
                accelerator: isMac ? "Command+q" : "Ctrl+q",
                click: app.quit
            }
        ]
    }
];

// To prevent merging of the first menu entry with the `Electron` entry on make, insert a new empty entry in the first index of `menuTemplate`
// Each entry, needs a label, so we solve this by adding an empty label
// There are other ways to handle this like adding a inline object via the ternary operator ... isMac ? {...} : {...}
if (isMac) {
    menuTemplate.unshift({
        label: ""
    });
}

if (isDev) {
    menuTemplate.push({
        label: "Developer",
        submenu: [
            {
                role: "reload"
            },
            {
                label: "Toggle Dev Tools",
                accelerator: isMac ? "Command+Alt+I" : "Ctrl+Shift+I",
                click: (_item, focusedWindow) => {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}

function createAddTodoWindow() {
    addTodoWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: "Add New Todo",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // addTodoWindow.loadURL(`file://${__dirname}/addTodo.html`);
    addTodoWindow.loadFile("./addTodo.html");

    // Point `addTodoWindow` to `null` to allow JS to garbage collect it
    addTodoWindow.on("closed", () => (addTodoWindow = null));
}

// Receive todo from `addTodoWindow`
ipcMain.on("todo:add", (_event, todo) => {
    // Send todo to `mainWindow`
    mainWindow.webContents.send("todo:add", todo);
    addTodoWindow.close();
});

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // mainWindow.loadURL(`file://${__dirname}/main.html`);
    mainWindow.loadFile("./main.html");
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

    // if mainWindow closes, quit application and reset windows
    mainWindow.on("closed", () => {
        app.quit();
        mainWindow = null;
    });
}

app.on("ready", () => {
    createMainWindow();
});
