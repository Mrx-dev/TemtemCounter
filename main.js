const { app, BrowserWindow, Menu, shell, ipcMain, dialog, globalShortcut, webContents, Tray } = require('electron');
const path = require('path');
const fs = require("fs");
const { mainModule } = require('process');
const log = require('electron-log');
const { WebContents } = require('electron/main');
const appPath = `${app.getAppPath()}`;
// default pages
var WindowMain;
var LoadPageWindow;
var NewPageWindow;
// menu pages
var MenupageNew;
var MenupageLoad;



function MenuBar() {
    const templates = [
        {
            label: "File",
            submenu: [
                {
                    label: "New",
                    click: () => {
                        MenupageNew = new BrowserWindow({
                            width: 800,
                            height: 500,
                            center: false,
                            icon: appPath + '/icons/Temtem.jpg',
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: false
                            }
                        })
                        LoadPageWindow.hide();
                        LoadPageWindow.close();
                        MenupageNew.loadURL(__dirname + "/window/new/index.html");
                    }
                }
                ,
                {
                    label: "Load",
                    click: () => {
                        dialog.showOpenDialog(WindowMain, {
                            title: "Temtem Counter",
                            defaultPath: appPath + '/savefiles',
                            buttonLabel: "Choose the save file",
                            filters: [
                                {
                                    name: "Save File",
                                    extensions: ["json", "json"]
                                }
                            ],
                            properties: ["openFile"]
                        }).then((fileinfo) => {
                            if (!fileinfo["canceled"]) {
                                fs.readFile(String(fileinfo['filePaths'], "utf8"), (err, data) => {
                                    if (err) {
                                        dialog.showErrorBox("Error with reading", "somthing gose wrong with save data");
                                        log.warn("somthing gose wrong with save data");
                                    }
                                    else {
                                        data = JSON.parse(data);
                                        if (typeof (data["temtem"]) === "string" && typeof (data["encounter"]) === "number") {

                                            global.savefile = {
                                                "temtem": data["temtem"],
                                                "encounter": data["encounter"]
                                            }
                                            MenupageLoad = new BrowserWindow({
                                                width: 800,
                                                height: 500,
                                                minWidth: 300,
                                                minHeight: 250,
                                                icon: appPath + '/icons/Temtem.jpg',
                                                center: false,
                                                title: "Temtem Counter",
                                                alwaysOnTop: false,
                                                webPreferences: {
                                                    nodeIntegration: true,
                                                    contextIsolation: false,
                                                    enableRemoteModule: true
                                                }
                                            })
                                            try {
                                                WindowMain.hide();
                                                WindowMain.close();
                                            }
                                            catch {
                                                MenupageLoad.hide();
                                                MenupageLoad.close();
                                            }
                                            MenuBar();
                                            LoadPageWindow.loadURL(__dirname + "/window/load/index.html");
                                        }
                                        else {
                                            dialog.showErrorBox("Error", "Wrong SaveFile");
                                            log.warn("Wrong savefile");
                                        }
                                    }
                                })
                            }
                            else {
                                log.warn("you canceled the load process.");
                            }
                        });
                    }
                }
            ]
        },
        {
            label: "Help",
            submenu: [
                {
                    label: "Developer Website",
                    click: () => {
                        shell.openExternal("https://mrxdev.ml/");
                    }
                }
            ]
        }
    ]
    const menu = Menu.buildFromTemplate(templates);
    Menu.setApplicationMenu(menu);
}


