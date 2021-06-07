const { ipcRenderer, remote } = require("electron");
const electronLocalshortcut = require('electron-localshortcut');
const btn = document.getElementById("continue");


btn.addEventListener("click", (event, temtem) => {
        let name = document.getElementById("input").value;
        if (name.length > 0) {
                ipcRenderer.send("checker", document.getElementById("input").value);
        }
});