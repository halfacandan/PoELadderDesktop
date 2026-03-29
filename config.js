const params = new URL(location.href).searchParams;

document.getElementById('username').value = params.get('username');
document.getElementById('ladderIdentifier').value = params.get('ladderIdentifier');

var select = document.getElementById("skin");
const skin = params.get('skin');
for(var i = 0;i < select.options.length;i++){
    if(select.options[i].value == skin ){
        select.options[i].selected = true;
    }
}

document.getElementById('save').addEventListener('click', () => {
    window.electronAPI.saveConfig({
        "username": document.getElementById('username').value,
        "ladderIdentifier": document.getElementById('ladderIdentifier').value,
        "skin": document.getElementById('skin').value
    });
});