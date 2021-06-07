const { ipcRenderer } = require("electron");
const yes_btn = document.getElementById("yes");
const no_btn = document.getElementById("no");


yes_btn.addEventListener("click", function (event) {
    ipcRenderer.send('yes-btn');
});



no_btn.addEventListener("click", function (event) {
    ipcRenderer.send('no-btn');
});



