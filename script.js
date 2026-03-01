let timeOffset = 0;
let activeAlarm = null;
let isMuted = false;
let currentTema = 'normal';

// Sonidos base
let musicaFNF = new Audio('alarmamusica.mp3'); //
musicaFNF.loop = true;

let alertaFinal = new Audio('alarmaterminar.mp3'); //
const alertaNormal = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');

// 1. Control de Volumen con la Rueda (Scroll) sobre el panel
const panel = document.getElementById('volumePanel');
const volLabel = document.getElementById('volLabel');

panel.addEventListener('wheel', (event) => {
    event.preventDefault();
    let change = event.deltaY > 0 ? -0.05 : 0.05;
    let newVol = Math.min(1, Math.max(0, musicaFNF.volume + change));
    
    musicaFNF.volume = newVol;
    alertaFinal.volume = newVol;
    alertaNormal.volume = newVol;
    
    volLabel.innerText = Math.round(newVol * 100) + "%";
});

// 2. Personalización de Alarma (Subir audio)
const userAudioInput = document.getElementById('userAudioInput');
userAudioInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            alertaFinal = new Audio(e.target.result); // Reemplaza el sonido de la alarma
            alert("¡Sonido de alarma personalizado cargado!");
        };
        reader.readAsDataURL(file);
    }
});

function toggleSettings() {
    const modal = document.getElementById('settingsModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Lógica de temas y reloj (se mantiene similar)
function cambiarTema(tema) {
    currentTema = tema;
    document.body.className = 'tema-' + tema;
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tema === 'fnf' ? 'btnFNF' : 'btnNormal').classList.add('active');
    
    musicaFNF.pause();
    if (tema === 'fnf' && !isMuted) musicaFNF.play();
}

function updateClock() {
    let now = new Date();
    now.setMilliseconds(now.getMilliseconds() + timeOffset);
    let h = now.getHours(), m = now.getMinutes(), s = now.getSeconds();
    let currentTime24 = h.toString().padStart(2, '0') + ":" + m.toString().padStart(2, '0');
    
    document.getElementById("time").innerText = `${h % 12 || 12}:${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    document.getElementById("ampm").innerText = h >= 12 ? 'PM' : 'AM';

    if (activeAlarm === currentTime24) {
        musicaFNF.pause();
        (currentTema === 'fnf' ? alertaFinal : alertaNormal).play(); //
        document.getElementById("clockWrapper").classList.add("alarm-ringing");
        document.getElementById("stopBtn").style.display = "block";
    }
}

function stopAlarm() {
    activeAlarm = null;
    alertaFinal.pause(); alertaFinal.currentTime = 0; //
    alertaNormal.pause(); alertaNormal.currentTime = 0;
    document.getElementById("clockWrapper").classList.remove("alarm-ringing");
    document.getElementById("stopBtn").style.display = "none";
    if (currentTema === 'fnf' && !isMuted) musicaFNF.play();
}

function toggleMute() {
    isMuted = !isMuted;
    const icon = document.getElementById("speakerIcon");
    if (isMuted) { musicaFNF.pause(); icon.className = "fas fa-volume-mute"; }
    else { if (currentTema === 'fnf') musicaFNF.play(); icon.className = "fas fa-volume-up"; }
}

function setAlarm() { activeAlarm = document.getElementById("alarmTime").value; alert("Alarma guardada"); }
function setClockTime() {
    const input = document.getElementById("alarmTime").value;
    if(input) {
        let [h, m] = input.split(':');
        let target = new Date(); target.setHours(h, m, 0);
        timeOffset = target - new Date();
    }
}

setInterval(updateClock, 1000);
updateClock();