function createWindow() {
    tray = new Tray("./icons/Temtem.jpg");
    tray.on("click", () => {
        console.log("you click my icon");
    });
    tray.setToolTip('Temtem Counter')
    WindowMain = new BrowserWindow({
        width: 800,
        height: 500,
        minWidth: 300,
        minHeight: 250,
        icon: appPath + '/icons/Temtem.jpg',
        center: false,
        title: "Temtem Counter",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    let mainmenu = Menu.buildFromTemplate([{
        label: "Developer",
        submenu: [
            {
                label: "Developer Website",
                click: () => {
                    shell.openExternal("https://mrxdev.ml/");
                }
            }
        ]
    }]);
    Menu.setApplicationMenu(mainmenu);
    WindowMain.loadFile('./window/main/index.html');









}







ipcMain.on('yes-btn', (event) => {
    dialog.showOpenDialog(WindowMain, {
        title: "Temtem Counter",
        defaultPath: appPath + '/savefiles',
        buttonLabel: "Choose the save file",
        filters: [
            {
                name: "Save File",
                extensions: ["json", "json"]
            }
        ],
        properties: ["openFile"]
    }).then((fileinfo) => {
        if (!fileinfo["canceled"]) {
            fs.readFile(String(fileinfo['filePaths'], "utf8"), (err, data) => {
                if (err) {
                    dialog.showErrorBox("Error with reading", "somthing gose wrong with save data");
                    log.warn("somthing gose wrong with save data");
                }
                else {
                    data = JSON.parse(data);
                    if (typeof (data["temtem"]) === "string" && typeof (data["encounter"]) === "number") {

                        global.savefile = {
                            "temtem": data["temtem"],
                            "encounter": data["encounter"]
                        }
                        LoadPageWindow = new BrowserWindow({
                            width: 800,
                            height: 500,
                            minWidth: 300,
                            minHeight: 250,
                            center: false,
                            icon: appPath + '/icons/Temtem.jpg',
                            title: "Temtem Counter",
                            alwaysOnTop: false,
                            webPreferences: {
                                nodeIntegration: true,
                                contextIsolation: false,
                                enableRemoteModule: true
                            }
                        })
                        MenuBar();
                        LoadPageWindow.loadURL(__dirname + "/window/load/index.html");
                        WindowMain.hide();
                        WindowMain.close();
                    }
                    else {
                        dialog.showErrorBox("Error", "Wrong SaveFile");
                        log.warn("Wrong savefile");
                    }
                }
            })
        }
        else {
            log.warn("you canceled the load process.");
        }
    });
});
try {

    ipcMain.on("save_data", (event, temtem, encounter) => {
        let appPath = `${app.getAppPath()}/savefiles`;
        let savedata = {
            temtem: temtem,
            encounter: parseInt(encounter)
        }
        let data = JSON.stringify(savedata);
        fs.writeFile(`${appPath}/${temtem}.json`, data, (err) => {
            if (err) throw err;
            log.info("Data have been saved.")
        });
    });
}
catch { }


ipcMain.on('no-btn', (event) => {
    NewPageWindow = new BrowserWindow({
        width: 800,
        height: 400,
        resizable: false,
        icon: appPath + '/icons/Temtem.jpg',
        center: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    })
    WindowMain.hide();
    WindowMain.close();
    let NewMenu = Menu.buildFromTemplate([{
        label: "Developer",
        submenu: [
            {
                label: "Developer Website",
                click: () => {
                    shell.openExternal("https://mrxdev.ml/");
                }
            }
        ]
    }]);
    Menu.setApplicationMenu(NewMenu);
    NewPageWindow.loadURL(__dirname + "/window/new/index.html");
});



try {

    ipcMain.on("checker", (event, temtem) => {
        global.savefile = {
            "temtem": temtem,
            "encounter": 0
        }
        LoadPageWindow = new BrowserWindow({
            width: 800,
            height: 500,
            minWidth: 300,
            minHeight: 400,
            center: false,
            icon: appPath + '/icons/Temtem.jpg',
            title: "Temtem Counter",
            alwaysOnTop: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        })
        MenuBar();
        try {

            NewPageWindow.hide();
            NewPageWindow.close();
        }
        catch {
            MenupageNew.hide();
            MenupageNew.close();
        }
        LoadPageWindow.loadURL(__dirname + "/window/load/index.html");
        LoadPageWindow.webContents.openDevTools();
    });
}
catch { }

app.whenReady().then(() => {
    createWindow()
    globalShortcut.register('numadd', () => {
        try {
            LoadPageWindow.webContents.send("numadd");
        }
        catch { }
    });
    globalShortcut.register('numsub', () => {
        try {
            LoadPageWindow.webContents.send("numsub");
        }
        catch { }
    });
    globalShortcut.register('Ctrl+S', () => {
        try {
            LoadPageWindow.webContents.send("save");
        }
        catch { }
    });
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
});



app.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    WindowMain = null
    LoadPageWindow = null
    NewPageWindow = null
});





app.on('window-all-closed', () => {
    console.log("ohhh all the window is closed :)")
    if (process.platform !== "darwin") {
        app.quit();
    }
});



app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

