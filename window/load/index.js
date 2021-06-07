const { remote, ipcRenderer } = require("electron");;
const plus_button = document.getElementById("plus");
const minus_button = document.getElementById("minus");
const encounter = document.getElementById("encounter");
const temtem = document.getElementById("temtem");
const save_btn = document.getElementById("btn-save");
const data = require("electron").remote.getGlobal("savefile");

plus_button.addEventListener("click", () => {
    if (encounter.value < 10000) {
        encounter.value++
    }
});


//auto save every 30 secs
setTimeout(() => { ipcRenderer.send("save_data", document.getElementById("temtem").textContent, document.getElementById("encounter").value); console.log("The savefiles saved by autosave") }, 30000);



minus_button.addEventListener("click", () => {
    if (encounter.value > 0) {
        encounter.value--

    }
});


document.addEventListener("DOMContentLoaded", () => {
    temtem.innerHTML = data.temtem
    encounter.value = data.encounter
});


ipcRenderer.on("controls", () => {
    alert("Controls:\nincrement:+\ndecrement: -\nSave: Ctrl + S")
});



document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;
    if (e.keyCode == '107') {
        encounter.value++
    }
    else if (e.keyCode == '109') {
        if (encounter.value > 0) {
            encounter.value--
        }
    }

}



save_btn.addEventListener("click", (event, temtem, encounter) => {
    ipcRenderer.send("save_data", document.getElementById("temtem").textContent, document.getElementById("encounter").value);
    alert("Saved Done");
});

ipcRenderer.on("numadd", () => {
    if (encounter.value < 10000) {
        encounter.value++
    }
});


ipcRenderer.on("numsub", () => {
    if (encounter.value > 0) {
        encounter.value--

    }
});

ipcRenderer.on("save", () => {
    ipcRenderer.send("save_data", document.getElementById("temtem").textContent, document.getElementById("encounter").value);
    alert("Saved Done");
});
