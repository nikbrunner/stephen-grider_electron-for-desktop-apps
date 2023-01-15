const electron = require("electron");

const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
    constructor(options) {
        super(options);
        this.loadFile(options.file);
        this.on("blur", this.hide);
    }
}

module.exports = MainWindow;
