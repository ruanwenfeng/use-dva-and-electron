global.electron = require('electron')
const path = require('path')
function setSrc(src){
    const img = document.getElementsByTagName('img')[0];
    img.src = src;
}
const {ipcRenderer} = global.electron
ipcRenderer.on('src-change', (event, arg)=>{
    setSrc(arg)
})