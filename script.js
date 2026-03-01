let timeOffset = 0;
let activeAlarm = null;
let isMuted = false;
let currentTema = 'normal';
let library = []; 

// iniciales
const musicaFNF = new Audio('alarmamusica.mp3'); 
musicaFNF.loop = true;

const alertaNormal = new Audio('fantasma.mp3'); 
let alertaFinal = new Audio('alarmaterminar.mp3'); 

function saveCustomSound() {
    const fileInput = document.getElementById('userAudioInput');
    const file = fileInput.files[0];
    const name = document.getElementById('customName').value || "Sonido Personalizado";
    const icon = document.getElementById('iconSelect').value;

    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newSound = { name, icon, url: e.target.result };
            library.push(newSound);
            updateSoundList();
            fileInput.value = ''; 
            document.getElementById('customName').value = ''; 
            
            //amarillo al guardar
            document.body.classList.add('upload-color-active');
            alert(`Sonido "${name}" guardado.`);
        };
        reader.readAsDataURL(file);
    } else {
        alert("Selecciona un archivo primero.");
    }
}

function updateSoundList() {
    const list = document.getElementById('soundList');
    list.innerHTML = '';
    library.forEach((sound, index) => {
        const div = document.createElement('div');
        div.className = 'sound-item-pro';
        div.innerHTML = `<i class="fas ${sound.icon}"></i> ${sound.name}`;
        div.onclick = () => selectAlarma(index);
        list.appendChild(div);
    });
}

function selectAlarma(index) {
    const sound = library[index];
    alertaFinal = new Audio(sound.url); 
    document.getElementById('activeAlarmName').innerText = sound.name;
    document.getElementById('activeAlarmIcon').className = `fas ${sound.icon}`;
    document.getElementById('currentAlarmInfo').style.display = 'block';
    
    // cambio color al del sonido
    document.body.classList.add('upload-color-active');
}

function cambiarTema(tema) {
    currentTema = tema;
    document.body.className = 'tema-' + tema;
    
    if (currentTema === 'fnf') {
        document.body.classList.remove('upload-color-active'); 
    }

    if (tema === 'normal') {
        alertaNormal.play().catch(() => console.log("Clickea en la página para activar audio"));
        musicaFNF.pause();
    }

    document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(tema === 'fnf' ? 'btnFNF' : 'btnNormal');
    if(btn) btn.classList.add('active');

    if (tema === 'fnf' && !isMuted) musicaFNF.play().catch(() => {});
}

function updateClock() {
    let now = new Date();
    now.setMilliseconds(now.getMilliseconds() + timeOffset);
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    
    // formato24h
    let currentTime24 = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
    
    // formato 12h
    let ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12 || 12;
    
    document.getElementById("time").innerText = 
        `${h12.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    document.getElementById("ampm").innerText = ampm;

    // disparador de la alarma
    if (activeAlarm === currentTime24 && s === 0) { 
        activarAlerta();
    }
}

function activarAlerta() {
    musicaFNF.pause();
    alertaFinal.play().catch(e => console.error("Error al sonar:", e));
    document.getElementById("clockWrapper").classList.add("alarm-ringing");
    document.getElementById("stopBtn").style.display = "block";
}

function stopAlarm() {
    activeAlarm = null;
    alertaFinal.pause();
    alertaFinal.currentTime = 0;
    document.getElementById("clockWrapper").classList.remove("alarm-ringing");
    document.getElementById("stopBtn").style.display = "none";
    if (currentTema === 'fnf' && !isMuted) musicaFNF.play().catch(() => {});
}

function setAlarm() {
    const input = document.getElementById("alarmTime").value;
    if (input) {
        activeAlarm = input;
        alert("Alarma programada para las " + input);
    }
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

setInterval(updateClock, 1000);
updateClock();