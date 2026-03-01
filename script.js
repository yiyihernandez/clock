let timeOffset = 0;
let activeAlarm = null;
let isMuted = false;
let currentTema = 'normal';
let library = []; 
let alarmaSonando = false; 
let globalVolume = 1.0; 
let esPersonalizado = false;

// Audio inicial - Nombre actualizado a FNAF
const musicaFNAF = new Audio('alarmamusica.mp3'); 
musicaFNAF.loop = true;

// Sonido base inicial
let alertaFinal = new Audio('ding.mp3'); 

document.addEventListener('click', () => {
    musicaFNAF.load();
    alertaFinal.load();
}, { once: true });

function updateClock() {
    let now = new Date();
    now.setMilliseconds(now.getMilliseconds() + timeOffset);
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    
    let currentTime24 = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
    let ampm = h >= 12 ? 'PM' : 'AM';
    let h12 = h % 12 || 12;

    document.getElementById("time").innerText = 
        `${h12.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
    document.getElementById("ampm").innerText = ampm;

    if (activeAlarm === currentTime24 && s === 0 && !alarmaSonando) {
        activarAlerta();
    }
}

function activarAlerta() {
    alarmaSonando = true;
    musicaFNAF.pause(); 
    
    alertaFinal.loop = true; 
    alertaFinal.volume = globalVolume;
    alertaFinal.muted = isMuted; 
    alertaFinal.currentTime = 0;
    alertaFinal.play().catch(e => console.log("Interacción requerida"));
    
    document.getElementById("clockWrapper").classList.add("alarm-ringing");
    document.getElementById("stopBtn").style.display = "block";
}

function stopAlarm() {
    alarmaSonando = false;
    activeAlarm = null;
    alertaFinal.pause();
    alertaFinal.loop = false;
    
    document.getElementById("clockWrapper").classList.remove("alarm-ringing");
    document.getElementById("stopBtn").style.display = "none";
    
    // Si el tema actual es FNAF, reanudar música
    if (currentTema === 'fnaf' && !isMuted) musicaFNAF.play();
}

function cambiarTema(tema) {
    esPersonalizado = false; 
    currentTema = tema;
    
    document.body.className = 'tema-' + tema;
    document.body.classList.remove('upload-color-active'); 

    document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
    // IMPORTANTE: Asegúrate que en tu HTML el ID del botón sea "btnFNAF"
    const btn = document.getElementById(tema === 'fnaf' ? 'btnFNAF' : 'btnNormal');
    if(btn) btn.classList.add('active');

    alertaFinal.pause();
    if (tema === 'normal') {
        musicaFNAF.pause();
        musicaFNAF.currentTime = 0;
        alertaFinal = new Audio('ding.mp3');
    } else if (tema === 'fnaf') {
        if (!isMuted && !alarmaSonando) musicaFNAF.play().catch(() => {});
        alertaFinal = new Audio('alarmaterminar.mp3');
    }
    
    alertaFinal.volume = globalVolume;
    alertaFinal.muted = isMuted;
}

// Mute y Volumen actualizados
function setVolume(v) {
    globalVolume = v;
    musicaFNAF.volume = v;
    if (alertaFinal) alertaFinal.volume = v;
    
    const label = document.getElementById('volLabel');
    if (label) label.innerText = Math.round(v * 100) + "%";
}

function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById("speakerIcon");
    
    musicaFNAF.muted = isMuted;
    if (alertaFinal) alertaFinal.muted = isMuted;

    if (isMuted) {
        musicaFNAF.pause();
        if (icon) icon.className = "fas fa-volume-mute";
    } else {
        if (currentTema === 'fnaf' && !alarmaSonando) musicaFNAF.play();
        if (icon) icon.className = "fas fa-volume-up";
    }
}

function manualVolume() {
    let input = prompt("Volumen (0-100):", globalVolume * 100);
    if (input !== null) {
        let val = parseInt(input);
        if (!isNaN(val) && val >= 0 && val <= 100) setVolume(val / 100);
    }
}

// Mod Amarillo (Biblioteca)
function saveCustomSound() {
    const fileInput = document.getElementById('userAudioInput');
    if (fileInput && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const newSound = { 
                name: document.getElementById('customName').value || "Sonido Pro", 
                icon: document.getElementById('iconSelect').value, 
                url: e.target.result 
            };
            library.push(newSound);
            updateSoundList();
            
            esPersonalizado = true;
            document.body.classList.add('upload-color-active');
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function updateSoundList() {
    const list = document.getElementById('soundList');
    if (!list) return;
    list.innerHTML = '';
    library.forEach((sound) => {
        const div = document.createElement('div');
        div.className = 'sound-item-pro';
        div.innerHTML = `<i class="fas ${sound.icon}"></i> ${sound.name}`;
        div.onclick = () => {
            alertaFinal.pause();
            alertaFinal = new Audio(sound.url);
            
            alertaFinal.volume = globalVolume;
            alertaFinal.muted = isMuted;
            alertaFinal.loop = true;
            
            esPersonalizado = true;
            document.body.classList.remove('tema-normal', 'tema-fnaf');
            document.body.classList.add('upload-color-active');
            
            document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
            
            alert("Alarma personalizada: " + sound.name);
        };
        list.appendChild(div);
    });
}

function setAlarm() {
    const input = document.getElementById("alarmTime").value;
    if (input) { 
        activeAlarm = input; 
        alert("Alarma programada"); 
    }
}

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

setInterval(updateClock, 1000);
updateClock();