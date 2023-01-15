const electron = require("electron");
const path = require("path");
const { Tray, Menu, app } = electron;

const getIconPath = isWin => {
    const winIconName = "windows-icon@2x.png";
    const defaultIconName = "iconTemplate.png";
    const iconName = isWin ? winIconName : defaultIconName;
    const iconPath = path.join(__dirname, `../src/assets/${iconName}`);

    return iconPath;
};

class TimerTray extends Tray {
    constructor({ mainWindow, isWin }) {
        super(getIconPath(isWin));

        this.mainWindow = mainWindow;
        this.on("click", this.onClick.bind(this));
        this.on("right-click", this.onRightClick.bind(this));
        this.setToolTip("Timer App");
    }

    onClick = (_event, bounds) => {
        if (this.mainWindow.isVisible()) {
            this.mainWindow.hide();
        } else {
            this.mainWindow.setBounds({
                x: bounds.x,
                y: bounds.y,
                width: 300,
                height: 500
            });

            this.mainWindow.show();
        }
    };

    onRightClick = () => {
        const menuConfig = Menu.buildFromTemplate([
            {
                label: "Quit Timer App",
                click: () => {
                    app.quit();
                }
            }
        ]);

        this.popUpContextMenu(menuConfig);
    };
}

module.exports = TimerTray;
