function addOption(list, label, value, selectedValue){
    let opt = document.createElement('option');
    opt.innerHTML = label;
    opt.value = value;
    opt.selected = value == selectedValue;
    list.appendChild(opt);
}

function selectOption(list, selectedValue){
    for(var i = 0;i < list.options.length;i++){
        if(list.options[i].value == selectedValue){
            list.options[i].selected = true;
        }
    }
}

const params = new URL(location.href).searchParams;

let username = params.get('username')?.replace(/-(\d{4})$/, "#$1");
if(username == "undefined" || username == ""){
    username = null;
}
document.getElementById('username').value = username;

selectOption(
    document.getElementById('logo'),
    params.get('logo')
);

let selectedLadder = params.get('ladderIdentifier');
let selectedSkin = params.get('skin');
window.bridge.sendSettings((_, settings) => {

    let defaultLadder = settings.Ladders.filter((ladder) => 
        ladder.temporaryLeague
        && !(ladder.hardcore ?? false)
        && !(ladder.ruthless ?? false)
        && !(ladder.hardcore ?? false)
        && !(ladder.isPoe2 ?? false)
        && !(ladder.trade ?? false)
        && !(ladder.event ?? false)
    )[0]?.identifier ?? null;
    let ladderSelect = document.getElementById('ladderIdentifier') ?? defaultLadder ?? null;
    settings.Ladders.forEach((ladder) => {
        addOption(ladderSelect, ladder.name, ladder.identifier, selectedLadder);
    });

    let skinSelect = document.getElementById('skin');
    settings.Skins.forEach((skin) => {
        addOption(skinSelect, skin.label, skin.value, selectedSkin);
    });
});

document.getElementById('save').addEventListener('click', () => {
    window.electronAPI.saveConfig({
        'username': document.getElementById('username').value?.replace(/-(\d{4})$/, "#$1"),
        'ladderIdentifier': document.getElementById('ladderIdentifier').value,
        'skin': document.getElementById('skin').value,
        'logo': document.getElementById('logo').value,
    });
});